/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable max-len */

import fs from 'fs'
import axios from 'axios'
import { GraphQLClient } from 'graphql-request'
import { TsSubstance } from './@types/tripsit'
import { CbSubstance, Dosage, Name } from './@types/combined'
import { PwSubstance } from './@types/psychonaut'

// Limits API calls during development
const useCache = false

const acceptableRoas = [
	'oral',
	'sublingual',
	'buccal',
	'insufflated',
	'rectal',
	'transdermal',
	'subcutaneous',
	'intramuscular',
	'intravenous',
	'smoked'
]

const acceptableDosages = ['threshold', 'heavy', 'common', 'light', 'strong', 'dangerous']

/**
 * Updates the local databases.
 */
export async function updateDrugDb() {
	console.debug('[updateDrugDb] Starting!')
	// const tsData = await getTSData();
	const pwData = await getPWData()
	// await combineData(tsData, pwData);
	console.debug('[updateDrugDb] Finished!')
}

/**
 * Pulls info from TripSit's database.
 */
export async function getTSData(): Promise<TsSubstance[]> {
	console.debug('[getTSData] Starting!')

	const dbName = 'tripsitDB'

	// Check if the cache exists, and if so, use it.
	if (useCache && fs.existsSync(`./cache/${dbName}.json`)) {
		const rawdata = fs.readFileSync(`./cache/${dbName}.json`)
		const data = JSON.parse(rawdata.toString())
		return new Promise(resolve => {
			resolve(data)
			console.debug(`[getTSData] Got ${Object.keys(data).length} drugs from TripSit!`)
		})
	}

	const tsApiUrl = 'https://tripbot.tripsit.me/api/tripsit/getAllDrugs'

	const { data } = await axios.get(tsApiUrl)

	const drugData = data.data[0] as TsSubstance[]

	saveData(drugData, dbName)

	return new Promise(resolve => {
		resolve(drugData)
		console.debug(`[getTSData] Got ${Object.keys(drugData).length} drugs from TripSit!`)
	})
}

/**
 * Pulls info from PsychonautWiki's database.
 */
