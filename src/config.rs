use std::env;
use std::env::temp_dir;
use std::path::PathBuf;

use directories::ProjectDirs;
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};

use crate::cli::CommandLineInterface;

pub const NAME: &str = env!("CARGO_PKG_NAME");
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

lazy_static! {
	pub static ref DATA_DIR: PathBuf = {
		ProjectDirs::from("com", "keinsell", NAME)
			.expect("project data directory not found")
			.data_dir()
			.to_path_buf()
	};
	pub static ref CACHE_DIR: PathBuf = {
		ProjectDirs::from("com", "keinsell", NAME)
			.expect("project cache directory not found")
			.cache_dir()
			.to_path_buf()
	};
	pub static ref CONFIG_DIR: PathBuf = {
		ProjectDirs::from("com", "keinsell", NAME)
			.expect("project config directory not found")
			.config_dir()
			.to_path_buf()
	};
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Config
{
	pub sqlite_path: PathBuf,
	pub version: Option<u32>,
}

impl Default for Config
{
	fn default() -> Self
	{
		let journal_path = if cfg!(test) || env::var("NEURONEK_TEST").is_ok() {
			// Using a special value that will be recognized
			// by the database module as an in-memory database
			PathBuf::from(":memory:")
		} else if cfg!(debug_assertions) {
			temp_dir().join("neuronek.sqlite")
		} else {
			DATA_DIR.join("journal.db").clone()
		};

		Config {
			sqlite_path: journal_path,
			version: Some(1),
		}
	}
}

lazy_static! {
	pub static ref CONFIG: Config = Config::default();
}
