import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
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
    Quagga.stop();
  }

  startScanner() {
    Quagga.init({
      inputStream : {
        name : "Live",
        type : "LiveStream",
        target: document.querySelector('.barcode_scanner_wrapper')    // Or '#yourElement' (optional)
      },
      decoder : {
        readers : ["code_128_reader"]
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
  }

}
