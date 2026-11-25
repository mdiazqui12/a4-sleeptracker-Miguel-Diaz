import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonToggle, IonDatetime, IonDatetimeButton, IonModal, ToastController
} from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonToggle, IonDatetime, IonDatetimeButton, IonModal],
})
export class HistoryPage {
  constructor(
    public sleepService:SleepService,
    public notificationService:NotificationService,
    private router:Router,
    private toastController:ToastController
  ) {}

  //newest logs first
  get overnightLogs() {
    return this.sleepService.getOvernightNewestFirst();
  }

  get sleepinessLogs() {
    return this.sleepService.getSleepinessNewestFirst();
  }
  get lastNight(){
    return this.sleepService.getLatestOvernight();

  }
  get lastSleepiness(){
    return this.sleepService.getLatestSleepiness();
  }

  //opens log tab on right side
  goToLog(view:string) {
    this.router.navigate(['/tabs/log'], { queryParams: { view: view } });
  }

  //reminders

  async showToast(message:string, color:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: 'bottom',
      color: color
    });
    await toast.present();
  }

  async toggleReminder(event:CustomEvent) {
    const worked = await this.notificationService.setEnabled(event.detail.checked);
    if (!worked) {
      //put the switch back to off, and explain why
      (event.target as any).checked = false;
      this.showToast('Notifications are blocked. Allow them in your browser or phone settings to get reminders.', 'warning');
    }
  }

  async sendTest() {
    const worked = await this.notificationService.sendTestReminder();
    if (worked) {
      this.showToast('A test reminder will show up in 5 seconds', 'success');
    } else {
      this.showToast('Notifications are blocked. Allow them in your browser or phone settings.', 'warning');
    }
  }

  //the time picker gives text like "14:00" or a full date, so keep just the hours and minutes
  async changeReminderTime(event:CustomEvent) {
    const value = String(event.detail.value);
    const timePart = value.includes('T') ? value.split('T')[1] : value;
    await this.notificationService.setTime(timePart.slice(0, 5));
  }

}




