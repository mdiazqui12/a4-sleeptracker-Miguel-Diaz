import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle,
  IonCardSubtitle, IonCardContent, IonButton, IonDatetimeButton, IonItem, IonToggle,
  IonDatetime, IonModal, ToastController, IonLabel, IonIcon, IonProgressBar
} from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { NotificationService } from '../services/notification.service';
import { addIcons } from 'ionicons';
import { moon, sunny } from 'ionicons/icons';

@Component({
  selector: 'app-today',
  templateUrl: 'today.page.html',
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle,
    IonCardSubtitle, IonCardContent, IonButton, IonDatetimeButton, IonModal, IonItem, IonToggle,
    IonDatetime, IonLabel, IonIcon, IonProgressBar
  ],
})
export class TodayPage {
  constructor(
    public sleepService:SleepService, 
    private router:Router, 
    private toastController:ToastController, 
    public notificationService:NotificationService
    ) {
        addIcons({ moon, sunny});
    }

  //the most recent logs, shown at the top of the page
  get lastNight() {
    return this.sleepService.getLatestOvernight();
  }

  get lastSleepiness() {
    return this.sleepService.getLatestSleepiness();
  }

  //a greeting that matches the time of day
  get greeting():string {
    const hour = new Date().getHours();
    if (hour < 12) {
        return 'Good morning';
    } else if (hour < 18) {
        return 'Good afternoon';
    }
    return 'Good evening';
  }

  //last night's sleep as hours and minutes, like "7h 52m"
  get lastNightShort():string {
    const night = this.lastNight;
    if (!night) {
        return '';
    }
    const totalMinutes = Math.round(night.hoursSlept() * 60);
    return Math.floor(totalMinutes / 60) + 'h ' + (totalMinutes % 60) + 'm';
  }

  //how much of an 8 hour goal last night covered, from 0 to 1 (for the progress bar)
  get goalProgress():number {
    const night = this.lastNight;
    return night ? Math.min(night.hoursSlept() / 8, 1) : 0;
  }

  //the last 7 nights as bars: a short day name, the hours, and a height (a 12 hour night is a full bar)
  get weekBars() {
    return this.sleepService.getOvernightNewestFirst().slice(0, 7).reverse().map((night) => ({
        day: night.sleepEnd.toLocaleDateString('en-US', { weekday: 'short' }),
        hours: night.hoursSlept(),
         percent: Math.min(night.hoursSlept() / 12, 1) * 100
    }));
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
