export abstract class Usecase<IRequest, IReply> {
	abstract execute(input: IRequest): Promise<IReply>;
}
