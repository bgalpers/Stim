import Capacitor

/// Main.storyboard uses this instead of CAPBridgeViewController so the
/// app's own ScreenTime plugin is registered with Capacitor.
class StimViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(ScreenTimePlugin())
    }
}
