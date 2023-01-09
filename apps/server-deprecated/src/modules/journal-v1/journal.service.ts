import { User } from "../user/entities/user.entity";

export class JournalService {
	async prepareOneWeekJorunal(user: User) {
		console.log(user);
	}
}

export const journalService = new JournalService();
