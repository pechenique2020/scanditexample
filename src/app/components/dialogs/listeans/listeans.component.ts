import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DatePipe } from '@angular/common'

import { PersistenceService } from 'src/app/services/persistence/persistence.service';
import { EntriesModel } from 'src/app/components/models/Entries';

@Component({
  selector: 'app-listeans',
  templateUrl: './listeans.component.html',
  styleUrls: ['./listeans.component.scss'],
})
export class ListeansComponent implements OnInit {

  entriesList: EntriesModel[] = [];

  constructor(
    public persistenceService: PersistenceService,
    public alertController: AlertController,
    public datePipe: DatePipe,
  ) { }


  public ngOnInit(): void {
    // console.log('Entra tab ionViewDidEnter');
    this.persistenceService.fetchEntries()
      .subscribe((entriesListEans) => {
        this.entriesList = entriesListEans;
      }).unsubscribe();
  }

  /**
  * Método utilizado para reducir un EAN en la persistencia
  *
  * @returns void
  */
  reduceListEansInPersistence(entriesRecord: EntriesModel) {
    this.persistenceService.reduceEntries(entriesRecord.id)
  }

  /**
  * Método utilizado para eliminar múltiples EANs a la persistencia
  *
  * @returns void
  */
  delEntriesIntoDB(entriesRecord: EntriesModel) {
    this.persistenceService.deleteMultiEntries([entriesRecord]);
    this.ngOnInit();
  }

  /**
  * Método utilizado para confirmar la eliminación del grupo de Eans
  *
  * @returns void
  */
  async presentConfirm(entriesRecord: EntriesModel) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Atención',
      subHeader: '',
      message: 'Deesea confirmar la eliminación del grupo de Ean ' + entriesRecord.ean + '(' + entriesRecord.listEans.length + ')',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.delEntriesIntoDB(entriesRecord);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

}
