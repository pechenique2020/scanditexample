import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'scannerui',
    loadChildren: () => import('./components/dialogs/scannerui/scannerui.module').then( m => m.ScanneruiPageModule)
  },
  {
    path: 'scanner',
    loadChildren: () => import('./components/dialogs/scanner/scanner.module').then( m => m.ScannerPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./components/dialogs/settings/settings.module').then( m => m.SettingsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
