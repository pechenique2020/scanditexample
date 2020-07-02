import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScanneruiPage } from './scannerui.page';

const routes: Routes = [
  {
    path: '',
    component: ScanneruiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanneruiPageRoutingModule {}
