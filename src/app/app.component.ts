import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { BarecodeScannerLivestreamComponent } from 'ngx-barcode-scanner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'barcode-app';


  scannerEnabled = false;

  @ViewChild(BarecodeScannerLivestreamComponent)
  barecodeScanner: BarecodeScannerLivestreamComponent;

  barcodeValue;

  ngAfterViewInit() {
    // this.barecodeScanner.start();
  }

  onValueChanges(result) {
    this.barcodeValue = result.codeResult.code;
  }

  onStarted(started) {
    console.log(started);
  }

  showScanner() {
    this.scannerEnabled = true;
    this.barecodeScanner.start();
  }

  closeScanner() {
    this.scannerEnabled = false;
    this.barecodeScanner.stop();
  }
}
