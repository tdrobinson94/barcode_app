import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Background } from '@nativescript/core';
import $ from 'jquery';
import { Barcode, BarcodePicker, ScanSettings, ScanResult, Camera, CameraAccess, CameraSettings } from 'scandit-sdk-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'barcode-app';

  public scanSettings = new ScanSettings({
    enabledSymbologies: [
      Barcode.Symbology.EAN8,
      Barcode.Symbology.EAN13,
      Barcode.Symbology.UPCA,
      Barcode.Symbology.UPCE,
      Barcode.Symbology.CODE128,
      Barcode.Symbology.CODE39,
      Barcode.Symbology.CODE93,
      Barcode.Symbology.INTERLEAVED_2_OF_5,
    ],
    codeDuplicateFilter: 1000,
  });
  showBarcode = false;

  barcode: any;

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  startScanner() {
    this.showBarcode = true;
  }

  stopScanner() {
    this.showBarcode = false;
  }

  onScan(event: ScanResult) {
    const barcode = event.barcodes[0].data;

    console.log(barcode);
    this.barcode = barcode;

    this.showBarcode = false;
  }

}
