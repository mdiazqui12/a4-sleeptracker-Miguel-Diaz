import { LocalNotifications, Schedule } from '@capacitor/local-notifications';
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

//each notification has their own number
const DAILY_REMINDER_ID = 1;
const TEST_REMINDER_ID = 2;

//the name the reminder settings are saved under
const SETTINGS_KEY = 'reminderSettings';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  //is the daily reminder on, and at what time (like "14:00")
  enabled:boolean = false;
  time:string = '14:00';

  constructor() {
    this.loadSettings();
  }

  // Saved settings 
  private async loadSettings() {
    try {
      const stored = await Preferences.get({ key: SETTINGS_KEY });
      if (stored.value) {
        const settings = JSON.parse(stored.value);
        this.enabled = settings.enabled;
        this.time = settings.time;
      }
      if (this.enabled) {
        //set the reminder up again when reloading page
        await this.scheduleDaily();
      }
    } catch (error) {
      console.log('Could not load the reminder settings', error);
    }
  }

  private async saveSettings() {
    try {
      await Preferences.set({ key: SETTINGS_KEY, value: JSON.stringify({ enabled: this.enabled, time: this.time }) });
    } catch (error) {
      console.log('Could not save the reminder settings', error);
    }
  }

  // Turning the reminder on and off 

  //returns false if the person did not allow notifications
  async setEnabled(enabled:boolean):Promise<boolean> {
    if (enabled) {
      const allowed = await this.requestPermission();
      if (!allowed) {
        this.enabled = false;
        await this.saveSettings();
        return false;
      }
      this.enabled = true;
      await this.scheduleDaily();
    } else {
      this.enabled = false;
      await this.cancelDaily();
    }
    await this.saveSettings();
    return true;
  }

  //changes the time of the daily reminder
  async setTime(time:string) {
    this.time = time;
    await this.saveSettings();
    if (this.enabled) {
      await this.scheduleDaily();
    }
  }

  //a reminder that shows up in 5 seconds, so the feature is clear for demo video
  async sendTestReminder():Promise<boolean> {
    const allowed = await this.requestPermission();
    if (!allowed) {
      return false;
    }
    await LocalNotifications.schedule({
      notifications: [{
        id: TEST_REMINDER_ID,
        title: 'How sleepy are you?',
        body: 'Take a few seconds to log how you feel.',
        schedule: { at: new Date(Date.now() + 5000) }
      }]
    });
    return true;
  }

  //  Helpers 

  //asks the person to allow notifications (a browser or phone pop up), and returns true if they did
  private async requestPermission():Promise<boolean> {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  }

  private async cancelDaily() {
    try {
      await LocalNotifications.cancel({ notifications: [{ id: DAILY_REMINDER_ID }] });
    } catch (error) {
      //nothing was scheduled yet no cancel
    }
  }

  private async scheduleDaily() {
    await this.cancelDaily();

    const [hourText, minuteText] = this.time.split(':');
    const hour = Number(hourText);
    const minute = Number(minuteText);

    let schedule:Schedule;
    if (Capacitor.getPlatform() === 'web') {
      //a browser cannot repeat reminders by itself, so schedule the next one (it shows while the app is open)
      const next = new Date();
      next.setHours(hour, minute, 0, 0);
      if (next.getTime() <= Date.now()) {
        next.setDate(next.getDate() + 1);
      }
      schedule = { at: next };
    } else {
      //on a phone, this repeats every day at the same time, even when the app is closed
      schedule = { on: { hour: hour, minute: minute }, allowWhileIdle: true };
    }

    await LocalNotifications.schedule({
      notifications: [{
        id: DAILY_REMINDER_ID,
        title: 'How sleepy are you?',
        body: 'Take a few seconds to log how you feel.',
        schedule: schedule
      }]
    });
  }
}