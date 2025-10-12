use std::collections::HashSet;
use std::fmt::{Debug, Display};

use async_trait::async_trait;
use atty::Stream;
use clap::{Args, ColorChoice, CommandFactory, Parser, Subcommand, ValueEnum, arg, command};
use miette::{IntoDiagnostic, WrapErr, miette};
use minimo::Printable;
use sea_orm::prelude::*;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter, QueryOrder};
use serde::Serialize;
use tabled::settings::Style;
use tabled::{Table, Tabled};
use textplots::Plot;
use tracing::log::Log;

use crate::config::VERSION;
pub mod completions;
pub mod ingestion;
pub mod substance;

use completions::cache::CompletionCache;

use crate::ApplicationContext;

pub fn is_interactive() -> bool { atty::is(Stream::Stdout) }

// TODO: Markdown?
// TODO: TUI?
// TODO: CSV?
#[derive(clap::ValueEnum, Clone, Debug)]
/// The output format specifies how application data is presented:
///
/// - `Pretty`: Used in interactive shells to display data in a visually
///   appealing table format.
/// - `Json`: Used in non-interactive shells (e.g., scripts or when data is
///   piped) to provide raw JSON for automated parsing.
pub enum MessageFormat
{
	/// Pretty printed tables
	Pretty,
	/// JSON formatted output
	Json,
	// TODO: Application may support custom templates like liquidless or smth
}

impl Default for MessageFormat
{
	fn default() -> Self
	{
		if is_interactive() {
			MessageFormat::Pretty
		} else {
			MessageFormat::Json
		}
	}
}

#[derive(Clone, Debug, ValueEnum)]
pub enum CompletionShell
{
	Bash,
	Elvish,
	Fish,
	#[value(name = "powershell")]
	PowerShell,
	Zsh,
	Nushell,
}

impl std::fmt::Display for CompletionShell
{
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result
	{
		let name = match self {
			| CompletionShell::Bash => "bash",
			| CompletionShell::Elvish => "elvish",
			| CompletionShell::Fish => "fish",
			| CompletionShell::PowerShell => "powershell",
			| CompletionShell::Zsh => "zsh",
			| CompletionShell::Nushell => "nushell",
		};
		write!(f, "{}", name)
	}
}

/// TODO: Display in alternative screen vs direct
pub trait Displayable: Serialize + Sized + Debug
{
	fn as_json(&self) -> String { serde_json::to_string(self).unwrap() }
	fn as_table(&self) -> String
	where Self: Tabled
	{
		let mut table = Table::new(vec![self]);
		table.with(Style::modern_rounded());
		table.to_string()
	}
	fn as_debug(&self) -> String { format!("{:?}", self) }

	fn as_pretty(&self) -> String { self.as_debug() }

	fn display(&self, format: MessageFormat)
	{
		let formatted_output = match format {
			| MessageFormat::Pretty => self.as_pretty(),
			| MessageFormat::Json => self.as_json(),
		};

		println!("{}", formatted_output.trim());
	}
}

#[derive(ValueEnum, Clone, Debug)]
pub enum CompletionType
{
	Substances,
	Routes,
}

#[derive(Subcommand, Clone, Debug)]
pub enum CacheManagementCommand
{
	/// Refresh completion cache
	RefreshCache,
	/// Get cached values for completion
	GetCached
	{
		#[arg(value_enum)]
		completion_type: CompletionType,
	},
}

#[derive(Subcommand, Clone, Debug)]
pub enum CompletionSubcommands
{
	/// Generate shell completion script for a given shell
	#[command(
		about = "Generate shell completion script for a specific shell",
		long_about = "Generate shell completion scripts for neuronek.\\n\\nExamples:\\n  # \
		              Bash\\n  neuronek completion generate --shell bash > \
		              ~/.local/share/bash-completion/completions/neuronek\\n  \\n  # Zsh\\n  \
		              neuronek completion generate --shell zsh > ~/.zfunc/_neuronek\\n  \\n  # \
		              Fish\\n  neuronek completion generate --shell fish > \
		              ~/.config/fish/completions/neuronek.fish\\n  \\n  # PowerShell\\n  neuronek \
		              completion generate --shell powershell | Out-String | Invoke-Expression\\n  \
		              \\n  # Nushell\\n  neuronek completion generate --shell nushell | save \
		              ~/.config/nushell/completions/neuronek.nu"
	)]
	Generate
	{
		#[arg(value_enum)]
		shell: CompletionShell,
	},
	/// Manage completion cache (used by shell completion scripts)
	Cache
	{
		#[command(subcommand)]
		cache_command: CacheManagementCommand,
	},
}

