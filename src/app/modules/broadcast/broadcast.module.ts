import { NgRelaxModule } from './../../ng-relax/ng-relax.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BroadcastRoutingModule } from './broadcast-routing.module';
import { SettingComponent } from './setting/setting.component';
import { CommodityModule } from 'src/app/modules/commodity/commodity.module';

@NgModule({
  imports: [
    CommonModule,
    BroadcastRoutingModule,
    NgRelaxModule,
    CommodityModule
  ],
  declarations: [SettingComponent]
})
export class BroadcastModule { }
