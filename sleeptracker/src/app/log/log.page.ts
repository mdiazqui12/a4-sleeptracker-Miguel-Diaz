import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel,
  IonList, IonItem, IonNote, IonButton, IonDatetime, IonDatetimeButton,
  IonModal, IonRange, ToastController
} from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
  selector: 'app-log',
  templateUrl: 'log.page.html',
  imports: [
    FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel,
    IonList, IonItem, IonNote, IonButton, IonDatetime, IonDatetimeButton, IonModal, IonRange
  ],
})
export class LogPage implements OnInit {
  //which form is showing: 'overnight' or 'sleepiness'
  view:string = 'overnight';

  //the overnight sleep form (text like 2026-11-19T01:03:00, which is what ion-datetime uses)
  bedTime:string = '';
  wakeTime:string = '';

  //the sleepiness form
  sleepinessValue:number = 3;
  sleepinessTime:string = '';

  //the latest time a person can pick, so they cannot log something in the future
  maxDate:string = '';

  //the descriptions of each number on the Stanford Sleepiness Scale
  scaleValues = StanfordSleepinessData.ScaleValues;

  constructor(
    private sleepService:SleepService,
    private toastController:ToastController,
    private router:Router,
    private route:ActivatedRoute
  ) {
    this.resetForms();
  }

  ngOnInit() {
    //the Today page can open this page on a specific form, like /tabs/log?view=sleepiness
    this.route.queryParams.subscribe((params) => {
      if (params['view'] === 'overnight' || params['view'] === 'sleepiness') {
        this.view = params['view'];
      }
    });
  }

  //runs every time the person opens this tab, so the times start at "now" again
  ionViewWillEnter() {
    this.resetForms();
  }

  //the overnight form is valid when the wake time is after the bed time, and the sleep is 24 hours or less
  get canSaveOvernight():boolean {
    const hoursSlept = (new Date(this.wakeTime).getTime() - new Date(this.bedTime).getTime()) / (1000 * 60 * 60);
    return hoursSlept > 0 && hoursSlept <= 24;
  }

  //puts the forms back to their starting values: woke up now, went to bed 8 hours ago
  resetForms() {
    const now = new Date();
    const eightHoursAgo = new Date(now.getTime() - 8 * 60 * 60 * 1000);
    this.wakeTime = this.toLocalISOString(now);
    this.bedTime = this.toLocalISOString(eightHoursAgo);
    this.sleepinessTime = this.toLocalISOString(now);
    this.maxDate = this.toLocalISOString(now);
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
    this.router.navigate(['/tabs/history']);
  }

  saveSleepiness() {
    this.sleepService.logSleepinessData(new StanfordSleepinessData(Number(this.sleepinessValue), new Date(this.sleepinessTime)));
    this.resetForms();
    this.showToast('Sleepiness saved');
    this.router.navigate(['/tabs/history']);
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