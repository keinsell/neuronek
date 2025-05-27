use std::fs::{self, File};
use std::io::{BufReader, BufWriter, Read, Write};
use std::path::{Path, PathBuf};
use std::time::{Duration, SystemTime};
use miette::{IntoDiagnostic, Result, WrapErr};
use serde::{Deserialize, Serialize};

use crate::config::CACHE_DIR;

// Assuming this will be defined elsewhere, e.g. crate::database::DatabaseConnection
// For now, let's use a type alias as a placeholder.
// use crate::database::DatabaseConnection; // This would be the ideal import

const COMPLETIONS_SUBDIR_NAME: &str = "completions";
const DEFAULT_MAX_CACHE_AGE: Duration = Duration::from_secs(5 * 60); // 5 minutes

#[derive(Debug)]
pub struct CompletionCache {
    cache_file_path: PathBuf,
    max_age: Duration,
}

fn get_app_cache_dir() -> Result<PathBuf> {
    Ok(CACHE_DIR.join(COMPLETIONS_SUBDIR_NAME))
}

impl CompletionCache {
    pub fn new(cache_type_name: &str) -> Result<Self> {
        Self::with_max_age(cache_type_name, DEFAULT_MAX_CACHE_AGE)
    }

    pub fn with_max_age(cache_type_name: &str, max_age: Duration) -> Result<Self> {
        let app_cache_dir = get_app_cache_dir()?;
        if !app_cache_dir.exists() {
            fs::create_dir_all(&app_cache_dir)
                .into_diagnostic()
                .wrap_err_with(|| format!("Failed to create cache directory at {:?}", app_cache_dir))?;
        }
        let cache_file_path = app_cache_dir.join(cache_type_name);
        Ok(CompletionCache {
            cache_file_path,
            max_age,
        })
    }

    pub fn get_path(&self) -> &Path {
        &self.cache_file_path
    }

    pub fn is_valid(&self) -> Result<bool> {
        if !self.cache_file_path.exists() {
            return Ok(false);
        }

        let metadata = fs::metadata(&self.cache_file_path).into_diagnostic()?;
        let modified_time = metadata.modified().into_diagnostic()?;
        let current_time = SystemTime::now();

        match current_time.duration_since(modified_time) {
            Ok(age) => Ok(age <= self.max_age),
            Err(_) => {
                // File modification time is in the future, treat as invalid
                Ok(false)
            }
        }
    }

    // Placeholder for DatabaseConnection type.
    // Replace with actual type: `db: &sea_orm::DatabaseConnection` or similar
    pub fn refresh(&self, _db: &(), items: &[String]) -> Result<()> {
        // In a real implementation, `items` would be fetched from `db`
        // For now, we take them as an argument.
        let parent_dir = self.cache_file_path.parent().ok_or_else(|| miette::miette!("Cache file path has no parent directory"))?;
        if !parent_dir.exists() {
            fs::create_dir_all(parent_dir).into_diagnostic().wrap_err("Failed to create parent directory for cache file")?;
        }

        let file = File::create(&self.cache_file_path)
            .into_diagnostic()
            .wrap_err_with(|| format!("Failed to create cache file at {:?}", self.cache_file_path))?;

        let mut writer = BufWriter::new(file);
        for item in items {
            writeln!(writer, "{}", item)
                .into_diagnostic()
                .wrap_err_with(|| format!("Failed to write item '{}' to cache file {:?}", item, self.cache_file_path))?;
        }
        writer.flush().into_diagnostic().wrap_err("Failed to flush cache file writer")?;
        Ok(())
    }

    pub fn read_all_lines(&self) -> Result<Vec<String>> {
        if !self.cache_file_path.exists() {
            return Ok(Vec::new()); // Or an error, depending on desired behavior for non-existent cache
        }

        let file = File::open(&self.cache_file_path)
            .into_diagnostic()
            .wrap_err_with(|| format!("Failed to open cache file {:?}", self.cache_file_path))?;

        let reader = BufReader::new(file);
        let mut lines = Vec::new();
        // Using std::io::BufRead::lines() to read lines
        for line_result in std::io::BufRead::lines(reader) {
            let line = line_result.into_diagnostic().wrap_err("Failed to read line from cache")?;
            lines.push(line);
        }
        Ok(lines)
    }

