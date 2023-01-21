import test from 'ava'
import { Phase } from './phase.js'

test('constructor(): should create phase', t => {
	const phase = new Phase({ minimalDuration: 1, maximalDuration: 2 })
	t.is(phase.minimalDuration, 1)
	t.is(phase.maximalDuration, 2)
})

test('toString(): should return minimal duration', t => {
	t.is(new Phase({ minimalDuration: 1 }).toString(), '1ms')
})

test('toString(): should return maximal duration', t => {
	t.is(new Phase({ maximalDuration: 2 }).toString(), '2ms')
})

test('toString(): should return minimal and maximal duration', t => {
	t.is(new Phase({ minimalDuration: 1, maximalDuration: 2 }).toString(), '1ms-2ms')
})

test('toString(): should return empty string when no durations', t => {
	t.is(new Phase({}).toString(), '')
})

test('fromString(): should build phase from minimal duration', t => {
	t.is(Phase.fromString('1ms').minimalDuration, 1)
})

test('fromString(): should build phase from maximal duration', t => {
	t.is(Phase.fromString('2ms').minimalDuration, 2)
})

test('fromString(): should build phase from minimal and maximal duration', t => {
	const phase = Phase.fromString('1ms-2ms')
	t.is(phase.minimalDuration, 1)
	t.is(phase.maximalDuration, 2)
})

test('fromString(): should build phase from empty string', t => {
	t.is(Phase.fromString('').minimalDuration, undefined)
})
