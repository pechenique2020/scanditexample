import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";

import { DatePipe } from '@angular/common'

import { PersistenceService } from 'src/app/services/persistence/persistence.service';
import { EntriesModel } from 'src/app/components/models/Entries';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  entriesList: EntriesModel[] = [];

  constructor(
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    public persistenceService: PersistenceService,
    public datePipe: DatePipe,
  ) { }

  public ionViewDidEnter(): void {
    this.activatedRoute.queryParams.subscribe(params => {
    });
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
        cameraOperationModuleToShow: 'tab3',
        cameraOperationType: cameraOperationType,
      }
    };
    // this.navCtrl.navigateRoot(['/scannerui', navigationExtras]);
    // this.navCtrl.navigateRoot(['/scanner', navigationExtras]);

  }

}
