export namespace Prettylogs {
	export function shortenCuid(cuid: string) {
		const length = cuid.length;
		return cuid.substring(length - 8, length);
	}
}