export async function getPWData(): Promise<any> {
	console.debug('[getPwData] Starting!')
	const dbName = 'psychonautDB'

	// Check if the cache exists, and if so, use it.
	if (useCache && fs.existsSync(`./cache/${dbName}.json`)) {
		const rawdata = fs.readFileSync(`./cache/${dbName}.json`)
		const data = JSON.parse(rawdata.toString())
		return new Promise(resolve => {
			resolve(data)
			console.debug(`[getTSData] Got ${Object.keys(data).length} drugs from Psychonaut Wiki!`)
		})
	}

	// PW uses graphql, so we need to use a graphql client
	const pwApiUrl = 'https://api.psychonautwiki.org'
	const pwClient = new GraphQLClient(pwApiUrl)
	const pwQuery = `
  {
    substances(limit: 1000) {
      url 
      name
      summary
      addictionPotential
      toxicity
      crossTolerances
      commonNames
      class {chemical psychoactive}
      tolerance {full half zero}
      uncertainInteractions {name}
      unsafeInteractions {name}
      dangerousInteractions {name}
      roa {oral {name dose {units threshold heavy common {min max} light {min max} strong {min max}} duration { afterglow {min max units} comeup {min max units} duration {min max units} offset {min max units} onset {min max units} peak {min max units} total {min max units}} bioavailability {min max}} sublingual {name dose {units threshold heavy common {min max} light {min max} strong {min max}} duration { afterglow {min max units} comeup {min max units} duration {min max units} offset {min max units} onset {min max units} peak {min max units} total {min max units}} bioavailability {min max}} buccal {name dose {units threshold heavy common {min max} light {min max} strong {min max}} duration { afterglow {min max units} comeup {min max units} duration {min max units} offset {min max units} onset {min max units} peak {min max units} total {min max units}} bioavailability {min max}} insufflated {name dose {units threshold heavy common {min max} light {min max} strong {min max}} duration { afterglow {min max units} comeup {min max units} duration {min max units} offset {min max units} onset {min max units} peak {min max units} total {min max units}} bioavailability {min max}} rectal {name dose {units threshold heavy common {min max} light {min max} strong {min max}} duration { afterglow {min max units} comeup {min max units} duration {min max units} offset {min max units} onset {min max units} peak {min max units} total {min max units}} bioavailability {min max}} transdermal {name dose {units threshold heavy common {min max} light {min max} strong {min max}} duration { afterglow {min max units} comeup {min max units} duration {min max units} offset {min max units} onset {min max units} peak {min max units} total {min max units}} bioavailability {min max}} subcutaneous {name dose {units threshold heavy common {min max} light {min max} strong {min max}} duration { afterglow {min max units} comeup {min max units} duration {min max units} offset {min max units} onset {min max units} peak {min max units} total {min max units}} bioavailability {min max}} intramuscular {name dose {units threshold heavy common {min max} light {min max} strong {min max}} duration { afterglow {min max units} comeup {min max units} duration {min max units} offset {min max units} onset {min max units} peak {min max units} total {min max units}} bioavailability {min max}} intravenous {name dose {units threshold heavy common {min max} light {min max} strong {min max}} duration { afterglow {min max units} comeup {min max units} duration {min max units} offset {min max units} onset {min max units} peak {min max units} total {min max units}} bioavailability {min max}} smoked {name dose {units threshold heavy common {min max} light {min max} strong {min max}} duration { afterglow {min max units} comeup {min max units} duration {min max units} offset {min max units} onset {min max units} peak {min max units} total {min max units}} bioavailability {min max}}}    }
  }
  `

	/**
	 * @param {number} attempt - The number of times the function has been called
	 */
	// async function tryThreeTimes(attempt:number):Promise<any> {
	//   if (attempt < 3) {
	//     try {
	//       console.debug(`[getPwData] tryThreeTimes: try #${attempt + 1}`);
	//       await pwClient.request(pwQuery).then((data) => {
	//         if (data.substances) {
	//           console.debug(`[getPwData] tryThreeTimes: try #${attempt + 1} success`);
	//           return data.substances;
	//         }
	//       });
	//     } catch (error:any) {
	//       if (error.response.status === 200) {
	//         console.debug(`[getPwData] tryThreeTimes: try #${attempt + 1} failed,
	//         but status code is 200, so we'll return the data`);
	//         console.debug(error.response.errors);
	//         error.response.errors.forEach((e:any) => {
	//           const drugName = error.response.data.substances[e.path[1]].name;
	//           console.debug( error.response.data.substances[e.path[1]]);
	//           const property = e.path[2];
	//           const subProperty = e.path[3];
	//           // eslint-disable-next-line max-len
	//           console.debug(`Error at: ${drugName}${property ? `/${property}` : ``}${subProperty ? `/${subProperty}` : ``}`);
	//           console.debug(e.message);
	//         });
	//         console.debug(`[getPwData] tryThreeTimes: try #${attempt + 1} success`);
	//         return error.response.data.substances;
	//       } else {
	//         tryThreeTimes(attempt+1);
	//       }
	//     }
	//   } else {
	//     console.error(`[getPwData] tryThreeTimes: failed after ${attempt} attempts!`);
	//   }
	// }

	/**
	 */
	async function queryPW(): Promise<any> {
		console.debug(`[queryPW] Starting!`)
		try {
			// console.debug(`[queryPW] requesting: ${pwQuery}`);
			await pwClient.request(pwQuery).then(data => {
				console.debug(`[queryPW] data: ${data}!`)
				if (data.substances) {
					console.debug(`[queryPW] queryPW: success`)
					return data.substances
				}
			})
		} catch (error: any) {
			if (error.response.status === 200) {
				console.debug(`[queryPW] queryPW: failed,
          but status code is 200, so we'll return the data`)
				console.debug(error.response.errors)
				error.response.errors.forEach((e: any) => {
					const drugName = error.response.data.substances[e.path[1]].name
					console.debug(error.response.data.substances[e.path[1]])
					const property = e.path[2]
					const subProperty = e.path[3]
					// eslint-disable-next-line max-len
					console.debug(`Error at: ${drugName}${property ? `/${property}` : ``}${subProperty ? `/${subProperty}` : ``}`)
					console.debug(e.message)
				})
				console.debug(`[queryPW] queryPW: success`)
				return error.response.data.substances
			}
		}
	}

	const drugData = await queryPW()

	// saveData(drugData, dbName);
	return new Promise(resolve => {
		resolve(drugData)
		console.debug(`[updateDrugDb] Got ${drugData.length} drugs from psychonautwiki`)
	})
}

