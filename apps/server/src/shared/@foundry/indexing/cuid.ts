import generateCuid from 'cuid'

type CUIDBrand = {
	readonly CUID: unique symbol
}

export type CUID = string & CUIDBrand

/**
 *
 */
export function cuid(): CUID {
	return generateCuid() as CUID
}
