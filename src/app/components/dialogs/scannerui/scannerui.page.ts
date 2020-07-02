import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { DatePipe } from '@angular/common'

import { ModalController } from '@ionic/angular';
import { SettingsPage } from 'src/app/components/dialogs/settings/settings.page';

import { ScannerService } from 'src/app/services/scanner/scanner.service';
import { PersistenceService } from 'src/app/services/persistence/persistence.service';

import { EntriesModel } from 'src/app/components/models/Entries';

@Component({
  selector: 'app-scannerui',
  templateUrl: './scannerui.page.html',
  styleUrls: ['./scannerui.page.scss'],
})
export class ScanneruiPage implements OnInit {

  scannedBarcode: string;
  scannedSymbology: string;
  delayCounter: number;
  isSoundActived: boolean;

  screenSizeList: any[] = [];

  symbologiesOriginalList: any[] = [];

  private barcodes: Barcode[] = [];
  private continuousMode: boolean = false;
  public showSingleButton: boolean = true;
  public showSingleDoneButton: boolean = false;

  cameraOperationModule: number = 0;
  cameraOperationModuleToShow: string = '';
  cameraOperationType: number = 0;

  constructor(
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    public scanner: ScannerService,
    public persistenceService: PersistenceService,
    public datePipe: DatePipe,
    public modalController: ModalController
  ) {

    this.delayCounter = 0.5;
    this.isSoundActived = true;

    // this.screenSizeList;
    this.symbologiesOriginalList = this.scanner.makeAllSymbologies();

    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.cameraOperationModule) {
        this.cameraOperationModule = JSON.parse(params.cameraOperationModule);
      }
      if (params && params.cameraOperationModuleToShow) {
        this.cameraOperationModuleToShow = JSON.parse(params.cameraOperationModuleToShow);
      }
      if (params && params.cameraOperationType) {
        this.cameraOperationType = JSON.parse(params.cameraOperationType);
      }
    });

  }

  ngOnInit() { }

  public ionViewDidEnter(): void {
    // console.log('Entra tab1 ionViewDidEnter');
    this.startContinuousScanning();
  }
  public ionViewDidLeave(): void {
    // console.log('Sale tab1 ionViewDidLeave');
  }

  public startContinuousScanning() {
    this.continuousMode = true;
    document.getElementById('scanner').style.bottom = "10%";
    document.getElementById('scanner').style.display = "block";
    this.scanner.delegate = this;
    this.scanner.start();
  }

  public didScan(barcodeCapture: BarcodeCapture, session: BarcodeCaptureSession) {
    this.barcodes = session.newlyRecognizedBarcodes;
    this.scannedSymbology = this.barcodes[0].symbology.toUpperCase();
    this.scannedBarcode = this.barcodes[0].data;

    this.addEanToPersistence(this.barcodes[0].data);
    this.scanner.pause();
    setTimeout(() => {
      this.barcodes = [];
      this.scanner.resume();
    }, this.delayCounter * 1000);
  }

  public addEanToPersistence(eanToAdd) {
    console.log('Adding Ean : ', eanToAdd);
    let entriesModel: EntriesModel = new EntriesModel();
    entriesModel.ean = eanToAdd;
    entriesModel.isSelected = true;
    entriesModel.timeScan = this.datePipe.transform(new Date(), "dd/MM HH:mm") + 'h';
    this.persistenceService.addEntries(entriesModel);
  }

  /**
  * Método utilizado para regresar la navegación al dashboard
  *
  * @returns void
  */
  goTo_BackPage() {
    this.navCtrl.pop();
    this.navCtrl.navigateRoot(['/tabs/' + this.cameraOperationModuleToShow]);
  }

  /**
  * Método utilizado para cambiar el modo del sonido
  *
  * @returns void
  */
  changeSoundMode() {
    this.isSoundActived = !this.isSoundActived;
    this.scanner.setScanArea();
  }

  /**
  * Método utilizado para invocar pantalla de settings
  *
  * @returns void
  */
  async makeSettings() {
    document.getElementById('scanner').style.display = "none";
    const modal = await this.modalController.create({
      component: SettingsPage,
      cssClass: 'settings-modal-css',
      componentProps: {
        screenSizeList: [],
        symbologiesOriginalList: this.symbologiesOriginalList,
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      console.log('dataReturned', dataReturned);
      document.getElementById('scanner').style.display = "block";
      if (dataReturned.data !== null) {
        // this.scanner.setAllSymbologies([Scandit.Symbology.QR]);
        this.scanner.setAllSymbologies(dataReturned.data.symbologiesOriginalList);
      }
    });

    return await modal.present();
  }

}
