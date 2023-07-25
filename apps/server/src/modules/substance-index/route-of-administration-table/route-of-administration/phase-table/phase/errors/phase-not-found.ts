import { NotFound } from "~foundry/exceptions/not-found";


export class PhaseNotFound extends NotFound {
  constructor(phase: string) {
    super(`Phase ${phase} not found`)
  }
}
