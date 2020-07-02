import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatePipe } from '@angular/common';
import { SQLite } from '@ionic-native/sqlite/ngx';

import { ScannerService } from 'src/app/services/scanner/scanner.service';
import { PersistenceService } from 'src/app/services/persistence/persistence.service';

import { SettingsPageModule } from 'src/app/components/dialogs/settings/settings.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    SettingsPageModule
  ],
  providers: [
    SQLite,
    DatePipe,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ScannerService,
    PersistenceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
