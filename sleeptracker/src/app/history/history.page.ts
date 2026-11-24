import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonItem, IonLabel
} from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';

@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonItem, IonLabel],
})
export class HistoryPage {
  constructor(private sleepService:SleepService) {}

  //newest logs first
  get overnightLogs() {
    return this.sleepService.getOvernightNewestFirst();
  }

  get sleepinessLogs() {
    return this.sleepService.getSleepinessNewestFirst();
  }
}
