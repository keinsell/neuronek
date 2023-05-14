import test from 'ava'
import request from 'supertest'
import { HttpApplication as app } from '../../http.js'

test('should return error when missing authChallengeId in request body', async t => {
	const response = await request(app).post('/challange').send({ message: 'valid-auth-response' })

	t.is(response.status, 400)
	t.truthy(response.body.error)
})

test('should return error when missing message in request body', async t => {
	const response = await request(app).post('/challange').send({ authChallengeId: 'valid-auth-challenge-id' })

	t.is(response.status, 400)
	t.truthy(response.body.error)
})
