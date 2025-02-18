use crate::cli::CommandLineInterface;
use directories::ProjectDirs;
use lazy_static::lazy_static;
use serde::Deserialize;
use serde::Serialize;
use std::env;
use std::env::temp_dir;
use std::path::PathBuf;

pub const NAME: &str = env!("CARGO_PKG_NAME");
// pub const VERSION: &str = env!("CARGO_PKG_VERSION");

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
        let mut journal_path = DATA_DIR.join("journal.db").clone();

        if cfg!(test) || cfg!(debug_assertions)
        {
            journal_path = temp_dir().join("neuronek.sqlite");
        }

        Config {
            sqlite_path: journal_path,
            version: Some(1),
        }
    }
}

lazy_static! {
    pub static ref CONFIG: Config = Config::default();
}
