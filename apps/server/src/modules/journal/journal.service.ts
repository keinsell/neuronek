import { User } from "../user/entities/user.entity";

export class JournalService {
  async prepareOneWeekJorunal(user: User) {}
}

export const journalService = new JournalService();
