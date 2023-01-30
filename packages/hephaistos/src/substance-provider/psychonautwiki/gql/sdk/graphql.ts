/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string
	String: string
	Boolean: boolean
	Int: number
	Float: number
}

export type Effect = {
	__typename?: 'Effect'
	experiences?: Maybe<Array<Maybe<Experience>>>
	name?: Maybe<Scalars['String']>
	substances?: Maybe<Array<Maybe<Substance>>>
	url?: Maybe<Scalars['String']>
}

export type Experience = {
	__typename?: 'Experience'
	effects?: Maybe<Array<Maybe<Experience>>>
	substances?: Maybe<Array<Maybe<Substance>>>
}

export type Query = {
	__typename?: 'Query'
	effects_by_substance?: Maybe<Array<Maybe<Effect>>>
	experiences?: Maybe<Array<Maybe<Experience>>>
	substances?: Maybe<Array<Maybe<Substance>>>
	substances_by_effect?: Maybe<Array<Maybe<Substance>>>
}

export type QueryEffects_By_SubstanceArgs = {
	limit?: InputMaybe<Scalars['Int']>
	offset?: InputMaybe<Scalars['Int']>
	substance?: InputMaybe<Scalars['String']>
}

export type QueryExperiencesArgs = {
	effects_by_substance?: InputMaybe<Scalars['String']>
	substance?: InputMaybe<Scalars['String']>
	substances_by_effect?: InputMaybe<Scalars['String']>
}

export type QuerySubstancesArgs = {
	chemicalClass?: InputMaybe<Scalars['String']>
	effect?: InputMaybe<Scalars['String']>
	limit?: InputMaybe<Scalars['Int']>
	offset?: InputMaybe<Scalars['Int']>
	psychoactiveClass?: InputMaybe<Scalars['String']>
	query?: InputMaybe<Scalars['String']>
}

export type QuerySubstances_By_EffectArgs = {
	effect?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
	limit?: InputMaybe<Scalars['Int']>
	offset?: InputMaybe<Scalars['Int']>
}

export type RoaRange = {
	max?: Maybe<Scalars['Float']>
	min?: Maybe<Scalars['Float']>
}

export type Substance = {
	__typename?: 'Substance'
	addictionPotential?: Maybe<Scalars['String']>
	class?: Maybe<SubstanceClass>
	commonNames?: Maybe<Array<Maybe<Scalars['String']>>>
	crossTolerances?: Maybe<Array<Maybe<Scalars['String']>>>
	dangerousInteractions?: Maybe<Array<Maybe<Substance>>>
	effects?: Maybe<Array<Maybe<Effect>>>
	experiences?: Maybe<Array<Maybe<Experience>>>
	featured?: Maybe<Scalars['Boolean']>
	images?: Maybe<Array<Maybe<SubstanceImage>>>
	name?: Maybe<Scalars['String']>
	roa?: Maybe<SubstanceRoaTypes>
	roas?: Maybe<Array<Maybe<SubstanceRoa>>>
	summary?: Maybe<Scalars['String']>
	tolerance?: Maybe<SubstanceTolerance>
	toxicity?: Maybe<Array<Maybe<Scalars['String']>>>
	uncertainInteractions?: Maybe<Array<Maybe<Substance>>>
	unsafeInteractions?: Maybe<Array<Maybe<Substance>>>
	url?: Maybe<Scalars['String']>
}

export type SubstanceClass = {
	__typename?: 'SubstanceClass'
	chemical?: Maybe<Array<Maybe<Scalars['String']>>>
	psychoactive?: Maybe<Array<Maybe<Scalars['String']>>>
}

export type SubstanceImage = {
	__typename?: 'SubstanceImage'
	image?: Maybe<Scalars['String']>
	thumb?: Maybe<Scalars['String']>
}

export type SubstanceRoa = {
	__typename?: 'SubstanceRoa'
	bioavailability?: Maybe<SubstanceRoaRange>
	dose?: Maybe<SubstanceRoaDose>
	duration?: Maybe<SubstanceRoaDuration>
	name?: Maybe<Scalars['String']>
}

