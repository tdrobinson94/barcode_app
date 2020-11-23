import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarecodeScannerLivestreamModule } from 'ngx-barcode-scanner';
import { ScanditSdkModule } from 'scandit-sdk-angular';
const licenseKey = 'ASIPCxPXDAVJGQn1KgvRXU1DDRo3BUe3SV0N0RN8/wE3QAJc5mZ6AXVXuR2hQTdKHk50qk0g8VL5aAhGjGykjWdXNbjCKEXCyF6hZDdYPdE8A3zRbDksmIk4Sc/LKbYHvks1Q2e4VD28BHnv/KriPvk6lS3TphHfa83a/pChdYyvmk+j7YBdJAAYVqSfWtOFX4/BnFZFHujOt+70UE0Fi59wxd4XMy40DYx5I65f8s+dmJ38X1Gd+t6DerJlZIGWV4SWOR2bJDvnKJlwHCEqLWDsaRByVNzjxM5x9fROvbKlGxv3RtxyEUDVjy4SiBmw28pxp36b4yT7pL/2YMRZGftAi7aEA4DFHp4j8yk08KHzdZGNUEa07oandCrtZ3FNSd37PPnhd4zuTO8Go3AD8KcfQFYJYhMikvhzLKbJ7IezLtlnX7ZVKAf5mBJ7RdOaQFWoDtXxWMIE+WHr53MAAqBgf9s1NVrXD8IIar/b+u0+W8sYX+iNYvaY1MpLJ6kPowwhk5NAy16+6zsQNiWpcwo8dagE3VYQEQihKSnsEB9bvsEyGVeqrAKqJvZA9SEu54FseL0Rk9qaqOdYH+b/e/O5NZHbZlUnrFSh/mNJ5iZRS6IN7oZGqQZNOx73A+MDZhgUtjYiihlO3T7W/YrJ0/MT6/Mg+nsUDhzsosTF16KU882auOe4e++xkSLsP4hiqlvy7YDlkoBcmkUAU8qpxGqozziya6om9lYNN2GgnT98qgDcqKsqCuyrfnIXKQwk3I9glajk7kIXYI0TdynDnwLTluyjSlxwZYbbdqOo';
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
