import { Command } from "../command";

/**
 * @see [Better Software Design with Application Layer Use Cases](https://khalilstemmler.com/articles/enterprise-typescript-nodejs/application-layer-use-cases/)
 */
export abstract class Usecase<ICommand extends Command, IResponse> {
	abstract execute(command: ICommand): Promise<IResponse>;
}