export type SubstanceRoaDose = {
	__typename?: 'SubstanceRoaDose'
	common?: Maybe<SubstanceRoaRange>
	heavy?: Maybe<Scalars['Float']>
	light?: Maybe<SubstanceRoaRange>
	strong?: Maybe<SubstanceRoaRange>
	threshold?: Maybe<Scalars['Float']>
	units?: Maybe<Scalars['String']>
}

export type SubstanceRoaDuration = {
	__typename?: 'SubstanceRoaDuration'
	afterglow?: Maybe<SubstanceRoaDurationRange>
	comeup?: Maybe<SubstanceRoaDurationRange>
	duration?: Maybe<SubstanceRoaDurationRange>
	offset?: Maybe<SubstanceRoaDurationRange>
	onset?: Maybe<SubstanceRoaDurationRange>
	peak?: Maybe<SubstanceRoaDurationRange>
	total?: Maybe<SubstanceRoaDurationRange>
}

export type SubstanceRoaDurationRange = RoaRange & {
	__typename?: 'SubstanceRoaDurationRange'
	max?: Maybe<Scalars['Float']>
	min?: Maybe<Scalars['Float']>
	units?: Maybe<Scalars['String']>
}

export type SubstanceRoaRange = RoaRange & {
	__typename?: 'SubstanceRoaRange'
	max?: Maybe<Scalars['Float']>
	min?: Maybe<Scalars['Float']>
}

export type SubstanceRoaTypes = {
	__typename?: 'SubstanceRoaTypes'
	buccal?: Maybe<SubstanceRoa>
	insufflated?: Maybe<SubstanceRoa>
	intramuscular?: Maybe<SubstanceRoa>
	intravenous?: Maybe<SubstanceRoa>
	oral?: Maybe<SubstanceRoa>
	rectal?: Maybe<SubstanceRoa>
	smoked?: Maybe<SubstanceRoa>
	subcutaneous?: Maybe<SubstanceRoa>
	sublingual?: Maybe<SubstanceRoa>
	transdermal?: Maybe<SubstanceRoa>
}

export type SubstanceTolerance = {
	__typename?: 'SubstanceTolerance'
	full?: Maybe<Scalars['String']>
	half?: Maybe<Scalars['String']>
	zero?: Maybe<Scalars['String']>
}

export type GetSubstancesQueryVariables = Exact<{
	name?: InputMaybe<Scalars['String']>
}>

