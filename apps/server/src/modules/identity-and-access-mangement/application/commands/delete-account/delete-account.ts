import { Command } from '~foundry/cqrs'



interface DeleteAccountProperties {
  accountId: string
}


export class DeleteAccount
  extends Command<DeleteAccountProperties>
  implements DeleteAccountProperties {
  public accountId: string
}
