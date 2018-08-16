import { QuillModule } from 'ngx-quill'
import { NgRelaxModule } from './../../ng-relax/ng-relax.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommodityRoutingModule } from './commodity-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { EditorComponent } from './detail/editor/editor.component';
import { UploadPictureComponent } from './detail/upload-picture/upload-picture.component';
import { UpdateComponent } from './update/update.component';

@NgModule({
  imports: [
    CommonModule,
    CommodityRoutingModule,
    NgRelaxModule,
    QuillModule
  ],
  declarations: [ListComponent, DetailComponent, EditorComponent, UploadPictureComponent, UpdateComponent]
})
export class CommodityModule { }
