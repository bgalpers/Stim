// Shared by the app and the StimMonitor extension. Both read and write the same
// App Group, and both use the same named ManagedSettingsStore, so either one can
// put the shield back on.
import Foundation
import FamilyControls
import ManagedSettings
import DeviceActivity

enum StimShared {
    /// Must match the App Group in App.entitlements and StimMonitor.entitlements.
    static let appGroup = "group.com.bgalpers.stim"
    static let defaults = UserDefaults(suiteName: appGroup) ?? .standard
    static let store = ManagedSettingsStore(named: ManagedSettingsStore.Name("stim"))
    private static let selectionKey = "selection"
    private static let untilKey = "unlockedUntil"

    /// The apps, categories and websites you chose to block.
    static func loadSelection() -> FamilyActivitySelection {
        guard let data = defaults.data(forKey: selectionKey),
              let selection = try? JSONDecoder().decode(FamilyActivitySelection.self, from: data)
        else { return FamilyActivitySelection() }
        return selection
    }

    static func saveSelection(_ selection: FamilyActivitySelection) {
        if let data = try? JSONEncoder().encode(selection) { defaults.set(data, forKey: selectionKey) }
    }

    /// When the current unlock ends. In the past means locked.
    static var unlockedUntil: Date {
        get { Date(timeIntervalSince1970: defaults.double(forKey: untilKey)) }
        set { defaults.set(newValue.timeIntervalSince1970, forKey: untilKey) }
    }

    static func applyShield() {
        let s = loadSelection()
        store.shield.applications = s.applicationTokens.isEmpty ? nil : s.applicationTokens
        store.shield.applicationCategories = s.categoryTokens.isEmpty ? nil : .specific(s.categoryTokens)
        store.shield.webDomains = s.webDomainTokens.isEmpty ? nil : s.webDomainTokens
    }

    static func clearShield() {
        store.shield.applications = nil
        store.shield.applicationCategories = nil
        store.shield.webDomains = nil
    }

    /// iOS rejects Device Activity schedules shorter than 15 minutes, so a short unlock
    /// gets a schedule that started in the past. Only the end time matters to Stim.
    static func schedule(endingAt end: Date) -> DeviceActivitySchedule {
        let start = min(Date(), end.addingTimeInterval(-16 * 60))
        let parts: Set<Calendar.Component> = [.year, .month, .day, .hour, .minute, .second]
        let cal = Calendar.current
        return DeviceActivitySchedule(
            intervalStart: cal.dateComponents(parts, from: start),
            intervalEnd: cal.dateComponents(parts, from: end),
            repeats: false
        )
    }
}

extension DeviceActivityName {
    static let stimUnlock = DeviceActivityName("stim.unlock")
}