/**
 * Combines both databases into a single standard DB.
 * @param {tsDrugEntry[]} tsData
 * @param {pwDrugEntry[]} pwData
 */
export async function combineData(tsData: TsSubstance[], pwData: PwSubstance[]): Promise<CbSubstance[]> {
	console.debug('[combineData] Starting!')

	const dbName = 'combinedDb'
	const combinedDb = [] as CbSubstance[]
	let combinedDbLength = 0

	pwData.forEach(pwDrug => {
		const combinedDrug = {} as CbSubstance

		combinedDrug.url = pwDrug.url
		// combinedDrug.experiencesUrl =
		combinedDrug.name = pwDrug.name
		combinedDrug.aliases = pwDrug.commonNames
		combinedDrug.aliasesStr = pwDrug.commonNames.join(', ')
		combinedDrug.summary = pwDrug.summary
		// combinedDrug.reagents =
		combinedDrug.classes = pwDrug.class
		combinedDrug.toxicity = pwDrug.toxicity
		combinedDrug.addictionPotential = pwDrug.addictionPotential
		combinedDrug.tolerance = pwDrug.tolerance
		combinedDrug.crossTolerances = pwDrug.crossTolerances
		// combinedDrug.roas = pwDrug.roa;
		// combinedDrug.interactions =

		combinedDb.push(combinedDrug)
		combinedDbLength++
	})

	// Go through each key in tsData and build out a combinedDb[] object
	// Object.keys(tsData).forEach((key) => {
	//   const tsDrug = tsData[key as keyof typeof tsData] as TsSubstance;
	//   console.debug(`[combineData] (${combinedDbLength}) Combining ${tsDrug.name}`);
	//   const combinedDrug = {} as CbSubstance;

	//   combinedDrug.name = tsDrug.pretty_name;

	//   if (tsDrug.properties) {
	//     if (tsDrug.properties.summary) {
	//       combinedDrug.summary = tsDrug.properties.summary;
	//     }

	//     if (tsDrug.properties['test-kits']) {
	//       combinedDrug.reagents = tsDrug.properties['test-kits'];
	//     }

	//     if (tsDrug.properties.bioavailability) {
	//       // Match for the bioavailablity ROA and value
	//       const bioMatch = tsDrug.properties.bioavailability.matchAll(/([a-zA-Z\/]+)[.:\s]+([0-9\.%\s\+\-]+)/g);
	//       if (bioMatch) {
	//         for (const match of bioMatch) {
	//           // Replace trailing characters with nothing
	//           const bioValue = match[2].replace(/[. \t+]+$/, '');
	//           const roaName = match[1];

	//           // Check if the value is actually a number
	//           // if (bioValue.match(/[0-9]/)) {
	//           if (acceptableRoas.includes(roaName.toLowerCase())) {
	//             const roaEntry = {
	//               name: match[1],
	//               bioavailability: bioValue,
	//             };

	//             if (combinedDrug.roas) {
	//               let index = 0;
	//               combinedDrug.roas.forEach((roa) => {
	//                 console.debug(`[combineData] Attempting to merge roa: ${roa.name}`);
	//                 if (roa.name === roaName) {
	//                   console.debug(`[combineData] Merging roa: ${roa.name}`);
	//                   roa.bioavailability = bioValue;
	//                 }
	//                 combinedDrug.roas[index] = roa;
	//                 index++;
	//               });
	//             } else {
	//               combinedDrug.roas = [{
	//                 name: roaName,
	//                 bioavailability: bioValue,
	//               }];
	//             }
	//           }
	//         }
	//       }
	//     }
	//   }

	//   if (tsDrug.formatted_dose) {
	//     Object.keys(tsDrug.formatted_dose).forEach((roaName) => {
	//       if (acceptableRoas.includes(roaName.toLowerCase())) {
	//         const roaDose = tsDrug.formatted_dose![roaName as keyof typeof tsDrug.formatted_dose];
	//         const dosages = [] as Dosage[];

	//         // I hate to use 'as any' here but TS's database does not have great typings
	//         Object.keys(roaDose as any).forEach((doseName) => {
	//           if (acceptableDosages.includes(doseName.toLowerCase())) {
	//             dosages.push({
	//               name: doseName as Name,
	//               value: roaDose![doseName as keyof typeof roaDose],
	//             });
	//           }
	//         });

	//         if (combinedDrug.roas) {
	//           let index = 0;
	//           combinedDrug.roas.forEach((roa) => {
	//             console.debug(`[combineData] Attempting to merge roa: ${roa.name}`);
	//             if (roa.name === roaName) {
	//               console.debug(`[combineData] Merging roa: ${roa.name}`);
	//               roa.dosage = dosages;
	//             }
	//             combinedDrug.roas[index] = roa;
	//             index++;
	//           });
	//         } else {
	//           combinedDrug.roas = [{
	//             name: roaName,
	//             dosage: dosages,
	//           }];
	//         }
	//       }
	//     });
	//   }

	//   // if (tsDrug.formatted_onset) {
	//   //   Object.keys(tsDrug.formatted_onset).forEach((roaName) => {
	//   //     if (acceptableRoas.includes(roaName.toLowerCase())) {
	//   //       const roaOnset = tsDrug.formatted_onset![roaName as keyof typeof tsDrug.formatted_onset];

	//   //       // I hate to use 'as any' here but TS's database does not have great typings
	//   //       Object.keys(roaDose as any).forEach((doseName) => {
	//   //         if (acceptableDosages.includes(doseName.toLowerCase())) {
	//   //           dosages.push({
	//   //             name: doseName as Name,
	//   //             value: roaDose![doseName as keyof typeof roaDose],
	//   //           });
	//   //         }
	//   //       });

	//   //       let index = 0;
	//   //       combinedDrug.roas.forEach((roa) => {
	//   //         console.debug(`[combineData] Attempting to merge roa: ${roa.name}`);
	//   //         if (roa.name === roaName) {
	//   //           console.debug(`[combineData] Merging roa: ${roa.name}`);
	//   //           roa.dosage = dosages;
	//   //         }
	//   //         combinedDrug.roas[index] = roa;
	//   //         index++;
	//   //       });
	//   //     }
	//   //   });
	//   // }

	//   if (tsDrug.aliases !== undefined && tsDrug.aliases.length > 0) {
	//     combinedDrug.aliases = tsDrug.aliases;
	//     combinedDrug.aliasesStr = tsDrug.aliases.join(', ');
	//   };

	//   if (tsDrug.links) {
	//     if (tsDrug.links.experiences) {
	//       combinedDrug.experiencesUrl = tsDrug.links.experiences;
	//     }
	//   }

	//   // combinedDrug.url =
	//   // combinedDrug.classes =
	//   // combinedDrug.toxicity =
	//   // combinedDrug.addictionPotential =
	//   // combinedDrug.tolerance =
	//   // combinedDrug.crossTolerances =
	//   // combinedDrug.interactions =
	//   combinedDb.push(combinedDrug);
	//   combinedDbLength++;
	// });

	saveData(combinedDb, dbName)

	return new Promise(resolve => {
		resolve([])
		console.debug(`[combineData] Saved ${combinedDb.length} drugs to the local DB`)
	})
}

/**
 * Saves data to the local system
 * @param {any} data
 * @param {string} fileName
 */
export async function saveData(data: any, fileName: string): Promise<void> {
	console.debug('[saveData] Starting!')
	fs.writeFile(`.\\cache\\${fileName}.json`, JSON.stringify(data, null, 2), function (err) {
		if (err) {
			console.log(err)
		}
	})

	return new Promise(resolve => {
		resolve()
		console.debug(`[saveData] Saved ${`${fileName}.json`}!`)
	})
}

updateDrugDb()
