import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BarecodeScannerLivestreamModule } from 'ngx-barcode-scanner';
import { ScanditSdkModule } from 'scandit-sdk-angular';
const licenseKey = 'AXIPAj3XItVcF/z9VUI+xcJFsp3sJYwZPnFKCUFJfVrtbPib8nJuc0YeKuaDVfg5+HdbalhQXSz2XjXND3J6EjI3z46nPYXjBFO+lcpWrCrdUFCi105t7cpe+8Sbece8qkzh27JVMr7wR/EzGg/fntFw0nwOUgcmxWo1hEsCC/NIJLgZwUNBnBAHHeW89anWOwnbKbU0Sjeqk4aQ25yxUot3NSAdPhkaXvYMuLP7fTqusEt9OojWTTupc65UGW8fC438CzcKG0yoeHAQlPI9m0pKAMuoEsNZ4pL7q0VHmIlUgr0KH6P6/VTkrkaoQxD8in0hJjuz0KV+cHvYbZoY5oF/o0niR64V/8r5oF5/85RwzmIXZsd/yMzVrX75A8Hf3qBZjfip0FuxQS/3i4L3ec7nqAE2/pJeYYlBg077UTz23+NVmj58fPhVhccUIWiK1FWKVd5dnqVoGHQatoRBlO3Ha3bPndm2DnkrDzcD0IbLSJUPst29HhWLDtQQzmlRpwHgl3mxKXDQ2+PXA+uMbpAdktvGR/smCVeEC5owD3AZaKkoO8L5wG06Mx+pajJFSF5uz5bRogEs5Rd02IhlAyx/4BwBe2ZwQjoP9iGFlfjXLAuGG3vHnUMK8MaVJcpBN+F+9x3tl74UA8uvFwE2dVNJs62c8naN928z7JJwdNzHYh0grr4EavRqYfNcmyQMIe+ERpadKvqzTFW7qRx/TFipIkS78GXy8hGZUZOqVrOH7JPQA2xd2d0kVKevzyEtkok5zDYBpY5G2Ks2bZSpxWOCy9BFuw++dP+TyOSHKG2eC9/AlFRVC9m3t3TJwDNLTdJ17vpbZZEUNe7+h67FCtyaHlOstGVKHVQ=';
const engineLocation = 'https://cdn.jsdelivr.net/npm/scandit-sdk/build';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BarecodeScannerLivestreamModule,
    ScanditSdkModule.forRoot(licenseKey, { engineLocation, preloadEngine: true, preloadBlurryRecognition: true }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
