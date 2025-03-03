/// Initialize diagnostic panic hook which would provide additional context and
/// error location when application have debugging assertions in build or setup
/// human-friendly report with guide how to report issue when application was
/// built in release mode and panicked. */
pub fn setup_diagnostics()
{
    miette::set_panic_hook();
    #[cfg(not(debug_assertions))]
    {
        human_panic::setup_panic!();
    }
}
