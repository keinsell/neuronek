import ms from 'ms'

export class Duration {
	public readonly unix_duration: number

	public constructor(unix_duration: number) {
		this.unix_duration = unix_duration
	}

	toString(): string {
		return ms(this.unix_duration)
	}

	static fromString(durationString: string): Duration {
		return new Duration(ms(durationString))
	}
}
