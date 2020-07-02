import { Component } from '@angular/core';
import { DatePipe } from '@angular/common'

import { PersistenceService } from 'src/app/services/persistence/persistence.service';
import { EntriesModel } from 'src/app/components/models/Entries';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  activeTab: number = 0;
  entriesList: EntriesModel[] = [];

  constructor(
    public persistenceService: PersistenceService,
    public datePipe: DatePipe,
  ) {
    this.activeTab = 1;
  }


  public ionViewDidEnter(): void {

    // console.log('Entra tab ionViewDidEnter');

    // this.persistenceService.fetchEntries()
    //   .subscribe((entriesListEans) => {
    //     console.log('entriesListEans-persis', entriesListEans);
    //     this.entriesList = entriesListEans;
    //   });

    // this.persistenceService.emptyEntries();
    // this.loadData();

  }
  public ionViewDidLeave(): void {
    // console.log('Sale tab ionViewDidLeave');
  }

  loadData() {
    for (let i = 2; i < 3; i++) {
      let eantemp = 1000000000000 + i;
      this.addEanToPersistence(eantemp.toString(), i + 1)
    }
  }

  public addEanToPersistence(eanToAdd, times) {
    let listEan: EntriesModel[] = [];
    for (let j = 0; j < times; j++) {
      console.log('Adding Ean : ', eanToAdd);
      let entriesModel: EntriesModel = new EntriesModel();
      entriesModel.ean = eanToAdd;
      entriesModel.isSelected = true;
      entriesModel.timeScan = this.datePipe.transform(new Date(), "dd/MM HH:mm") + 'h';
      console.log('entriesModel', entriesModel);
      listEan.push(entriesModel);
    }
    this.persistenceService.addMultiEntries(listEan);
  }

  changeTab(newTab) {
    this.activeTab = newTab;
  }

}
