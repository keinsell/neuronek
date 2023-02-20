import { Service } from 'diod'
import { Body, Get, OperationId, Post, Query, Route, Tags } from 'tsoa'
import { registerAccount } from './user.service.js'
import {
	defineAuthorizationChallangeForAccount,
	solveAuthorizationChallange
} from '../authorization/authorization-challange.js'
import { prisma } from '../../shared/infrastructure/prisma/prisma.js'

@Service()
@Route('user')
@Tags('user')
export class UserController {
	@Post()
	@OperationId('user-register')
	async registerUser(
		@Body()
		body: {
			/**
			 * @example "LS0tLS1CRUdJTiBQR1AgUFVCTElDIEtFWSBCTE9DSy0tLS0tClZlcnNpb246IEtleWJhc2UgR28gNS45LjIgKGRhcndpbikKQ29tbWVudDogSmF5J3MgUHVibGljIEtleQoKbVFJTkJHSWVTaGNCRUFEdEYzYWd3eVAyL0Ryc29QKzVpRTd3T29idEhoQ3pCL1VaS1dtZkU5R1ltcnUwSmgzRgpFanlWSFhCNXpmV2NweGEvcXUxakFkQWhRSUtxK2tVWENLTWYvSG5wZE9XTGlCZEhpS0l0d3lFREEvUVUwcXk1CnlDOVNqNThkc1k3Y0JDY0s1TnpXb01FQUJjRzZoS29mUGZvajBZdzZzam04b0w1YUVLMTB0d0IyT0dTNnhRM1AKd2d3ekY4eWlmWS9wM1lPTmhJOHlWeTJ2YVNTOWJjMlNqN3FqUFE3NWpacDRaajd3VEpqV2FROFVkc0lzdGtrSgpJUVBaR0oyVzlYUzdhMC8xYzl1UEV5R1ZaZGVGaGk1ZVNYcUo1TktGbWYvV2pzdGhjbVRUZlpQOVV5TXBVWUFCCkxFTTlzV3VMaW9OREtZUklRMmRHUGtJMi8yOENHSXZEWnVkWE1RZ21uZXhycDRFOHZGMFVnanp5cVZTWTNXSmsKMzdOMmNNS3FnZmxJT3BHMjMzRVFYbG1JSWpVY1JDdFBrc2NDSEplanZWcTdLcGlYNXVkbGpOQ2prVjF3Nk9yagpDV09xVGk0ellmYlpQNlNKbms0cXkrN3IyRW5SYkJ6TVJXNW5MbUhVb1FWRVFBNlpZS3M1SVZDYXg3Z3k4V0pIClp0cHVINWJ6Vm42SlBtWlpGM2dPdmNvK2hjMFU4eFFzcG4wWXNOdVYrL3ovOHlWTGJZdEI5KzJjSHY1dkl3YlEKZ0JKa25xd25EM1V1L2lOZmdQalM5NlFnaVhJbzIwZzBVaEMzUzM0Z2wrdmVFVVU0N3R0WDg4Q1FUNVplT3JXSQpuTXpiaDRxUDQ1dXFEMFVUU1V4RU5pMWlhRWxKcGxoV05GL0g1RlU0Y1hsM01aL3FLSVBHR3BONTVRQVJBUUFCCnRCNUtZWGtnVjJocGRHVjNiMjlrSUR4clpXbHVjMlZzYkVCd2JTNXRaVDZKQWpnRUV3RUlBQ3dGQW1JZVNoY0oKRU1NVVVUa3NUblFNQWhzREJRa2VFemdBQWhrQkJBc0hDUU1GRlFnS0FnTUVGZ0FCQWdBQWY0b1AvaTh3L2ZEcAp0Snk0ZmpFbHQySWpKV1ptZWxiQitHclhLMHRSQXRvcHloUmxQODB2WGl0VUNUekNUSHFYaXpWcHoyNDh4eUZKCnRnRkh0RmFhR2QveGVnN3lOU2RmTngxeHBXOU0zYUhEcWRmbGdoclRxOW9iSDU0WHlmQmtwZUFtUFh0UGE0dUQKR0xPaHo3Zi8zKzcxeEZNNTdvOE5HWThTTFBUOTFuY1ZNa2lmRWhsalh5M3pmcVhpTDhmdWFZT0FRTGlyVmhqUApqTUFsd2VUeXlDSUpzSjh1MHRMMjkvR3BEUFdGWlp2ZmlaTExNaXJZWWU1dzFVWm05VUtsSmFNZWFOeUh1Z0o0CjVId0QyOHBZYWNXVHlJbnlNUEdhaW15NENMOVlWUlNvK0FsK3VpeGwra082S002cHJHREhzNWc4TjB6QzMvQjAKTUZBMlpmZkc1YmNGOERuMkJIc25wMmpLNGJTOEVyT0w3bXdkaWk1c0RIWHE4ODJTQ1hzWVpzMmdLRkdLWHRySwprZ3MyYlYyYk9Bb3FkSTI3M1B5elpCc1RzT3gzbXZmTHdZeUg4RDN2N0RqSk5Qa2h0bFUyZnFKL3N2TjRZemliClZtNE9Hcnk1Z2FjRWo4RHlnTWo0K1BkN0IxcWJtWm82RlRYOStmN2tlcFhyeEdmN2dNUy8xZVdGUSttWFVHVXYKTlJaWkJQSEZpODJNdDRsaWI3dkRMRW9LQVVYK01CTWdNaTNycjlDUklKR1BnTG5DbEloUStOcktjQUJTT1NhUQpua25CdWo5VnFzekVSZUttZWdHcUVlbXJZeTk4WGh4cWpYSFJRVnAzaVZBeThFVXh6UnJDeUhvbDA4R2F5ZFZKClI3RGZNeHIvSWZNWGxQVWt4RlptZHExZEFGOTE2a0hkV2ptTHVRSU5CR0llU2hjQkVBQzB4Tk4zUzJGMUtYR2UKMEt0dk5yd0htQzdqdE1qT1dxOUk1M2NUU1A2eFYrYTg2ZlU5R2FqYUFTUUo3aW9vdjk1bStPR3gxMCtYUDFJZgp0VlVjNXoyMkUxWVJySTRjR1g2R29pTC9mc2VrNXFqSWpSL1puZ0sweHZMWnY3Wk96Vjh4SllWb0xSY3lqYnNXCkNtT3hUUlNBVXdIL0pSd2FWdDU4U2l3Y0hsS2g5V0RRVmdrdHlLU2xiMy9MRGVKaGd1M3A1MGIxQzZQLzc2WTcKOEhHeGVrYVJUcDFGcHIwRFJUWFJLRGMvR1o0WDIyMGUyMjlISTlnaEdyOVE4Y2hKaTk2QVFINDNSYjA0ZU9Iagp0VEVqbXlOM245QmUzM2RUdHRJTkhzOG1hYWVnWTdCRU81cmFielVOYWFOM2dKcjVqZ0tqbi9neWhZWU5hYUU2CmJ5dUhjTXJRM1FSeW5KRi9KMUE1YU1pVUs0aEtadFBQQ2UxVkhOM2RtdFlsZmNCWHNJTU4zSWNMY1AxcHJFMGsKR2xma2xpR2JoNnBMU0RoM0RZbHpSdXU1QzJZNnhQb2t5VGlrRjRGNUtBR3hoNFd1V0drSHVwbld1TGN4M3djTQpJd01vYjBDUk1UV2pMQm9XVnVtdHkrZ3hNSWJ0SUFCSTdKT3NGVDZWL0dsSXZoOGFsSTFGZG5VYmJyT1JLNHdmCkJna3U4RExQSnZKbHpPZnVGM3FsbXg5d2pyMm5MeExKMFQ2dS95OHF5dDdIcjhOdmh5LzRYazlKeUVMMnNhRlgKOTl5VDBZYWJIRlJzOHdGbjl3dWhFZGp5dWkwS2kybmFpWmlkMm8wR2RtajFzczJSVTRGN3JjQ3dDbndDV2RwWQphUFVQWDJpSWE1cWhadEpVVWhUUU1VQmU1UW5JbXdBUkFRQUJpUUkxQkJnQkNBQXBCUUppSGtvWENSRERGRkU1CkxFNTBEQUliREFVSkhoTTRBQVFMQndrREJSVUlDZ0lEQkJZQUFRSUFBRVUyRC93TnRzWGl1UkJ3LzlhWlpEa0gKeWZxRGwySmZ2Z1N6K243YXNsNnVhRjFZWTZoOXZSaHRteE5ZK2VBL1Q3ZXRMUkZia1JvcE1jTHhmb1NVRGpMSgpURUZRZFg2TXk5Q0t1dzY5S2JURHVuNi8vTlYvMXI5VXhiaGNZc3dpNFV3cElaUVRUNlpqVG5QbDIyMUJ0NWlHCjJmZEhKM1JUOFZWREY0am9FNFk1VW1DY1c5TS9JUUZqR29Ob1VaeThLOVRZb1U1YVhvR1Zsem5IeUIreWN6UW0Kdk8yOXVMWUR6OEdnaUl2ejkzR3hsZjQzUWswZW5EUUYrQUN5ZE1LbllRSmhRQ21YOWkraGhZNnIveENJM2J4Ywo4eXVQMUI3U1Uzd0NidkZkNUNtTFpldjI3aGFEWTNHdzNyMlpMd2hVOVJtNFhHbThWdEhaNkwyM3BOU3JRV25YCnFITlFSN2g1QkRaM2NxdVZlSzM5d1FLUGtlRkZYNjVrY1BqYUtBV3ZXRUZJemR4UnIzMnFzaTBJVTdrWklpODgKeUZPMHVBUlhxL1p4M21XZjlEa3BKNmZXdWJtekFwVE9iVjBkeGJCcUZoUmFzaXF4d1pRNmRiL2xhWkZZRVlRTwpWV3lQYWxXdjRoaEZVRXM5M3c2cHJER3lCUXVoVUlmZ2Jub3RIeDhYaE5jSU1OeGxQWFExOW50ZjArUnorWTdOCi9kUkFNUzVlN0U3Z29ZNXRVOGxOaHdiYjNSS3A4QzdBOXJCSERWelBFb3p2cVF3SUR0aFJabDAxU3BqYXRJSkgKN2dMYnpQSmY5Z1U3T3NGdU5oOUpWaDl2SU1QcTVyUHAwektaVmRnVmtmZldwTWRNSk1zR0xUV2gzemxJYk9KcwpzQ1pXQmxYZ2NuRjN5NHFmcGNHZDY3eldDdz09Cj1NdlVICi0tLS0tRU5EIFBHUCBQVUJMSUMgS0VZIEJMT0NLLS0tLS0K" */
			public_key: string
			/**
			 * @example 'keinsell'
			 */
			username: string
		}
	) {
		// Decode public key from base64
		// const decodedPublicKey = Buffer.from(body.public_key, 'base64').toString()
		// console.log(decodedPublicKey)
		const account = await registerAccount(body.username, body.public_key)
		const challange = await defineAuthorizationChallangeForAccount(account)
		return challange
	}

	@Get('authorization-challange/{username}')
	@OperationId('user-get-authorization-challange')
	async getUserAuthorizationChallange(username: string) {
		// Find account by username
		const account = await prisma.account.findUnique({
			where: { username }
		})

		if (!account) {
			return null
		}

		// Define authorization challange for account
		const challange = await defineAuthorizationChallangeForAccount(account)

		return challange
	}

	@Post('authorization-challange/{challangeId}')
	@OperationId('user-solve-authorization-challange')
	async solveChallange(challangeId: string, @Query('message') message: string) {
		// Find and solve authorization challange
		const solution = await solveAuthorizationChallange(challangeId, message)

		if (!solution) {
			return null
		}

		// Fetch account object from authorization challange
		return {
			id: solution.subject,
			...solution.toJwtTokenAndRefreshToken()
		}
	}
}
