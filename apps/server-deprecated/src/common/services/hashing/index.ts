export interface IHashingService {
	hash(value: string): Promise<string>;
	verify(value: string, hash: string): Promise<boolean>;
	isHashed(value: string): boolean;
}
