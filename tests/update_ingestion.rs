use assert_cmd::Command;

#[test]
fn test_update_ingestion()
{
	let mut cmd = Command::cargo_bin("neuronek").unwrap();
	cmd.arg("ingestion")
		.arg("log")
		.args(["-s", "caffeine"])
		.args(["-d", "100mg"]);

	cmd.assert().success();

	// let mut cmd2 = Command::cargo_bin("neuronek").unwrap();
	// cmd2.arg("ingestion")
	//     .arg("update")
	//     .arg("1")
	//     .args(["-d", "200mg"]);

	// cmd2.assert().success();
}
