use assert_cmd::Command;

#[test]
fn test_log_ingestion()
{
	let mut cmd = Command::cargo_bin("neuronek").unwrap();
	cmd.env("NEURONEK_TEST", "1");
	cmd.arg("ingestion")
		.arg("log")
		.args(["-s", "caffeine"])
		.args(["-d", "100mg"]);

	cmd.assert().success();
}
