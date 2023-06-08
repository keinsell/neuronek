import { Memphis, memphis } from 'memphis-dev'
import { Connection } from '~foundry/base/conncetion'

export class MemphisConnection extends Connection<Memphis> {
  public async connect(): Promise<void> {
    this.connection.connect({
      host: 'localhost',
      username: 'root',
      password: 'memphis'
    })
  }

  public async disconnect(): Promise<void> {
    this.connection.close()
  }

  static async createConnection() {
    const connection = await memphis.connect({
      host: 'localhost',
      username: 'root',
      password: 'memphis'
    })

    new MemphisConnection(connection)
  }
}
