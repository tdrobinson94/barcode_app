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
    this.startScanner();
  }

  ngAfterViewInit() {
    
  }

  stopScanner() {
    console.log('detection is off.')
    Quagga.stop()
  }

  startScanner() {
    $('.barcode_popup').hide();
    Quagga.init({
      inputStream : {
        name : "Live",
        type : "LiveStream",
        target: document.querySelector('.barcode_scanner_wrapper')    // Or '#yourElement' (optional)
      },
      decoder : {
        readers : ["upc_reader"]
      },
      locate: true
    }, function(err) {
        if (err) {
            console.log(err);
            return
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
    });

    Quagga.onDetected(function(data) {
      $('.barcode_popup h1').html("Barcode: " + data.codeResult.code);
      $('.barcode_popup').show();
      console.log(data.codeResult);
      Quagga.offDetected();
      return
    });
  }

}
