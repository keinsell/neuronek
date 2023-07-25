import { Username } from "~domain/iam/domain/value-objects/username/username";

interface ChangeUsernameProperties {
  username: Username
}

export class ChangeUsername {
  username: Username

  constructor(properties: ChangeUsernameProperties) {
    this.username = properties.username
  }
}
