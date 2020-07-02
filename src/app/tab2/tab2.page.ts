import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";

import { DatePipe } from '@angular/common'

import { PersistenceService } from 'src/app/services/persistence/persistence.service';
import { EntriesModel } from 'src/app/components/models/Entries';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  entriesList: EntriesModel[] = [];

  constructor(
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    public persistenceService: PersistenceService,
    public datePipe: DatePipe,
  ) { }

  public ionViewDidEnter(): void {
  }

  /**
  * Método utilizado para activar el componente del escaner
  *
  * @returns void
  */
  goTo_Scanner(cameraOperationModule, cameraOperationType) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        cameraOperationModule: cameraOperationModule,
        cameraOperationModuleToShow: 'tab2',
        cameraOperationType: cameraOperationType,
      }
    };
    // this.navCtrl.navigateRoot(['/scannerui', navigationExtras]);
    this.navCtrl.navigateRoot(['/scanner', navigationExtras]);

  }


}
