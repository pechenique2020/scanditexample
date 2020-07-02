import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {



  screenSizeList: any[] = [];

  symbologiesOriginalList: any[] = [];

  constructor(
    private modalController: ModalController,
    private navParams: NavParams
  ) {
    console.table(this.navParams);
    this.screenSizeList = this.navParams.data.screenSizeList;
    this.symbologiesOriginalList = this.navParams.data.symbologiesOriginalList;
  }

  ngOnInit() {
  }

  getSymbologyStatus() {
    let status: boolean = false;
    for (let symbologiesRecord of this.symbologiesOriginalList) {
      if (symbologiesRecord.isChecked) {
        status = true;
      }
    }
    return status;
  }

  async closeModal() {
    if (this.getSymbologyStatus()) {
      let resultObj = {
        screenSizeList: this.screenSizeList,
        symbologiesOriginalList : this.symbologiesOriginalList
      }
      await this.modalController.dismiss(resultObj);
    } else {

    }
  }

}
