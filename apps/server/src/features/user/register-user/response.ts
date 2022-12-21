export interface RegisterUserReponseDTO {
	/** Automatically generated username to identify user. */
	username: string;
	/** RecoveryKey is necessary key to interact with user account. */
	recoveryKey: string;
}
