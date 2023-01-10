declare module "unitmath";

export default function unitmath(str: string): Unit;

export interface Unit {
  simplify(): Unit;
  toString(): string;
}
