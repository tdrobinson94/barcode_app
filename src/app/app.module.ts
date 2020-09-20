import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarecodeScannerLivestreamModule } from 'ngx-barcode-scanner';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ZXingScannerModule,
    BarecodeScannerLivestreamModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
