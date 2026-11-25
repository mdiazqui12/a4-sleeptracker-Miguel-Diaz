import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonItem, IonItemSliding, IonItemOptions, IonItemOption, AlertController, IonNote, IonLabel, IonIcon
} from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { addIcons } from 'ionicons';
import { moon } from 'ionicons/icons';


@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonNote, IonIcon],
})
export class HistoryPage {
  constructor(
    private sleepService:SleepService,
    private alertController:AlertController
  ) {
    addIcons({ moon });
  }

  //newest logs first
  get overnightLogs() {
    return this.sleepService.getOvernightNewestFirst();
  }

  get sleepinessLogs() {
    return this.sleepService.getSleepinessNewestFirst();
  }

  //question before deleting
    async confirmDeleteOvernight(night:OvernightSleepData, sliding:IonItemSliding){
        await sliding.close();
        await this.askToDelete(
            'Delete the sleep from ' + night.dateString() + '?',
            () => this.sleepService.deleteOvernightData(night.id)
        );
    }

    //question before deleting 
    async confirmDeleteSleepiness(entry:StanfordSleepinessData, sliding:IonItemSliding) {
        await sliding.close();
        await this.askToDelete(
            'Delete the sleepiness log from ' + entry.dateString() + ' at ' + entry.timeString() + '?',
            () => this.sleepService.deleteSleepinessData(entry.id)
        );
    }

  //the confiramtion pop up before deletion aka safety net
    private async askToDelete(message:string, onConfirm:() => void) {
        const alert = await this.alertController.create({
            header: 'Delete this log?',
            message: message,
            buttons: [
                { text: 'Cancel', role: 'cancel' },
                { text: 'Delete', role: 'destructive', handler: onConfirm }
            ]
        });
        await alert.present();
    }
}




