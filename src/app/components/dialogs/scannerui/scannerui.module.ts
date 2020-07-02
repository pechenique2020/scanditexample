import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanneruiPageRoutingModule } from './scannerui-routing.module';

import { ScanneruiPage } from './scannerui.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScanneruiPageRoutingModule
  ],
  declarations: [ScanneruiPage]
})
export class ScanneruiPageModule {}
