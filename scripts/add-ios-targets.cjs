// One-time setup of the Xcode project after `npx cap add ios`: adds Stim's Swift files to the
// App target, the StimMonitor extension target, entitlements and the iOS 16 minimum.
// Run from the repo root: node scripts/add-ios-targets.cjs   (needs `npm i -D xcode`)
const fs = require("fs"), path = require("path");
const xcode = require(process.env.XCODE_MODULE || "xcode");
const file = path.join(__dirname, "../ios/App/App.xcodeproj/project.pbxproj");
const p = xcode.project(file); p.parseSync();
const objs = p.hash.project.objects, q = s => `"${s}"`;
const BUNDLE = "com.bgalpers.stim", EXT = "StimMonitor";
if (Object.values(objs.PBXNativeTarget).some(t => typeof t === "object" && String(t.name).replace(/"/g, "") === EXT)) { console.log("Already set up."); process.exit(0); }

const appTarget = p.findTargetKey("App");
const mainGroup = objs.PBXProject[p.getFirstProject().uuid].mainGroup;
const appGroup = Object.entries(objs.PBXGroup).find(([k, g]) => typeof g === "object" && g.path === "App" && k !== mainGroup)[0];

// App target: plugin + view controller + shared code, entitlements, iOS 16
p.addSourceFile("ScreenTimePlugin.swift", { target: appTarget }, appGroup);
p.addSourceFile("StimViewController.swift", { target: appTarget }, appGroup);
p.addFile("App.entitlements", appGroup, { lastKnownFileType: "text.plist.entitlements" });

// Our own file references (the library dedupes by name, which would reuse the App's Info.plist)
const TYPES = { swift: "sourcecode.swift", plist: "text.plist.xml", entitlements: "text.plist.entitlements" };
const ref = name => {
  const uuid = p.generateUuid();
  objs.PBXFileReference[uuid] = { isa: "PBXFileReference", lastKnownFileType: TYPES[name.split(".").pop()], path: q(name), sourceTree: q("<group>") };
  objs.PBXFileReference[uuid + "_comment"] = name;
  return { value: uuid, comment: name };
};
const group = (name, children) => {
  const uuid = p.generateUuid();
  objs.PBXGroup[uuid] = { isa: "PBXGroup", children, path: name, sourceTree: q("<group>") };
  objs.PBXGroup[uuid + "_comment"] = name;
  objs.PBXGroup[mainGroup].children.push({ value: uuid, comment: name });
};
const compile = (fileRef, target) => {
  const uuid = p.generateUuid();
  objs.PBXBuildFile[uuid] = { isa: "PBXBuildFile", fileRef: fileRef.value, fileRef_comment: fileRef.comment };
  objs.PBXBuildFile[uuid + "_comment"] = `${fileRef.comment} in Sources`;
  p.pbxSourcesBuildPhaseObj(target).files.push({ value: uuid, comment: `${fileRef.comment} in Sources` });
};

const sharedRef = ref("StimShared.swift");
group("Shared", [sharedRef]);
compile(sharedRef, appTarget);

// StimMonitor extension target (addTarget also embeds it in the app and adds the dependency)
const ext = p.addTarget(EXT, "app_extension", EXT, `${BUNDLE}.monitor`);
const monitorRef = ref("StimMonitor.swift");
group(EXT, [monitorRef, ref("Info.plist"), ref("StimMonitor.entitlements")]);
p.addBuildPhase([], "PBXSourcesBuildPhase", "Sources", ext.uuid);
p.addBuildPhase([], "PBXResourcesBuildPhase", "Resources", ext.uuid);
p.addBuildPhase([], "PBXFrameworksBuildPhase", "Frameworks", ext.uuid);
compile(monitorRef, ext.uuid);
compile(sharedRef, ext.uuid);

// Build settings
const configsOf = target => objs.XCConfigurationList[objs.PBXNativeTarget[target].buildConfigurationList].buildConfigurations.map(c => objs.XCBuildConfiguration[c.value]);
for (const c of configsOf(appTarget)) Object.assign(c.buildSettings, { IPHONEOS_DEPLOYMENT_TARGET: "16.0", CODE_SIGN_ENTITLEMENTS: "App/App.entitlements" });
for (const c of configsOf(ext.uuid)) Object.assign(c.buildSettings, {
  PRODUCT_NAME: q(EXT), PRODUCT_BUNDLE_IDENTIFIER: `${BUNDLE}.monitor`, INFOPLIST_FILE: "StimMonitor/Info.plist",
  GENERATE_INFOPLIST_FILE: "YES", INFOPLIST_KEY_CFBundleDisplayName: EXT, INFOPLIST_KEY_NSHumanReadableCopyright: q(""),
  CODE_SIGN_ENTITLEMENTS: "StimMonitor/StimMonitor.entitlements", CODE_SIGN_STYLE: "Automatic",
  IPHONEOS_DEPLOYMENT_TARGET: "16.0", SDKROOT: "iphoneos", TARGETED_DEVICE_FAMILY: q("1,2"), SWIFT_VERSION: "5.0",
  SKIP_INSTALL: "YES", MARKETING_VERSION: "1.0", CURRENT_PROJECT_VERSION: "1",
  LD_RUNPATH_SEARCH_PATHS: q("$(inherited) @executable_path/Frameworks @executable_path/../../Frameworks"),
  APPLICATION_EXTENSION_API_ONLY: "YES",
});
for (const [, c] of Object.entries(objs.XCBuildConfiguration)) if (typeof c === "object" && c.buildSettings?.IPHONEOS_DEPLOYMENT_TARGET && !c.buildSettings.PRODUCT_BUNDLE_IDENTIFIER) c.buildSettings.IPHONEOS_DEPLOYMENT_TARGET = "16.0";

// The app depends on the extension so Xcode builds it first
const proxy = p.generateUuid(), dep = p.generateUuid(), projUuid = p.getFirstProject().uuid;
objs.PBXContainerItemProxy = objs.PBXContainerItemProxy || {};
objs.PBXContainerItemProxy[proxy] = { isa: "PBXContainerItemProxy", containerPortal: projUuid, containerPortal_comment: "Project object", proxyType: 1, remoteGlobalIDString: ext.uuid, remoteInfo: EXT };
objs.PBXContainerItemProxy[proxy + "_comment"] = "PBXContainerItemProxy";
objs.PBXTargetDependency = objs.PBXTargetDependency || {};
objs.PBXTargetDependency[dep] = { isa: "PBXTargetDependency", target: ext.uuid, target_comment: EXT, targetProxy: proxy, targetProxy_comment: "PBXContainerItemProxy" };
objs.PBXTargetDependency[dep + "_comment"] = "PBXTargetDependency";
objs.PBXNativeTarget[appTarget].dependencies.push({ value: dep, comment: "PBXTargetDependency" });
// Name the embed phase the way Xcode does
for (const [k, ph] of Object.entries(objs.PBXCopyFilesBuildPhase || {})) if (typeof ph === "object" && ph.dstSubfolderSpec == 13) { ph.name = q("Embed Foundation Extensions"); objs.PBXCopyFilesBuildPhase[k + "_comment"] = "Embed Foundation Extensions"; }
for (const ph of objs.PBXNativeTarget[appTarget].buildPhases) if (ph.comment === "Copy Files") ph.comment = "Embed Foundation Extensions";

// The library writes missing fields as the word "undefined"; drop them
let out = p.writeSync().replace(/ (?:fileEncoding|lastKnownFileType|explicitFileType) = undefined;/g, "");
out = out.replace(/in Copy Files \*\//g, "in Embed Foundation Extensions */");
fs.writeFileSync(file, out);
console.log("Added StimMonitor extension and Screen Time files.");