#[derive(clap::Args, Clone, Debug)]
pub struct CompletionArgs
{
	#[command(subcommand)]
	command: CompletionSubcommands,
}

#[derive(clap::Subcommand)]
pub enum ApplicationCommands
{
	/// Manage ingestion entries
	Ingestion(ingestion::IngestionCommand),
	#[command(hide = true)]
	Substance(substance::GetSubstance),
	/// Manage shell completions (generation and cache)
	#[command(about = "Manage shell completion scripts and cache")]
	Completion(CompletionArgs),
	/// Display an interactive dashboard
	Dashboard(DashboardCommand),
}

#[derive(clap::Args, Clone, Debug)]
pub struct DashboardCommand {}

#[derive(Parser)]
#[command(
    version = env!("CARGO_PKG_VERSION"),
    long_about = "🧬 Intelligent dosage tracker application with purpose to monitor supplements, nootropics and psychoactive substances along with their long-term influence on one's mind and body.",
    about = "🧬 Intelligent dosage tracker",
    color = ColorChoice::Auto,
    version=VERSION,
    infer_subcommands = true,
    infer_long_args = true
)]
pub struct CommandLineInterface
{
	#[command(subcommand)]
	pub command: ApplicationCommands,

	/// Pretty-print or return raw version of data in JSON
	#[arg(short, long = "format", value_enum, default_value_t = MessageFormat::default())]
	pub format: MessageFormat,

	#[command(flatten)]
	verbose: clap_verbosity_flag::Verbosity,
}

#[async_trait]
pub trait Executable<Output: Send>
{
	async fn execute(self, ctx: &ApplicationContext) -> miette::Result<Output>;
}

// --- Output Structs for Completion Commands ---

#[derive(Debug, Serialize)]
pub struct CompletionScriptOutput
{
	shell_name: String,
	message: String, // e.g., "Completion script generated and printed to stdout"
}

impl Displayable for CompletionScriptOutput
{
	fn as_pretty(&self) -> String
	{
		format!(
			"Successfully generated {} completion script. Please follow your shell's instructions \
			 to install it.",
			self.shell_name
		)
	}
}

#[derive(Debug, Serialize)]
pub struct CacheRefreshOutput
{
	message: String,
	refreshed_caches: Vec<String>,
}

impl Displayable for CacheRefreshOutput
{
	fn as_pretty(&self) -> String
	{
		if self.refreshed_caches.is_empty() {
			"No caches were refreshed.".to_string()
		} else {
			format!(
				"Successfully refreshed cache(s): {}",
				self.refreshed_caches.join(", ")
			)
		}
	}
}

#[derive(Debug, Serialize)]
pub struct CachedValuesOutput
{
	cache_type: String,
	values: Vec<String>,
}

impl Displayable for CachedValuesOutput
{
	fn as_pretty(&self) -> String
	{
		// Output each value on a new line, suitable for shell completion scripts
		self.values.join("\n")
	}
	fn as_json(&self) -> String { serde_json::to_string(&self.values).unwrap_or_default() }
}

// Generic output for simple messages
#[derive(Debug, Serialize)]
pub struct SimpleMessageOutput
{
	message: String,
}

impl Displayable for SimpleMessageOutput
{
	fn as_pretty(&self) -> String { self.message.clone() }
}