export type GetSubstancesQuery = {
	__typename?: 'Query'
	substances?: Array<{
		__typename?: 'Substance'
		name?: string | null
		summary?: string | null
		url?: string | null
		featured?: boolean | null
		addictionPotential?: string | null
		toxicity?: Array<string | null> | null
		crossTolerances?: Array<string | null> | null
		commonNames?: Array<string | null> | null
		effects?: Array<{ __typename?: 'Effect'; name?: string | null; url?: string | null } | null> | null
		class?: {
			__typename?: 'SubstanceClass'
			chemical?: Array<string | null> | null
			psychoactive?: Array<string | null> | null
		} | null
		tolerance?: {
			__typename?: 'SubstanceTolerance'
			full?: string | null
			half?: string | null
			zero?: string | null
		} | null
		roas?: Array<{
			__typename?: 'SubstanceRoa'
			name?: string | null
			dose?: {
				__typename?: 'SubstanceRoaDose'
				units?: string | null
				threshold?: number | null
				heavy?: number | null
				common?: { __typename?: 'SubstanceRoaRange'; min?: number | null; max?: number | null } | null
				light?: { __typename?: 'SubstanceRoaRange'; min?: number | null; max?: number | null } | null
				strong?: { __typename?: 'SubstanceRoaRange'; min?: number | null; max?: number | null } | null
			} | null
			duration?: {
				__typename?: 'SubstanceRoaDuration'
				afterglow?: {
					__typename?: 'SubstanceRoaDurationRange'
					min?: number | null
					max?: number | null
					units?: string | null
				} | null
				comeup?: {
					__typename?: 'SubstanceRoaDurationRange'
					min?: number | null
					max?: number | null
					units?: string | null
				} | null
				duration?: {
					__typename?: 'SubstanceRoaDurationRange'
					min?: number | null
					max?: number | null
					units?: string | null
				} | null
				offset?: {
					__typename?: 'SubstanceRoaDurationRange'
					min?: number | null
					max?: number | null
					units?: string | null
				} | null
				onset?: {
					__typename?: 'SubstanceRoaDurationRange'
					min?: number | null
					max?: number | null
					units?: string | null
				} | null
				peak?: {
					__typename?: 'SubstanceRoaDurationRange'
					min?: number | null
					max?: number | null
					units?: string | null
				} | null
				total?: {
					__typename?: 'SubstanceRoaDurationRange'
					min?: number | null
					max?: number | null
					units?: string | null
				} | null
			} | null
			bioavailability?: { __typename?: 'SubstanceRoaRange'; min?: number | null; max?: number | null } | null
		} | null> | null
		images?: Array<{ __typename?: 'SubstanceImage'; thumb?: string | null; image?: string | null } | null> | null
		uncertainInteractions?: Array<{
			__typename?: 'Substance'
			class?: { __typename?: 'SubstanceClass'; psychoactive?: Array<string | null> | null } | null
		} | null> | null
		unsafeInteractions?: Array<{
			__typename?: 'Substance'
			class?: { __typename?: 'SubstanceClass'; psychoactive?: Array<string | null> | null } | null
		} | null> | null
		dangerousInteractions?: Array<{
			__typename?: 'Substance'
			class?: { __typename?: 'SubstanceClass'; psychoactive?: Array<string | null> | null } | null
		} | null> | null
	} | null> | null
}

export type AllSubstancesQueryVariables = Exact<{ [key: string]: never }>

export type AllSubstancesQuery = {
	__typename?: 'Query'
	substances?: Array<{
		__typename?: 'Substance'
		name?: string | null
		commonNames?: Array<string | null> | null
		url?: string | null
		addictionPotential?: string | null
		toxicity?: Array<string | null> | null
		crossTolerances?: Array<string | null> | null
		class?: {
			__typename?: 'SubstanceClass'
			chemical?: Array<string | null> | null
			psychoactive?: Array<string | null> | null
		} | null
		tolerance?: {
			__typename?: 'SubstanceTolerance'
			full?: string | null
			half?: string | null
			zero?: string | null
		} | null
		roas?: Array<{
			__typename?: 'SubstanceRoa'
			name?: string | null
			dose?: {
				__typename?: 'SubstanceRoaDose'
				units?: string | null
				threshold?: number | null
				heavy?: number | null
				light?: { __typename?: 'SubstanceRoaRange'; min?: number | null; max?: number | null } | null
				common?: { __typename?: 'SubstanceRoaRange'; min?: number | null; max?: number | null } | null
				strong?: { __typename?: 'SubstanceRoaRange'; min?: number | null; max?: number | null } | null
			} | null
			duration?: {
				__typename?: 'SubstanceRoaDuration'
				onset?: {
					__typename?: 'SubstanceRoaDurationRange'
					min?: number | null
					max?: number | null
					units?: string | null
				} | null
				comeup?: {
					__typename?: 'SubstanceRoaDurationRange'
					min?: number | null
					max?: number | null
					units?: string | null
				} | null
				peak?: {
					__typename?: 'SubstanceRoaDurationRange'
					min?: number | null
					max?: number | null
					units?: string | null
				} | null
				offset?: {
					__typename?: 'SubstanceRoaDurationRange'
					min?: number | null
					max?: number | null
					units?: string | null
				} | null
				total?: {
					__typename?: 'SubstanceRoaDurationRange'
					min?: number | null
					max?: number | null
					units?: string | null
				} | null
				afterglow?: {
					__typename?: 'SubstanceRoaDurationRange'
					min?: number | null
					max?: number | null
					units?: string | null
				} | null
			} | null
			bioavailability?: { __typename?: 'SubstanceRoaRange'; min?: number | null; max?: number | null } | null
		} | null> | null
		uncertainInteractions?: Array<{ __typename?: 'Substance'; name?: string | null } | null> | null
		unsafeInteractions?: Array<{ __typename?: 'Substance'; name?: string | null } | null> | null
		dangerousInteractions?: Array<{ __typename?: 'Substance'; name?: string | null } | null> | null
		effects?: Array<{ __typename?: 'Effect'; name?: string | null; url?: string | null } | null> | null
	} | null> | null
}

