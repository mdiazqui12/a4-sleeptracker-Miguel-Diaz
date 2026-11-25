/* from the Stanford Sleepiness Scale */
/* https://web.stanford.edu/~dement/sss.html */

import { SleepData } from './sleep-data';

export class StanfordSleepinessData extends SleepData {
	public static ScaleValues = [undefined,//Sleepiness scale starts at 1
	'Feeling active, vital, alert, or wide awake', //1
	'Functioning at high levels, but not at peak; able to concentrate', //2
	'Awake, but relaxed; responsive but not fully alert', //3
	'Somewhat foggy, let down', //4
	'Foggy; losing interest in remaining awake; slowed down', //5
	'Sleepy, woozy, fighting sleep; prefer to lie down', //6
	'No longer fighting sleep, sleep onset soon; having dream-like thoughts']; //7

	private loggedValue:number;

	constructor(loggedValue:number, loggedAt:Date = new Date()) {
		super();
		this.loggedValue = loggedValue;
		this.loggedAt = loggedAt;
	}

	override summaryString():string {
		return this.loggedValue + ": " + StanfordSleepinessData.ScaleValues[this.loggedValue];
	}

	static fromStored(stored:any): StanfordSleepinessData{
		const data = new StanfordSleepinessData(stored.loggedValue, new Date(stored.loggedAt));
		data.id = stored.id;
		return data;
	}

	//the chosen number (the field itself is private)
	get value():number {
		return this.loggedValue;
	}

	//going form green to red depending on how sleepy they are
	badgeColor():string {
		const hue = 120 - (this.loggedValue - 1) * 20;
		return 'hsl(' + hue + ', 65%, 38%)';
	}

	//just the description from the scale, like "Somewhat foggy, let down"
	descriptionString():string {
		return StanfordSleepinessData.ScaleValues[this.loggedValue] ?? '';
	}

	
}
