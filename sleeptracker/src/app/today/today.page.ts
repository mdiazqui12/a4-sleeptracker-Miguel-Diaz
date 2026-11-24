import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle,
  IonCardSubtitle, IonCardContent, IonButton
} from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';

@Component({
  selector: 'app-today',
  templateUrl: 'today.page.html',
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle,
    IonCardSubtitle, IonCardContent, IonButton
  ],
})
export class TodayPage {
  constructor(public sleepService:SleepService, private router:Router) {}

  //the most recent logs, shown at the top of the page
  get lastNight() {
    return this.sleepService.getLatestOvernight();
  }

  get lastSleepiness() {
    return this.sleepService.getLatestSleepiness();
  }

  //opens the Log tab
  goToLog(view:string) {
    this.router.navigate(['/tabs/log'], { queryParams: { view: view } });
  }
}
