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
	public static AllSleepData:SleepData[] = [];
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];

	constructor() {
		//when app is restarted, it brings back last save
		this.loadFromStorage();
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

	private async loadFromStorage(){
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

	}
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

