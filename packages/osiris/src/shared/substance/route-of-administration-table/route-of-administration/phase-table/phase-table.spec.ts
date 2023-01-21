import test from 'ava'
import { PhaseTable } from './phase-table.js'
import { PhaseClassification } from './phase-classification.js'
import { Phase } from './phase/phase.js'

test('constructor(): should create phase table', t => {
	const phaseTable = new PhaseTable({
		[PhaseClassification.onset]: new Phase({ minimalDuration: 1, maximalDuration: 2 }),
		[PhaseClassification.comeup]: new Phase({ minimalDuration: 1, maximalDuration: 2 }),
		[PhaseClassification.peak]: new Phase({ minimalDuration: 1, maximalDuration: 2 }),
		[PhaseClassification.offset]: new Phase({ minimalDuration: 1, maximalDuration: 2 }),
		[PhaseClassification.aftereffects]: new Phase({ minimalDuration: 1, maximalDuration: 2 })
	})

	t.is(phaseTable.onset.minimalDuration, 1)
	t.is(phaseTable.onset.maximalDuration, 2)
	t.is(phaseTable.comeup.minimalDuration, 1)
	t.is(phaseTable.comeup.maximalDuration, 2)
	t.is(phaseTable.peak.minimalDuration, 1)
	t.is(phaseTable.peak.maximalDuration, 2)
	t.is(phaseTable.offset.minimalDuration, 1)
	t.is(phaseTable.offset.maximalDuration, 2)
	t.is(phaseTable.aftereffects.minimalDuration, 1)
	t.is(phaseTable.aftereffects.maximalDuration, 2)
})

test('totalDuration(): should return total duration of effects', t => {
	const phaseTable = new PhaseTable({
		[PhaseClassification.onset]: new Phase({ minimalDuration: 1, maximalDuration: 10 }),
		[PhaseClassification.comeup]: new Phase({ minimalDuration: 2, maximalDuration: 20 }),
		[PhaseClassification.peak]: new Phase({ minimalDuration: 3, maximalDuration: 30 }),
		[PhaseClassification.offset]: new Phase({ minimalDuration: 4, maximalDuration: 40 }),
		[PhaseClassification.aftereffects]: new Phase({ minimalDuration: 5, maximalDuration: 50 })
	})

	t.is(phaseTable.totalDuration.minimalDuration, 10)
	t.is(phaseTable.totalDuration.maximalDuration, 100)
})

test('calculateTimeToStartOfPhase(): should return time to phase', t => {
	const phaseTable = new PhaseTable({
		[PhaseClassification.onset]: new Phase({ minimalDuration: 1, maximalDuration: 10 }),
		[PhaseClassification.comeup]: new Phase({ minimalDuration: 2, maximalDuration: 20 }),
		[PhaseClassification.peak]: new Phase({ minimalDuration: 3, maximalDuration: 30 }),
		[PhaseClassification.offset]: new Phase({ minimalDuration: 4, maximalDuration: 40 }),
		[PhaseClassification.aftereffects]: new Phase({ minimalDuration: 5, maximalDuration: 50 })
	})

	t.is(phaseTable.calculateTimeToStartOfPhase(PhaseClassification.peak).minimalDuration, 3)
	t.is(phaseTable.calculateTimeToStartOfPhase(PhaseClassification.peak).maximalDuration, 30)
	t.is(phaseTable.calculateTimeToStartOfPhase(PhaseClassification.offset).minimalDuration, 6)
	t.is(phaseTable.calculateTimeToStartOfPhase(PhaseClassification.offset).maximalDuration, 60)
})

test('calculateTimeToEndOfPhase(): should return time to phase', t => {
	const phaseTable = new PhaseTable({
		[PhaseClassification.onset]: new Phase({ minimalDuration: 1, maximalDuration: 10 }),
		[PhaseClassification.comeup]: new Phase({ minimalDuration: 2, maximalDuration: 20 }),
		[PhaseClassification.peak]: new Phase({ minimalDuration: 3, maximalDuration: 30 }),
		[PhaseClassification.offset]: new Phase({ minimalDuration: 4, maximalDuration: 40 }),
		[PhaseClassification.aftereffects]: new Phase({ minimalDuration: 5, maximalDuration: 50 })
	})

	t.is(phaseTable.calculateTimeToEndOfPhase(PhaseClassification.onset).minimalDuration, 1)
	t.is(phaseTable.calculateTimeToEndOfPhase(PhaseClassification.onset).maximalDuration, 10)
	t.is(phaseTable.calculateTimeToEndOfPhase(PhaseClassification.comeup).minimalDuration, 3)
	t.is(phaseTable.calculateTimeToEndOfPhase(PhaseClassification.comeup).maximalDuration, 30)
})

test(`toJSON(): should return serialized phase table`, t => {
	const phaseTable = new PhaseTable({
		[PhaseClassification.onset]: new Phase({ minimalDuration: 1, maximalDuration: 10 }),
		[PhaseClassification.comeup]: new Phase({ minimalDuration: 2, maximalDuration: 20 }),
		[PhaseClassification.peak]: new Phase({ minimalDuration: 3, maximalDuration: 30 }),
		[PhaseClassification.offset]: new Phase({ minimalDuration: 4, maximalDuration: 40 }),
		[PhaseClassification.aftereffects]: new Phase({ minimalDuration: 5, maximalDuration: 50 })
	})

	const serializedPhaseTable = {
		onset: '1ms-10ms',
		comeup: '2ms-20ms',
		peak: '3ms-30ms',
		offset: '4ms-40ms',
		aftereffects: '5ms-50ms'
	}

	t.deepEqual(phaseTable.toJSON(), serializedPhaseTable)
})

test('fromJSON(): should return deserialized phase table', t => {
	const serializedPhaseTable = {
		onset: '1ms-10ms',
		comeup: '2ms-20ms',
		peak: '3ms-30ms',
		offset: '4ms-40ms',
		aftereffects: '5ms-50ms'
	}

	const phaseTable = PhaseTable.fromJSON(serializedPhaseTable)

	t.deepEqual(phaseTable.toJSON(), serializedPhaseTable)
})
