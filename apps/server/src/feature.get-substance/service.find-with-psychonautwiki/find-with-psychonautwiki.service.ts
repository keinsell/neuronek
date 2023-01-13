import { request, gql } from "graphql-request";

export async function findSubstanceWithPsychonautWiki(substanceName: string) {
  const query = gql`
    {
      substances(query: "${substanceName}") {
        name

        # routes of administration
        roas {
          name

          dose {
            units
            threshold
            heavy
            common {
              min
              max
            }
            light {
              min
              max
            }
            strong {
              min
              max
            }
          }

          duration {
            afterglow {
              min
              max
              units
            }
            comeup {
              min
              max
              units
            }
            duration {
              min
              max
              units
            }
            offset {
              min
              max
              units
            }
            onset {
              min
              max
              units
            }
            peak {
              min
              max
              units
            }
            total {
              min
              max
              units
            }
          }

          bioavailability {
            min
            max
          }
        }

        # subjective effects
        effects {
          name
          url
        }
      }
    }
  `;
  const response = await request("https://api.psychonautwiki.org", query);
  console.log(response.substances[0]);
}
