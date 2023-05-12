/**
 * The Mapper abstract class provides a foundation for mapping data between different representations or formats.
 * It encapsulates the conversion logic and provides reusable methods for mapping operations.
 */
export abstract class Mapper<TInput, TOutput> {
	/**
	 * Maps the input data to the desired output format.
	 * @param input The input data to be mapped.
	 * @returns The mapped output data.
	 */
	public abstract map(input: TInput): TOutput

	/**
	 * Maps an array of input data to an array of corresponding output data.
	 * @param inputs The array of input data to be mapped.
	 * @returns The array of mapped output data.
	 */
	public mapMultiple(inputs: TInput[]): TOutput[] {
		return inputs.map(input => this.map(input))
	}
}