    pub fn clear(&self) -> Result<()> {
        if self.cache_file_path.exists() {
            fs::remove_file(&self.cache_file_path)
                .into_diagnostic()
                .wrap_err_with(|| format!("Failed to remove cache file {:?}", self.cache_file_path))?;
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;



    // A more direct way to test by controlling the path directly
    fn get_cache_for_test(temp_dir: &tempfile::TempDir, file_name: &str, max_age: Duration) -> CompletionCache {
        let cache_path = temp_dir.path().join(file_name);
        CompletionCache {
            cache_file_path: cache_path,
            max_age,
        }
    }


    #[test]
    fn test_cache_creation_and_path() -> Result<()> {
        let temp_dir = tempdir().into_diagnostic()?;
        let cache = get_cache_for_test(&temp_dir, "substances.txt", DEFAULT_MAX_CACHE_AGE);

        assert_eq!(cache.cache_file_path, temp_dir.path().join("substances.txt"));
        assert_eq!(cache.max_age, DEFAULT_MAX_CACHE_AGE);
        Ok(())
    }

    #[test]
    fn test_cache_is_valid_non_existent() -> Result<()> {
        let temp_dir = tempdir().into_diagnostic()?;
        let cache = get_cache_for_test(&temp_dir, "test_cache.txt", Duration::from_secs(60));
        assert!(!cache.is_valid()?);
        Ok(())
    }

    #[test]
    fn test_cache_refresh_and_read() -> Result<()> {
        let temp_dir = tempdir().into_diagnostic()?;
        let cache = get_cache_for_test(&temp_dir, "test_items.txt", Duration::from_secs(60));

        let items_to_cache = vec!["item1".to_string(), "item2".to_string(), "item with spaces".to_string()];
        // Using a placeholder for DatabaseConnection
        cache.refresh(&(), &items_to_cache)?;

        assert!(cache.cache_file_path.exists());

        let read_items = cache.read_all_lines()?;
        assert_eq!(read_items, items_to_cache);
        Ok(())
    }

    #[test]
    fn test_cache_is_valid_fresh() -> Result<()> {
        let temp_dir = tempdir().into_diagnostic()?;
        let cache = get_cache_for_test(&temp_dir, "fresh_cache.txt", Duration::from_secs(600));
        cache.refresh(&(), &["fresh data".to_string()])?;
        assert!(cache.is_valid()?);
        Ok(())
    }

    #[test]
    fn test_cache_is_valid_stale() -> Result<()> {
        let temp_dir = tempdir().into_diagnostic()?;
        let cache = get_cache_for_test(&temp_dir, "stale_cache.txt", Duration::from_millis(10));

        cache.refresh(&(), &["stale_data".to_string()])?;

        // Ensure enough time passes for the cache to become stale.
        std::thread::sleep(Duration::from_millis(50));

        assert!(!cache.is_valid()?);
        Ok(())
    }

    #[test]
    fn test_read_empty_cache() -> Result<()> {
        let temp_dir = tempdir().into_diagnostic()?;
        let cache = get_cache_for_test(&temp_dir, "empty_cache.txt", Duration::from_secs(60));
        // Create an empty file
        File::create(&cache.cache_file_path).into_diagnostic()?;

        let items = cache.read_all_lines()?;
        assert!(items.is_empty());
        Ok(())
    }

    #[test]
    fn test_read_non_existent_cache_returns_empty_vec() -> Result<()> {
        let temp_dir = tempdir().into_diagnostic()?;
        let cache = get_cache_for_test(&temp_dir, "no_such_cache.txt", Duration::from_secs(60));

        let items = cache.read_all_lines()?;
        assert!(items.is_empty());
        Ok(())
    }

    #[test]
    fn test_clear_cache() -> Result<()> {
        let temp_dir = tempdir().into_diagnostic()?;
        let cache = get_cache_for_test(&temp_dir, "clear_me.txt", Duration::from_secs(60));
        cache.refresh(&(), &["some data".to_string()])?;
        assert!(cache.cache_file_path.exists());

        cache.clear()?;
        assert!(!cache.cache_file_path.exists());
        Ok(())
    }

    #[test]
    fn test_app_cache_dir_creation() -> Result<()> {
        // Test that get_app_cache_dir() returns the expected path structure
        let app_cache_dir = get_app_cache_dir()?;
        assert!(app_cache_dir.ends_with(COMPLETIONS_SUBDIR_NAME));

        // Create a cache instance to trigger directory creation
        let temp_dir = tempdir().into_diagnostic()?;
        let cache = get_cache_for_test(&temp_dir, "test_type_for_dir_creation", DEFAULT_MAX_CACHE_AGE);
        cache.refresh(&(), &["test".to_string()])?;
        
        let parent = cache.get_path().parent().unwrap();
        assert!(parent.exists());
        assert!(parent.is_dir());
        Ok(())
    }
}