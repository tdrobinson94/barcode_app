import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarecodeScannerLivestreamModule } from 'ngx-barcode-scanner';
import { ScanditSdkModule } from 'scandit-sdk-angular';
const licenseKey = 'Ae7PNFvXRA5qG6oYuAXzesYGJpDLDqt++X1dGY9sg/iPUDpBN0ELXhdW6/8BXCZtF2Rk5L88IaQeDFeE40Y1JxlSig1fQfglmS2Gn459G3cOGQSpSnTTon5Le/RRafubQ0DkSkRHNY9yUP/ONC3d2z14CbICXpcnMlSKMeBsM/orVJgRJEgXpB5LTDuMRj6Evny5vcwuo4BLQQp0c1KP1RpLt7v4cZzO3lWpErtQmd+JRRXNgF10qX10DS9bUI75fX3DQKlKTLPiYm77dTTndLdXQIfvaRAa1ndp62NGFC6HRk3gJHC5YjhJ9rX2ZHZnKVsLVIhtivTEa8jhJ0gaditwvYR/axT8a1ITz3p3zZkgS4DwrC3SolxJvUYGHl3AuHfyzhtdp3MNYCDwSEqcBhpE7Y1mRZ8lrF5aHqRCV2lmc5NPZmB86zNrh4HEQClb2W7/Rg9/RGi9JFRDSHs+gyx9MEuQDC1+JUfhwwVtDw8FU/jiBHQg7gB/kLKbRl4lgj3yMVwD/Mq3DXZkwDfwc15tNPRZMyD66D2gKkDWJsYcyIzFL9SfAH5APjW1HGOaF3pTn9IKpkGTPsT3rzJzTMkH3a50zoQwjeiNHxL5/+MzpvOVICQCDNiD55L3S3T+qv5BPZDDclqS+k+eLGCevdkQD7J0c5OcS2smEpibNhZlSQy7SryExViLyPnbrpDXIkvBf/F3h+TcK+U3Hvl0r0cRdSIPzFhYeddnS4x0ppuJyJzq3ockRllO2KBwW5umlsUKc7yGKg9ps9anO06KXXTbBnHQC89GYASxbwF5zwvyGxP93uo4Dx4TroVs2FGUhgSWGgqkLRyrvSUILpuj4iPySDC/wXyjuQyUsffMXFBdNgTNzJO4wqP9CE9ZFqeFtDeT+UsSf+u527cA6c/L/TSqDHoT/sIw0udJYEys9yc13CYjnuDzs+GbQqskLi7e9oG/PsSxPmxfZAt7Sll03FffS8gp6bEBzC88Zli+F0VyoHNeV0/vRftat103h0OF8QgqLz89QBh593alksNsPVIu4gSRL9/BwemcVMwXA+FoWVnCfzIpMYo8lzhvDAd1xEGU8kgo+nVgK6UYxzTAWuPJc9ZbWDGq2dXs0p8N+a5Dl3nTkIP9jVabcp5wwPNo0h8SfRDs6K9t4obh5dIb43ucCD5f/21BNGy0rgd04xNqVL551mAGdJLZaItQnjg=';
const engineLocation = 'assets/';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ZXingScannerModule,
    BarecodeScannerLivestreamModule,
    ScanditSdkModule.forRoot(licenseKey, { engineLocation, preloadEngine: true, preloadBlurryRecognition: true }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