#[async_trait]
impl Executable<()> for CompletionArgs
{
	async fn execute(self, ctx: &ApplicationContext) -> miette::Result<()>
	{
		match self.command {
			| CompletionSubcommands::Generate { shell } => {
				let mut cmd = crate::cli::CommandLineInterface::command();
				let bin_name = env!("CARGO_PKG_NAME");
				match shell {
					| CompletionShell::Bash => {
						crate::cli::completions::generate_completion(
							clap_complete::Shell::Bash,
							&mut cmd,
							&mut std::io::stdout(),
						);
					}
					| CompletionShell::Elvish => {
						clap_complete::generate(
							clap_complete::shells::Elvish,
							&mut cmd,
							bin_name,
							&mut std::io::stdout(),
						);
					}
					| CompletionShell::Fish => {
						crate::cli::completions::generate_completion(
							clap_complete::Shell::Fish,
							&mut cmd,
							&mut std::io::stdout(),
						);
					}
					| CompletionShell::PowerShell => {
						clap_complete::generate(
							clap_complete::shells::PowerShell,
							&mut cmd,
							bin_name,
							&mut std::io::stdout(),
						);
					}
					| CompletionShell::Zsh => {
						crate::cli::completions::generate_completion(
							clap_complete::Shell::Zsh,
							&mut cmd,
							&mut std::io::stdout(),
						);
					}
					| CompletionShell::Nushell => {
						clap_complete::generate(
							clap_complete_nushell::Nushell,
							&mut cmd,
							bin_name,
							&mut std::io::stdout(),
						);
					}
				};
				// The script is printed directly to stdout by clap_complete::generate
				// So we return a SimpleMessageOutput that will not be printed by the main
				// handler, or we can make the handler smarter. For now, an empty message.
				Ok(())
			}
			| CompletionSubcommands::Cache { cache_command } => {
				match cache_command {
					| CacheManagementCommand::RefreshCache => {
						// Get actual substance names from database
						let substance_cache = CompletionCache::new("substances")?;
						let mut substances = crate::cli::substance::get_substance_names().await;
						// Convert to lowercase and deduplicate
						substances = substances
							.into_iter()
							.map(|s| s.to_lowercase())
							.collect::<std::collections::HashSet<_>>()
							.into_iter()
							.collect::<Vec<_>>();
						substances.sort();
						substance_cache
							.refresh(&(), &substances)
							.wrap_err("Failed to refresh substances cache")?;

						// Get all possible routes from enum
						let route_cache = CompletionCache::new("routes")?;
						let routes = vec![
							"buccal".to_string(),
							"inhaled".to_string(),
							"insufflated".to_string(),
							"intramuscular".to_string(),
							"intravenous".to_string(),
							"oral".to_string(),
							"rectal".to_string(),
							"smoked".to_string(),
							"sublingual".to_string(),
							"transdermal".to_string(),
						];
						route_cache
							.refresh(&(), &routes)
							.wrap_err("Failed to refresh routes cache")?;

						Ok(())
					}
					| CacheManagementCommand::GetCached { completion_type } => {
						let type_name = match completion_type {
							| CompletionType::Substances => "substances",
							| CompletionType::Routes => "routes",
						};
						let cache = CompletionCache::new(type_name)?;
						if !cache.is_valid()? {
							// Attempt to refresh if stale or non-existent
							let items_to_cache = match completion_type {
								| CompletionType::Substances => {
									let mut substances =
										crate::cli::substance::get_substance_names().await;
									// Convert to lowercase and deduplicate
									substances = substances
										.into_iter()
										.map(|s| s.to_lowercase())
										.collect::<std::collections::HashSet<_>>()
										.into_iter()
										.collect::<Vec<_>>();
									substances.sort();
									substances
								}
								| CompletionType::Routes => vec![
									"buccal".to_string(),
									"inhaled".to_string(),
									"insufflated".to_string(),
									"intramuscular".to_string(),
									"intravenous".to_string(),
									"oral".to_string(),
									"rectal".to_string(),
									"smoked".to_string(),
									"sublingual".to_string(),
									"transdermal".to_string(),
								],
							};
							cache.refresh(&(), &items_to_cache).wrap_err_with(|| {
								format!("Failed to auto-refresh {} cache", type_name)
							})?;
							if !cache.is_valid()? {
								return Err(miette!(
									"Cache is still invalid after attempting refresh for {}",
									type_name
								));
							}
						}
						let values = cache
							.read_all_lines()
							.wrap_err_with(|| format!("Failed to read {} cache", type_name))?;
						// For get-cached command, we always print directly without JSON formatting
						// This is used by shell completion scripts which expect plain text
						for value in values {
							println!("{}", value);
						}
						std::process::exit(0);
					}
				}
			}
		}
	}
}
