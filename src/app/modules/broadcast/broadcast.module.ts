import { NgRelaxModule } from './../../ng-relax/ng-relax.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BroadcastRoutingModule } from './broadcast-routing.module';
import { SettingComponent } from './setting/setting.component';

@NgModule({
  imports: [
    CommonModule,
    BroadcastRoutingModule,
    NgRelaxModule
  ],
  declarations: [SettingComponent]
})
export class BroadcastModule { }
