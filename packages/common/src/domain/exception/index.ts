export abstract class Exception {
  public readonly message: string;
  public readonly name: string;
  public readonly stack?: string;

  constructor(message: string) {
    this.message = message;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
