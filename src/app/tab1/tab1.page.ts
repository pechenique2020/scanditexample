import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";

import { DatePipe } from '@angular/common'

import { PersistenceService } from 'src/app/services/persistence/persistence.service';
import { EntriesModel } from 'src/app/components/models/Entries';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  isListEmptied: boolean = false;
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

    this.persistenceService.fetchEntries()
      .subscribe((entriesListEans) => {
        this.entriesList = entriesListEans;
        if ((entriesListEans.length==0) && (this.isListEmptied==false)){
          this.isListEmptied=true;
          this.goTo_Scanner(1,1);
        }
      }).unsubscribe();
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
        cameraOperationModuleToShow: 'tab1',
        cameraOperationType: cameraOperationType,
      }
    };
    this.navCtrl.navigateRoot(['/scannerui', navigationExtras]);
    // this.navCtrl.navigateRoot(['/scanner', navigationExtras]);

  }

}
