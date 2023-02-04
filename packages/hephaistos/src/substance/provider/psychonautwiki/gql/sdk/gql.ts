/* eslint-disable */
import * as types from './graphql.js'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
	'query getSubstances($name: String) {\n  substances(query: $name) {\n    name\n    summary\n    url\n    featured\n    effects {\n      name\n      url\n    }\n    class {\n      chemical\n      psychoactive\n    }\n    tolerance {\n      full\n      half\n      zero\n    }\n    roas {\n      name\n      dose {\n        units\n        threshold\n        heavy\n        common {\n          min\n          max\n        }\n        light {\n          min\n          max\n        }\n        strong {\n          min\n          max\n        }\n      }\n      duration {\n        afterglow {\n          min\n          max\n          units\n        }\n        comeup {\n          min\n          max\n          units\n        }\n        duration {\n          min\n          max\n          units\n        }\n        offset {\n          min\n          max\n          units\n        }\n        onset {\n          min\n          max\n          units\n        }\n        peak {\n          min\n          max\n          units\n        }\n        total {\n          min\n          max\n          units\n        }\n      }\n      bioavailability {\n        min\n        max\n      }\n    }\n    images {\n      thumb\n      image\n    }\n    addictionPotential\n    toxicity\n    crossTolerances\n    commonNames\n    uncertainInteractions {\n      class {\n        psychoactive\n      }\n    }\n    unsafeInteractions {\n      class {\n        psychoactive\n      }\n    }\n    dangerousInteractions {\n      class {\n        psychoactive\n      }\n    }\n  }\n}\n\nquery AllSubstances {\n  substances(limit: 9999) {\n    name\n    commonNames\n    url\n    class {\n      chemical\n      psychoactive\n    }\n    tolerance {\n      full\n      half\n      zero\n    }\n    roas {\n      name\n      dose {\n        units\n        threshold\n        light {\n          min\n          max\n        }\n        common {\n          min\n          max\n        }\n        strong {\n          min\n          max\n        }\n        heavy\n      }\n      duration {\n        onset {\n          min\n          max\n          units\n        }\n        comeup {\n          min\n          max\n          units\n        }\n        peak {\n          min\n          max\n          units\n        }\n        offset {\n          min\n          max\n          units\n        }\n        total {\n          min\n          max\n          units\n        }\n        afterglow {\n          min\n          max\n          units\n        }\n      }\n      bioavailability {\n        min\n        max\n      }\n    }\n    addictionPotential\n    toxicity\n    crossTolerances\n    uncertainInteractions {\n      name\n    }\n    unsafeInteractions {\n      name\n    }\n    dangerousInteractions {\n      name\n    }\n    effects {\n      name\n      url\n    }\n  }\n}':
		types.GetSubstancesDocument
}

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: 'query getSubstances($name: String) {\n  substances(query: $name) {\n    name\n    summary\n    url\n    featured\n    effects {\n      name\n      url\n    }\n    class {\n      chemical\n      psychoactive\n    }\n    tolerance {\n      full\n      half\n      zero\n    }\n    roas {\n      name\n      dose {\n        units\n        threshold\n        heavy\n        common {\n          min\n          max\n        }\n        light {\n          min\n          max\n        }\n        strong {\n          min\n          max\n        }\n      }\n      duration {\n        afterglow {\n          min\n          max\n          units\n        }\n        comeup {\n          min\n          max\n          units\n        }\n        duration {\n          min\n          max\n          units\n        }\n        offset {\n          min\n          max\n          units\n        }\n        onset {\n          min\n          max\n          units\n        }\n        peak {\n          min\n          max\n          units\n        }\n        total {\n          min\n          max\n          units\n        }\n      }\n      bioavailability {\n        min\n        max\n      }\n    }\n    images {\n      thumb\n      image\n    }\n    addictionPotential\n    toxicity\n    crossTolerances\n    commonNames\n    uncertainInteractions {\n      class {\n        psychoactive\n      }\n    }\n    unsafeInteractions {\n      class {\n        psychoactive\n      }\n    }\n    dangerousInteractions {\n      class {\n        psychoactive\n      }\n    }\n  }\n}\n\nquery AllSubstances {\n  substances(limit: 9999) {\n    name\n    commonNames\n    url\n    class {\n      chemical\n      psychoactive\n    }\n    tolerance {\n      full\n      half\n      zero\n    }\n    roas {\n      name\n      dose {\n        units\n        threshold\n        light {\n          min\n          max\n        }\n        common {\n          min\n          max\n        }\n        strong {\n          min\n          max\n        }\n        heavy\n      }\n      duration {\n        onset {\n          min\n          max\n          units\n        }\n        comeup {\n          min\n          max\n          units\n        }\n        peak {\n          min\n          max\n          units\n        }\n        offset {\n          min\n          max\n          units\n        }\n        total {\n          min\n          max\n          units\n        }\n        afterglow {\n          min\n          max\n          units\n        }\n      }\n      bioavailability {\n        min\n        max\n      }\n    }\n    addictionPotential\n    toxicity\n    crossTolerances\n    uncertainInteractions {\n      name\n    }\n    unsafeInteractions {\n      name\n    }\n    dangerousInteractions {\n      name\n    }\n    effects {\n      name\n      url\n    }\n  }\n}'
): (typeof documents)['query getSubstances($name: String) {\n  substances(query: $name) {\n    name\n    summary\n    url\n    featured\n    effects {\n      name\n      url\n    }\n    class {\n      chemical\n      psychoactive\n    }\n    tolerance {\n      full\n      half\n      zero\n    }\n    roas {\n      name\n      dose {\n        units\n        threshold\n        heavy\n        common {\n          min\n          max\n        }\n        light {\n          min\n          max\n        }\n        strong {\n          min\n          max\n        }\n      }\n      duration {\n        afterglow {\n          min\n          max\n          units\n        }\n        comeup {\n          min\n          max\n          units\n        }\n        duration {\n          min\n          max\n          units\n        }\n        offset {\n          min\n          max\n          units\n        }\n        onset {\n          min\n          max\n          units\n        }\n        peak {\n          min\n          max\n          units\n        }\n        total {\n          min\n          max\n          units\n        }\n      }\n      bioavailability {\n        min\n        max\n      }\n    }\n    images {\n      thumb\n      image\n    }\n    addictionPotential\n    toxicity\n    crossTolerances\n    commonNames\n    uncertainInteractions {\n      class {\n        psychoactive\n      }\n    }\n    unsafeInteractions {\n      class {\n        psychoactive\n      }\n    }\n    dangerousInteractions {\n      class {\n        psychoactive\n      }\n    }\n  }\n}\n\nquery AllSubstances {\n  substances(limit: 9999) {\n    name\n    commonNames\n    url\n    class {\n      chemical\n      psychoactive\n    }\n    tolerance {\n      full\n      half\n      zero\n    }\n    roas {\n      name\n      dose {\n        units\n        threshold\n        light {\n          min\n          max\n        }\n        common {\n          min\n          max\n        }\n        strong {\n          min\n          max\n        }\n        heavy\n      }\n      duration {\n        onset {\n          min\n          max\n          units\n        }\n        comeup {\n          min\n          max\n          units\n        }\n        peak {\n          min\n          max\n          units\n        }\n        offset {\n          min\n          max\n          units\n        }\n        total {\n          min\n          max\n          units\n        }\n        afterglow {\n          min\n          max\n          units\n        }\n      }\n      bioavailability {\n        min\n        max\n      }\n    }\n    addictionPotential\n    toxicity\n    crossTolerances\n    uncertainInteractions {\n      name\n    }\n    unsafeInteractions {\n      name\n    }\n    dangerousInteractions {\n      name\n    }\n    effects {\n      name\n      url\n    }\n  }\n}']

export function graphql(source: string) {
	return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
	infer TType,
	any
>
	? TType
	: never
