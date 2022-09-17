import { Controller } from "../../../../common/controller/controller.common";

export class RegisterUserController extends Controller {
  protected async executeImplementation(): Promise<any> {
    this.ok(this.res, "Hello world");
  }
}
