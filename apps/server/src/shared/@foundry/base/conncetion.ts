export abstract class Connection<T> {
  abstract instance: T
  public abstract connect(): Promise<void>
  public abstract disconnect(): Promise<void>
}
