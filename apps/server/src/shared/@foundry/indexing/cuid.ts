type CUIDBrand = {
	readonly CUID: unique symbol
}

export type CUID = string & CUIDBrand
