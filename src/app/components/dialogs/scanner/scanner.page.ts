import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { DatePipe } from '@angular/common'

import { ScannerService } from 'src/app/services/scanner/scanner.service';
import { PersistenceService } from 'src/app/services/persistence/persistence.service';

import { EntriesModel } from 'src/app/components/models/Entries';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {

  scanMode: number;

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

  ) {
    this.scanMode = 2;
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

  ngOnInit() {
    // this.startContinuousScanning();
  }

  public startScanning() {
    this.showScanner();
    this.showSingleButton = false;
    this.showSingleDoneButton = false;
    this.scanner.delegate = this;
    this.scanner.start();
  }

  public startContinuousScanning() {
    this.continuousMode = true;
    document.getElementById('scanner').style.bottom = "10%";
    this.startScanning();
  }

  public resumeScanning() {
    this.scanner.resume();
    this.showScanner();
    this.showSingleButton = false;
    this.showSingleDoneButton = false;
  }

  public doneSingle() {
    this.hideScanner();
    this.scanner.pause();
    this.barcodes = [];
    document.getElementById('result').innerHTML = "";
    this.showSingleButton = true;
    this.showSingleDoneButton = false;
  }

  public done() {
    this.barcodes = [];
    document.getElementById('result').style.display = "none";
    document.getElementById('result').innerHTML = "";
    this.showSingleButton = true;
    this.showSingleDoneButton = false;
    this.continuousMode = false;
  }

  public didScan(barcodeCapture: BarcodeCapture, session: BarcodeCaptureSession) {
    this.barcodes = session.newlyRecognizedBarcodes;
    this.hideScanner();
    document.getElementById('result').style.display = "block";
    this.scanner.pause();
    this.showSingleDoneButton = true;
    let scannedBarcode = "Scanned Code:<br><br>" + this.barcodes[0].symbology.toUpperCase() + ": " + this.barcodes[0].data;
    document.getElementById('result').innerHTML = scannedBarcode;
    this.addEanToPersistence(this.barcodes[0].data);
  }

  public ionViewDidEnter(): void {
  }

  public showScanner() {
    document.getElementById('scanner').style.display = "block";
    document.getElementById('result').style.display = "none";
    document.getElementById('result').innerHTML = "";
  }

  public hideScanner() {
    document.getElementById('scanner').style.display = "none";
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

  changeScanMode(newMode) {
    this.scanMode = newMode;
  }

}
