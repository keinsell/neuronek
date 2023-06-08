export abstract class Connection<T> {
  constructor(private readonly _instance: T) {
  }

  public abstract connect(): Promise<void>
  public abstract disconnect(): Promise<void>
  get instance(): T {
    return this._instance
  }
}
