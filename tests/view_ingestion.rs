use assert_cmd::Command;
use predicates::prelude::*;

// #[test]
// fn test_show_ingestion() -> Result<(), Box<dyn std::error::Error>>
// {
//     let mut ingestion_log_command = Command::cargo_bin("neuronek")?;
//     ingestion_log_command
//         .env("RUST_TEST", "1")
//         .arg("ingestion")
//         .arg("log")
//         .args(["-s", "caffeine", "-d", "100mg"]);

//     let mut cmd = Command::cargo_bin("neuronek")?;
//     cmd.env("RUST_TEST", "1")
//         .arg("ingestion")
//         .arg("view")
//         .arg("1");

//     cmd.assert()
//         .success()
//         .stdout(predicate::str::contains("caffeine"));

//     Ok(())
// }

#[test]
fn test_show_nonexistent_ingestion() -> Result<(), Box<dyn std::error::Error>>
{
	let mut cmd = Command::cargo_bin("neuronek")?;
	cmd.env("RUST_TEST", "1")
		.arg("ingestion")
		.arg("view")
		.arg("999999");
	cmd.assert()
		.failure()
		.stderr(predicate::str::contains("not found"));

	Ok(())
}
