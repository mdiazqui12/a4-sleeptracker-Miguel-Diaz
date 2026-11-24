import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle,
  IonCardSubtitle, IonCardContent, IonButton, IonDatetimeButton, IonItem, IonToggle,
  IonDatetime, IonModal, ToastController, IonLabel
} from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-today',
  templateUrl: 'today.page.html',
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle,
    IonCardSubtitle, IonCardContent, IonButton, IonDatetimeButton, IonModal, IonItem, IonToggle,
    IonDatetime, IonLabel, 
  ],
})
export class TodayPage {
  constructor(public sleepService:SleepService, private router:Router, private toastController:ToastController, public notificationService:NotificationService,) {}

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

  // ---------- Reminders ----------

  async toggleReminder(event:CustomEvent) {
    const worked = await this.notificationService.setEnabled(event.detail.checked);
    if (!worked) {
      //put the switch back to off, and explain why
      (event.target as any).checked = false;
      this.showToast('Notifications are blocked. Allow them in your browser or phone settings to get reminders.', 'warning');
    }
  }

  //the time picker gives text like "14:00" or a full date, so keep just the hours and minutes
  async changeReminderTime(event:CustomEvent) {
    const value = String(event.detail.value);
    const timePart = value.includes('T') ? value.split('T')[1] : value;
    await this.notificationService.setTime(timePart.slice(0, 5));
  }

  async sendTest() {
    const worked = await this.notificationService.sendTestReminder();
    if (worked) {
      this.showToast('A test reminder will show up in 5 seconds', 'success');
    } else {
      this.showToast('Notifications are blocked. Allow them in your browser or phone settings.', 'warning');
    }
  }

  async showToast(message:string, color:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: 'bottom',
      color: color
    });
    await toast.present();
  }
}
