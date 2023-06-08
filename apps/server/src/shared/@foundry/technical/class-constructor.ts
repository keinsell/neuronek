import { Message } from '../messaging/message.js'



export type ClassConstructor<T> = new (...args : any[]) => T;
export type MessageConstructor<T extends Message<unknown>> = ClassConstructor<T> & { type : string };
