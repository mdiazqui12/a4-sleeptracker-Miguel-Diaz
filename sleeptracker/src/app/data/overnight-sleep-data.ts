import { SleepData } from './sleep-data';

export class OvernightSleepData extends SleepData {
	private sleepStart:Date;
	private sleepEnd:Date;

	constructor(sleepStart:Date, sleepEnd:Date) {
		super();
		this.sleepStart = sleepStart;
		this.sleepEnd = sleepEnd;
	}

	override summaryString():string {
		var sleepStart_ms = this.sleepStart.getTime();
		var sleepEnd_ms = this.sleepEnd.getTime();

		// Calculate the difference in milliseconds
		var difference_ms = sleepEnd_ms - sleepStart_ms;
		    
		// Convert to hours and minutes
		return Math.floor(difference_ms / (1000*60*60)) + " hours, " + Math.floor(difference_ms / (1000*60) % 60) + " minutes.";
	}

	override dateString():string {
		return "Night of " + this.sleepStart.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	}

	//bed and wake times, such as 00.00 Am to 00.00PM
	override timeString(): string {
		const format = { hour: 'numeric', minute: '2-digit' } as const;
		return this.sleepStart.toLocaleTimeString('en-US', format) + ' to ' + this.sleepEnd.toLocaleTimeString('en-US', format);
	}

	//building log from plain object. (dates are saved as text and then braught back to dates)
	static fromStored(stored:any):OvernightSleepData {
		const data = new OvernightSleepData(new Date(stored.sleepStart), new Date(stored.sleepEnd));
		data.id = stored.id;
		data.loggedAt = new Date(stored.loggedAt);
		return data;
	}
}
