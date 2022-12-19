import { Namespace, Server } from "socket.io";

export class WebsocketServer {
	public socket: Server;

	constructor() {
		this.socket = new Server().listen(1338);
	}

	public listen(): void {
		this.socket.on("connect", () => {
			console.log("Somebody has connected to websocket server...");
		});

		this.socket.on("disconnect", () => {
			console.log("Somebody has disconnected from websocket server...");
		});
	}
}

export const WEBSOCKET_SERVER = new WebsocketServer();

export abstract class WebsocketNamespace extends Namespace {
	constructor(
		public namespace: string,
		server: Server = WEBSOCKET_SERVER.socket
	) {
		super(server, namespace);

		this.on("connect", () => {
			console.log(`Somebody has connected to ${namespace} namespace...`);
		});
	}

	public abstract listen(): void;
}