export const GetSubstancesDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'getSubstances' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } }
				}
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'substances' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'query' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'name' } }
							}
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'summary' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'url' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'featured' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'effects' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'url' } }
										]
									}
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'class' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'chemical' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'psychoactive' } }
										]
									}
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'tolerance' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'full' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'half' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'zero' } }
										]
									}
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'roas' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'dose' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'units' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'threshold' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'heavy' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'common' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'max' } }
																]
															}
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'light' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'max' } }
																]
															}
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'strong' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'max' } }
																]
															}
														}
													]
												}
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'duration' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'afterglow' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'max' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'units' } }
																]
															}
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'comeup' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'max' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'units' } }
																]
															}
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'duration' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'max' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'units' } }
																]
															}
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'offset' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'max' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'units' } }
																]
															}
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'onset' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'max' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'units' } }
																]
															}
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'peak' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'max' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'units' } }
																]
															}
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'total' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'max' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'units' } }
																]
															}
														}
													]
												}
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'bioavailability' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'max' } }
													]
												}
											}
										]
									}
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'images' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'thumb' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'image' } }
										]
									}
								},
								{ kind: 'Field', name: { kind: 'Name', value: 'addictionPotential' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'toxicity' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'crossTolerances' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'commonNames' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'uncertainInteractions' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'class' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'psychoactive' } }]
												}
											}
										]
									}
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'unsafeInteractions' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'class' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'psychoactive' } }]
												}
											}
										]
									}
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'dangerousInteractions' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'class' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'psychoactive' } }]
												}
											}
										]
									}
								}
							]
						}
					}
				]
			}
		}
	]
} as unknown as DocumentNode<GetSubstancesQuery, GetSubstancesQueryVariables>
export const AllSubstancesDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'AllSubstances' },
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'substances' },
						arguments: [
							{ kind: 'Argument', name: { kind: 'Name', value: 'limit' }, value: { kind: 'IntValue', value: '9999' } }
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'commonNames' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'url' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'class' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'chemical' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'psychoactive' } }
										]
									}
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'tolerance' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'full' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'half' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'zero' } }
										]
									}
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'roas' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'dose' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'units' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'threshold' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'light' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'max' } }
																]
															}
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'common' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'max' } }
																]
															}
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'strong' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'max' } }
																]
															}
														},
														{ kind: 'Field', name: { kind: 'Name', value: 'heavy' } }
													]
												}
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'duration' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'onset' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'max' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'units' } }
																]
															}
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'comeup' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'max' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'units' } }
																]
															}
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'peak' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'max' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'units' } }
																]
															}
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'offset' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'max' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'units' } }
																]
															}
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'total' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'max' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'units' } }
																]
															}
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'afterglow' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'max' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'units' } }
																]
															}
														}
													]
												}
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'bioavailability' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'min' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'max' } }
													]
												}
											}
										]
									}
								},
								{ kind: 'Field', name: { kind: 'Name', value: 'addictionPotential' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'toxicity' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'crossTolerances' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'uncertainInteractions' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'name' } }]
									}
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'unsafeInteractions' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'name' } }]
									}
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'dangerousInteractions' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'name' } }]
									}
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'effects' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'url' } }
										]
									}
								}
							]
						}
					}
				]
			}
		}
	]
} as unknown as DocumentNode<AllSubstancesQuery, AllSubstancesQueryVariables>
