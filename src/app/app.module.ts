import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BarecodeScannerLivestreamModule } from 'ngx-barcode-scanner';
import { ScanditSdkModule } from 'scandit-sdk-angular';
const licenseKey = 'AXIPAj3XItVcF/z9VUI+xcJFsp3sJYwZPnFKCUFJfVrtbPib8nJuc0YeKuaDVfg5+HdbalhQXSz2XjXND3J6EjI3z46nPYXjBFO+lcpWrCrdUFCi105t7cpe+8Sbece8qkzh27JVMr7wR/EzGg/fntFw0nwOUgcmxWo1hEsCC/NIJLgZwUNBnBAHHeW89anWOwnbKbU0Sjeqk4aQ25yxUot3NSAdPhkaXvYMuLP7fTqusEt9OojWTTupc65UGW8fC438CzcKG0yoeHAQlPI9m0pKAMuoEsNZ4pL7q0VHmIlUgr0KH6P6/VTkrkaoQxD8in0hJjuz0KV+cHvYbZoY5oF/o0niR64V/8r5oF5/85RwzmIXZsd/yMzVrX75A8Hf3qBZjfip0FuxQS/3i4L3ec7nqAE2/pJeYYlBg077UTz23+NVmj58fPhVhccUIWiK1FWKVd5dnqVoGHQatoRBlO3Ha3bPndm2DnkrDzcD0IbLSJUPst29HhWLDtQQzmlRpwHgl3mxKXDQ2+PXA+uMbpAdktvGR/smCVeEC5owD3AZaKkoO8L5wG06Mx+pajJFSF5uz5bRogEs5Rd02IhlAyx/4BwBe2ZwQjoP9iGFlfjXLAuGG3vHnUMK8MaVJcpBN+F+9x3tl74UA8uvFwE2dVNJs62c8naN928z7JJwdNzHYh0grr4EavRqYfNcmyQMIe+ERpadKvqzTFW7qRx/TFipIkS78GXy8hGZUZOqVrOH7JPQA2xd2d0kVKevzyEtkok5zDYBpY5G2Ks2bZSpxWOCy9BFuw++dP+TyOSHKG2eC9/AlFRVC9m3t3TJwDNLTdJ17vpbZZEUNe7+h67FCtyaHlOstGVKHVQ=';
// const licenseKey = 'ASIPCxPXDAVJGQn1KgvRXU1DDRo3BUe3SV0N0RN8/wE3QAJc5mZ6AXVXuR2hQTdKHk50qk0g8VL5aAhGjGykjWdXNbjCKEXCyF6hZDdYPdE8A3zRbDksmIk4Sc/LKbYHvks1Q2e4VD28BHnv/KriPvk6lS3TphHfa83a/pChdYyvmk+j7YBdJAAYVqSfWtOFX4/BnFZFHujOt+70UE0Fi59wxd4XMy40DYx5I65f8s+dmJ38X1Gd+t6DerJlZIGWV4SWOR2bJDvnKJlwHCEqLWDsaRByVNzjxM5x9fROvbKlGxv3RtxyEUDVjy4SiBmw28pxp36b4yT7pL/2YMRZGftAi7aEA4DFHp4j8yk08KHzdZGNUEa07oandCrtZ3FNSd37PPnhd4zuTO8Go3AD8KcfQFYJYhMikvhzLKbJ7IezLtlnX7ZVKAf5mBJ7RdOaQFWoDtXxWMIE+WHr53MAAqBgf9s1NVrXD8IIar/b+u0+W8sYX+iNYvaY1MpLJ6kPowwhk5NAy16+6zsQNiWpcwo8dagE3VYQEQihKSnsEB9bvsEyGVeqrAKqJvZA9SEu54FseL0Rk9qaqOdYH+b/e/O5NZHbZlUnrFSh/mNJ5iZRS6IN7oZGqQZNOx73A+MDZhgUtjYiihlO3T7W/YrJ0/MT6/Mg+nsUDhzsosTF16KU882auOe4e++xkSLsP4hiqlvy7YDlkoBcmkUAU8qpxGqozziya6om9lYNN2GgnT98qgDcqKsqCuyrfnIXKQwk3I9glajk7kIXYI0TdynDnwLTluyjSlxwZYbbdqOo';
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
