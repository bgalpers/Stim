// Runs in its own process, started by iOS. When an unlock's schedule ends,
// it puts the shield back on the chosen apps, even if Stim isn't open.
import DeviceActivity
import Foundation

class StimMonitor: DeviceActivityMonitor {
    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)
        guard activity == .stimUnlock else { return }
        // If the unlock was extended after this schedule was set, leave it alone.
        if StimShared.unlockedUntil <= Date().addingTimeInterval(60) {
            StimShared.applyShield()
        }
    }
}
