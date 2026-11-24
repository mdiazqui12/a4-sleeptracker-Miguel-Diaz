import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { Preferences } from '@capacitor/preferences';

//the names of the loges that are saved ex. browser = local storage
const OVERNIGHT_KEY = 'overnightSleepLogs';
const SLEEPINESS_KEY = 'sleepinessLogs';

@Injectable({
  providedIn: 'root'
})
export class SleepService {
	private static LoadDefaultData:boolean = true;
	public static AllSleepData:SleepData[] = [];
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];

	constructor() {
		//when app is restarted, it brings back last save
		this.loadFromStorage();
	}

	private addDefaultData() {
		var goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(1, 3, 0); //1:03am
		var wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 8 * 60 * 60 * 1000); //Sleep for exactly eight hours, waking up at 9:03am
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp)); // add that person was asleep 1am-9am yesterday
		var sleepinessDate = new Date();
		sleepinessDate.setDate(sleepinessDate.getDate() - 1); //set to yesterday
		sleepinessDate.setHours(14, 38, 0); //2:38pm
		this.logSleepinessData(new StanfordSleepinessData(4, sleepinessDate)); // add sleepiness at 2pm
		goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(23, 11, 0); //11:11pm
		wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 9 * 60 * 60 * 1000); //Sleep for exactly nine hours
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp));
	}


	// LOGING
	public logOvernightData(sleepData:OvernightSleepData) {
		SleepService.AllOvernightData.push(sleepData);
		this.rebuildAllSleepData();
		this.saveToStorage();
	}

	public logSleepinessData(sleepData:StanfordSleepinessData) {
		SleepService.AllSleepinessData.push(sleepData);
		this.rebuildAllSleepData();
		this.saveToStorage();
	}

	private async loadFromStjpid(){
		try {
			const overnight = await Preferences.get({ key: OVERNIGHT_KEY });
			if (overnight.value) {
				SleepService.AllOvernightData = JSON.parse(overnight.value).map((item:any) => OvernightSleepData.fromStored(item));
			}

			const sleepiness = await Preferences.get({ key: SLEEPINESS_KEY });
			if (sleepiness.value) {
				SleepService.AllSleepinessData = JSON.parse(sleepiness.value).map((item:any) => StanfordSleepinessData.fromStored(item));
			}
		} catch (error) {
			console.log('Could not load the saved sleep logs', error);
		}
		this.rebuildAllSleepData();
	}

	private async saveToStorage() {
		try {
			await Preferences.set({ key: OVERNIGHT_KEY, value: JSON.stringify(SleepService.AllOvernightData) });
			await Preferences.set({ key: SLEEPINESS_KEY, value: JSON.stringify(SleepService.AllSleepinessData) });
		} catch (error) {
			console.log('Could not save the sleep logs', error);
		}
	}
// combined list 
	private rebuildAllSleepData() {
		SleepService.AllSleepData = [...SleepService.AllOvernightData, ...SleepService.AllSleepinessData];
	}

	//overnight logs old on top
	public getOvernightNewestFirst():OvernightSleepData[] {
		return [...SleepService.AllOvernightData].sort((a, b) => b.sleepEnd.getTime() - a.sleepEnd.getTime());
	}

	//sleepiness logs, newest on top
	public getSleepinessNewestFirst():StanfordSleepinessData[] {
		return [...SleepService.AllSleepinessData].sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
	}

	//last night 
	public getLatestOvernight():OvernightSleepData | undefined {
		return this.getOvernightNewestFirst()[0];

	//gets the latest sleepiness log, or undefied if nothing 
	public getLatestSleepiness():StanfordSleepinessData | undefined {
		return this.getSleepinessNewestFirst()[0];
	}

	//deleating his
	public deleteOvernightData(id:string) {
		SleepService.AllOvernightData = SleepService.AllOvernightData.filter((item) => item.id !== id);
		this.rebuildAllSleepData();
		this.saveToStorage();
	}

	public deleteSleepinessData(id:string) {
		SleepService.AllSleepinessData = SleepService.AllSleepinessData.filter((item) => item.id !== id);
		this.rebuildAllSleepData();
		this.saveToStorage();
	}



}

