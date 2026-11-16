// The bridge between the Stim web app and Apple's Screen Time frameworks.
// JS: Capacitor.registerPlugin("ScreenTime") → status(), authorize(), pickApps(), setUnlockedUntil({ until })
import Foundation
import SwiftUI
import Capacitor
import FamilyControls
import DeviceActivity

@objc(ScreenTimePlugin)
public class ScreenTimePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ScreenTimePlugin"
    public let jsName = "ScreenTime"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "status", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "authorize", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "pickApps", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setUnlockedUntil", returnType: CAPPluginReturnPromise),
    ]

    private func statusObject() -> [String: Any] {
        let selection = StimShared.loadSelection()
        let authorization: String
        switch AuthorizationCenter.shared.authorizationStatus {
        case .approved: authorization = "approved"
        case .denied: authorization = "denied"
        default: authorization = "notDetermined"
        }
        return [
            "authorization": authorization,
            "apps": selection.applicationTokens.count,
            "categories": selection.categoryTokens.count,
            "sites": selection.webDomainTokens.count,
            "unlockedUntil": StimShared.unlockedUntil.timeIntervalSince1970 * 1000,
        ]
    }

    @objc func status(_ call: CAPPluginCall) {
        DispatchQueue.main.async { call.resolve(self.statusObject()) }
    }

    /// Shows Apple's Screen Time permission prompt (individual use, not parental controls).
    @objc func authorize(_ call: CAPPluginCall) {
        Task { @MainActor in
            do { try await AuthorizationCenter.shared.requestAuthorization(for: .individual) }
            catch { /* declined or cancelled; status below reports it */ }
            call.resolve(self.statusObject())
        }
    }

    /// Shows Apple's app picker. Stim never sees which apps you chose, only opaque tokens and counts.
    @objc func pickApps(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard let presenter = self.bridge?.viewController else { return call.reject("No view to present from") }
            weak var host: UIViewController?
            let sheet = AppPickerSheet(selection: StimShared.loadSelection()) { picked in
                host?.dismiss(animated: true)
                if let picked {
                    StimShared.saveSelection(picked)
                    if StimShared.unlockedUntil <= Date() { StimShared.applyShield() }
                }
                call.resolve(self.statusObject())
            }
            let controller = UIHostingController(rootView: sheet)
            controller.isModalInPresentation = true
            host = controller
            presenter.present(controller, animated: true)
        }
    }

    /// Unlocks the chosen apps until `until` (ms since 1970). Zero or a past time locks them now.
    /// The StimMonitor extension puts the shield back at `until`, even if Stim isn't running.
    @objc func setUnlockedUntil(_ call: CAPPluginCall) {
        let until = Date(timeIntervalSince1970: (call.getDouble("until") ?? 0) / 1000)
        DispatchQueue.main.async {
            let center = DeviceActivityCenter()
            center.stopMonitoring([.stimUnlock])
            StimShared.unlockedUntil = until
            var result = self.statusObject()
            if until <= Date().addingTimeInterval(5) {
                StimShared.applyShield()
                result["locked"] = true
                return call.resolve(result)
            }
            StimShared.clearShield()
            result["locked"] = false
            do {
                try center.startMonitoring(.stimUnlock, during: StimShared.schedule(endingAt: until))
                result["scheduled"] = true
            } catch {
                result["scheduled"] = false
                result["error"] = error.localizedDescription
            }
            call.resolve(result)
        }
    }
}

struct AppPickerSheet: View {
    @State var selection: FamilyActivitySelection
    let done: (FamilyActivitySelection?) -> Void

    var body: some View {
        NavigationView {
            FamilyActivityPicker(selection: $selection)
                .navigationTitle("Apps to block")
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) { Button("Cancel") { done(nil) } }
                    ToolbarItem(placement: .confirmationAction) { Button("Done") { done(selection) } }
                }
        }
    }
}
