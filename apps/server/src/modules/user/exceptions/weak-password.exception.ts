import { Exception } from "@internal/common";

export class UserProvidedWeakPasswordException extends Exception {
  constructor() {
    super("The password provided is too weak.");
  }
}
