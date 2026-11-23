import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel,
  IonList, IonListHeader, IonItem, IonNote, IonButton, IonDatetime, IonDatetimeButton,
  IonModal, IonRange, ToastController} from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, IonItem, IonListHeader, IonSegment, IonSegmentButton,
    IonList, IonNote, IonButton, IonLabel, IonDatetime, IonModal, IonRange, IonDatetimeButton],
})
export class HomePage {

	//what the page is showing ex. overnight, sleepineess, or history
	view:string= 'overight';

	//overnight sleep ex. (2026-11-23T01:37:01) which is how ion datetime works
	bedTime:string= '';
	wakeTime:string = '';
	//time a person can choose so no future logging takes place
	maxDtate:string ='';
	//sleeping form
	sleepinessValue:number = 3;
	sleepinessTime:string ='';
	//des of stan sleepiness scale
	scaleValues = StanfordSleepinessData.ScaleValues;

  constructor(public sleepService:SleepService, private toastController:ToastController) {
	this.resetForms();
	}

	get allSleepData() {
		return SleepService.AllSleepData;
	}
	get overnightLogs():OvernightSleepData[] {
		return [...SleepService.AllOvernightData].reverse();
	
	}
	
	get sleepnessLogs():StanfordSleepinessData[] {
		return [...SleepService.AllSleepinessData].reverse();
	}

	//overnight only works when the time is after the bed time, and sleep is within 24 hours
	get canSaveOvernight():boolean {
		const hoursSlept = (new Date(this.wakeTime).getTime() - new Date(this.bedTime).getTime())/ (1000 * 60 *60 );
		return hoursSlept>0&&hoursSlept<=24;
	}

	//puts the forms back to their starting values: woke up now, went to bed 8 hours ago
  resetForms() {
    const now = new Date();
    const eightHoursAgo = new Date(now.getTime() - 8 * 60 * 60 * 1000);
    this.wakeTime = this.toLocalISOString(now);
    this.bedTime = this.toLocalISOString(eightHoursAgo);
    this.sleepinessTime = this.toLocalISOString(now);
    this.maxDtate = this.toLocalISOString(now);
  }

  //turns a Date into text in the person's own time zone (toISOString would use UTC, and the times would be off)
  private toLocalISOString(date:Date):string {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 19);
  }

  saveOvernight() {
    if (!this.canSaveOvernight) {
      return;
    }
    this.sleepService.logOvernightData(new OvernightSleepData(new Date(this.bedTime), new Date(this.wakeTime)));
    this.resetForms();
    this.showToast('Overnight sleep saved');
    this.view = 'history';
  }

  saveSleepiness() {
    this.sleepService.logSleepinessData(new StanfordSleepinessData(Number(this.sleepinessValue), new Date(this.sleepinessTime)));
    this.resetForms();
    this.showToast('Sleepiness saved');
    this.view = 'history';
  }

  //a short message at the bottom of the screen that confirms what just happened
  async showToast(message:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }
}