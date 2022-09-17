import { App } from "@tinyhttp/app";
import { urlencoded } from "milliparsec";
import { lruSend } from "lru-send";
import cors from "cors";
import { userRouter } from "../modules/user/routers/user.router";

export class HttpApplication {
  private application: App;

  constructor() {
    this.application = new App();
    this.applyDevelopmentMiddleware();
    this.applyProductionMiddleware();
    this.applyMiddleware();
    this.attachComponents();
  }

  protected applyMiddleware() {
    this.application.use(urlencoded());
    this.application.use(lruSend());
    this.application.options("*", cors());
  }

  protected applyDevelopmentMiddleware() {}
  protected applyProductionMiddleware() {}

  protected attachComponents() {
    this.application.use(userRouter);
  }

  public async bootstrap() {
    this.application.listen(3000);

    console.log(3000);
  }
}
