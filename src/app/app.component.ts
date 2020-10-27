import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import $ from 'jquery';
import Quagga from 'quagga';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'barcode-app';


  ngOnInit() {
    // this.startScanner();
    $('.barcode_popup, .barcode_popup_wrapper, .restart').hide();
  }

  ngAfterViewInit() {
    
  }

  stopScanner() {
    console.log('detection is off.')
    Quagga.stop()
  }

  startScanner() {
    $('.barcode_popup_wrapper, .restart').show();
    $('.start').hide();
    $('.barcode_popup').hide();
    Quagga.init({
      locate: false,
      inputStream : {
        name : "Live",
        type : "LiveStream",
        area: { // defines rectangle of the detection/localization area
          top: "35%",    // top offset
          right: "20%",  // right offset
          left: "20%",   // left offset
          bottom: "35%"  // bottom offset
        },
        singleChannel: false, // true: only the red color-channel is read
        target: document.querySelector('.barcode_scanner_wrapper')    // Or '#yourElement' (optional)
      },
      decoder : {
        readers : ["code_39_vin_reader"]
      }
    }, function(err) {
        if (err) {
            console.log(err);
            return
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
    });

    Quagga.onDetected(function(data) {
      window.navigator.vibrate(300);
      $('.barcode_popup h1').html("Barcode: " + data.codeResult.code);
      $('.barcode_popup').show();
      console.log(data.codeResult);
      Quagga.offDetected();
      return
    });
  }

}
