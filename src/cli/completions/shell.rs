use clap::{Command, CommandFactory};
use clap_complete::{generate, Shell};
use std::io::Write;

/// Generate enhanced shell completions with dynamic substance name support
/// 
/// This function generates shell completion scripts that include both:
/// 1. Basic static completions from clap_complete
/// 2. Custom dynamic completion functions for runtime data
/// 
/// The custom functions provide completion for:
/// - Substance names (from database/cache)
/// - Routes of administration
/// - Ingestion IDs with descriptions
/// 
/// # Arguments
/// 
/// * `shell` - The shell to generate completions for (Bash, Fish, etc.)
/// * `cmd` - The command structure to generate completions for
/// * `buf` - The buffer to write completions to
pub fn generate_completion<W: Write>(shell: Shell, cmd: &mut Command, buf: &mut W) {
    // First generate the base completion script from clap
    generate(shell, cmd, cmd.get_name().to_string(), buf);
    
    // Then append our custom completion functions based on the shell
    match shell {
        Shell::Bash => crate::cli::completions::bash::write_custom_completions(buf),
        Shell::Fish => crate::cli::completions::fish::write_custom_completions(buf),
        // For other shells, we don't add custom completions yet
        _ => Ok(()),
    }.unwrap_or_else(|e| eprintln!("Warning: Failed to write custom completions: {}", e));
}