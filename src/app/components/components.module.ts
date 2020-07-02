import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { CommonModule } from '@angular/common';

import { ListeansComponent } from 'src/app/components/dialogs/listeans/listeans.component';

@NgModule({
    declarations: [ListeansComponent],
    imports: [IonicModule, CommonModule],
    exports: [ListeansComponent]
})
export class ComponentsModule { }