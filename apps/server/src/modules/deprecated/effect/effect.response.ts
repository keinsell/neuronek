export interface EffectResponse {
	/** @example "Abnormal heartbeat" */
	name: string
	/**
	 * @example "An abnormal heartbeat is any of a group of conditions in which the electrical activity of the heart is irregular. During this state, the heartbeat may be too fast (over 100 beats per minute) or too slow (less than 60 beats per minute) and may be regular or irregular. An abnormal heartbeat is most commonly induced under the influence of moderate dosages of stimulant and depressant compounds, such as cocaine, methamphetamine, and GABAergics."
	 */
	summary: string
	/**
	 * @example [
	 * "An abnormal heartbeat (also called an arrhythmia or dysrhythmia) is any of a group of conditions in which the electrical activity of the heart is irregular. During this state, the heartbeat may be too fast (over 100 beats per minute) or too slow (less than 60 beats per minute) and may be regular or irregular. A heartbeat that is too fast is called tachycardia and a heartbeat that is too slow is called bradycardia. Although many arrhythmias are not life-threatening, it is worth noting that some can cause cardiac arrest in extreme cases.", "An abnormal heartbeat is most commonly induced under the influence of moderate dosages of stimulant and depressant compounds, such as cocaine, methamphetamine, and GABAergics. While stimulants tend to increase a person's heart rate, depressants tend to decrease it. Combining the two can often result in dangerously irregular heartbeats. However, this effect can also occur under the influence of deliriants."]
	 */
	page: string[]
	/**
	 * @example "https://effectindex.com/effects/abnormal-heartbeat"
	 */
	effectindex: string
}
