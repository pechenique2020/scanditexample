import { Injectable, NgZone } from '@angular/core';

// import { DataCaptureView } from 'plugins/scandit-cordova-datacapture-core/www/ts/src/DataCaptureView';
// import { Size, Orientation } from 'plugins/scandit-cordova-datacapture-core/www/ts/src/Common';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  public contentHeight;
  public delegate: ScannerDelegate;

  public dataCaptureView;

  public barcodeCapture;
  public session;
  private context;
  private camera;
  private settings;
  private view;
  private overlay;

  window1: any;

  constructor(private zone: NgZone, ) {

    this.window1 = window;
    console.log('windows', this.window1);
    console.log('Scandit', Scandit);

    this.context = Scandit.DataCaptureContext.forLicenseKey('AXUeijweI5/8CuynMyLcax8ub58lCtU2o0IYwltnYr7kT3B5YkyOPhtT7MrBJCmzs2WrLEUAnbiiYXAYUydQSYNOUb2vQmgJtx1oAxh1jewRRhuH7VgE4BhAzWpneM0tZWqi2LRSRUFhb8zmh2T+wJFiNZ8UQ8G04Cu4+ItOOI4raEhQRl81YIB5Uipjc7FEp3AwnnBibyjqOav0S3jHU7Zm27yLUu/mvVZaH55LTD79RNE+ZHuQmOBxcOD4LL2H/UlTh0or7yA/LqNvsW/T4PZpwXAWSXlUEkz9xxxoKwjQTkpl10g6jURnOkgwJfDmFmJUchZJBKwpYIU6XVUwKlBKhvHoe3OJgkrKxZMUFLPOSf6D4VL/pXAv4Y3fHyQXjUFXQiBx7MQFQBiIsmxGaihQHxDlY3w6NkGQrm5JPWQxWWQ23GOWASVxsce8f9Hev35ZHCRdD0M5DOD393FhKgZKamCZXgQWvk6KB2FI+8+1fqiZnUe53ndvtwUKQz9fyxzrtIEg8euwMQHTkhBJ0hsgjHJBXd8cAEODnauJN5/MzjUhqBepWCq9kWqP9DbaGINrN1GrtxSW4aJovlNSWS9oDUkjon7S/kekN+F54Ydx4gNx7bjXGkxGUfio/ASKH/y3wyrJd8+SdTuSnseGSMSFfjQWmYKId5/O5fqEnN1URil+S0Zj+PSK4K9dldc3wzY1AOUgQFMowQfjIbc1IqbH2kPG0VWeX1z/lsc9ScqbnvsfmWSE+lViLE6G1cRAc38AwJnqecKFpAdHT5a/B08s7Jo+mX05CbM0BfhBgLGxaLJvTZVCaCJ/7QvGwlnqVH3J/UC9NV5481pAHFpWD9MD7lVe8ye8NOqQLfxEJ1QwhyfphUhF4sUhuxgrFouj7fzBASuT3SkxymjJ8sJt1RsvYKyM3Xedw3rcYEFWnC6A8sgcdEoqnrTsxErCnai0SumKd9AsbVAh5eb/Q0X1LwlPNoE3+0BNCf3MgtTmXuSAIypBGOTzkSjwWkOkgaeQzEEy2CvIICukn1ZgG71/A9evyPyoyiKFt9+aMFKNN+MZDXaFN6FW+EHo0/61Qxc4lPcOdK6V06BDXwV4tvqRa/io/54AUtod+xBANxsTrTOmhH4TytKbDKiY7gz0QXZgqWrfDbW/fiFkPP20uTPjcGgI3ETFWLiX0Rux1jw2A/jhUHOUB3xLVAH+9ec=');
    this.camera = Scandit.Camera.default;
    this.context.setFrameSource(this.camera);
    this.initScanner(this.getAllSymbologies(), 0);
  }


  public initScanner(symbologies: any[], allowDuplicate: number) {

    this.settings = new Scandit.BarcodeCaptureSettings();

    this.settings.enableSymbologies(
      symbologies
    );
    this.settings.codeDuplicateFilter = allowDuplicate;
    this.barcodeCapture = Scandit.BarcodeCapture.forContext(this.context, this.settings);
    this.barcodeCapture.applySettings(this.settings)
    this.barcodeCapture.addListener({
      didScan: (barcodeCapture, session) => {
        if (this.delegate) {
          this.zone.run(() => {
            this.delegate.didScan(barcodeCapture, session);
          })
        }
      },
    });

    console.log('ScanDIT',Scandit);

  }

  public start(): void {
    this.view = Scandit.DataCaptureView.forContext(this.context);
    this.view.connectToElement(document.getElementById('scanner'));
    this.overlay = Scandit.BarcodeCaptureOverlay.withBarcodeCaptureForView(this.barcodeCapture, this.view);
    this.overlay.viewfinder = new Scandit.RectangularViewfinder();
    this.camera.switchToDesiredState(Scandit.FrameSourceState.On);
    this.barcodeCapture.isEnabled = true;
  }

  public resume(): void {
    this.barcodeCapture.isEnabled = true;
  }
  public pause(): void {
    this.barcodeCapture.isEnabled = false;
  }

  makeAllSymbologies(): any[] {
    let symbologies =
      [
        { id: 0, key: 'EAN13UPCA', value: Scandit.Symbology.EAN13UPCA, isChecked: true },
        { id: 1, key: 'EAN8', value: Scandit.Symbology.EAN8, isChecked: true },
        { id: 2, key: 'UPCE', value: Scandit.Symbology.UPCE, isChecked: true },
        { id: 3, key: 'QR', value: Scandit.Symbology.QR, isChecked: true },
        { id: 4, key: 'DataMatrix', value: Scandit.Symbology.DataMatrix, isChecked: true },
        { id: 5, key: 'Code39', value: Scandit.Symbology.Code39, isChecked: true },
        { id: 6, key: 'Code128', value: Scandit.Symbology.Code128, isChecked: true },
        { id: 7, key: 'InterleavedTwoOfFive', value: Scandit.Symbology.InterleavedTwoOfFive, isChecked: true },
      ];
    return symbologies
  }

  getAllSymbologies(): any[] {
    let symbologies =
      [
        Scandit.Symbology.EAN13UPCA,
        Scandit.Symbology.EAN8,
        Scandit.Symbology.UPCE,
        Scandit.Symbology.QR,
        Scandit.Symbology.DataMatrix,
        Scandit.Symbology.Code39,
        Scandit.Symbology.Code128,
        Scandit.Symbology.InterleavedTwoOfFive,
      ];
    return symbologies
  }

  setAllSymbologies(symbologiesOriginalList: any[]) {
    let symabologiesToReplace: any[] = [];
    for (let symbologyRecord of symbologiesOriginalList) {
      if (symbologyRecord.isChecked) {
        symabologiesToReplace.push(symbologyRecord.value);
      }
    }
    console.log('symabologiesToReplace', symabologiesToReplace);
    this.initScanner(symabologiesToReplace, 0);
  }

  setScanArea(){
  
    // const view  = new Scandit.MarginsWithUnit(
    //   new Scandit.NumberWithUnit(50, Scandit.MeasureUnit.DIP),
    //   new Scandit.NumberWithUnit(50, Scandit.MeasureUnit.DIP),
    //   new Scandit.NumberWithUnit(50, Scandit.MeasureUnit.DIP),
    //   new Scandit.NumberWithUnit(50, Scandit.MeasureUnit.DIP)
    // );

    // this.dataCaptureView = Scandit.DataCaptureView.forContext(this.context, this.settings);
    // this.dataCaptureView.scanAreaMargins = view;

  }

}

