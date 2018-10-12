import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpService } from './../../../ng-relax/services/http.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from 'src/app/ng-relax/components/table/table.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  queryNode = [
    {
      label       : '是否推荐',
      key         : 'isRecomment',
      type        : 'select',
      options     : [ { name: '推荐', id: 1 }, { name: '不推荐', id: 0 } ]
    }
  ];

  formGroup: FormGroup;
  
  tableNode = ['商品名称', '推荐', '原价', '活动价', '操作'];

  @ViewChild('EaTable') table: TableComponent

  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      id: [],
      productName: [, [Validators.required]],
      productImg: [, [Validators.required]],
      url: [, [Validators.required]],
      originalPrice: [, [Validators.required]],
      activityPrice: [, [Validators.required]]
    })
  }

  ngOnInit() {
  }

  recommend(id, isRecomment) {
    this.http.post('/extract/updateRecommentProductStatus', { paramJson: JSON.stringify({ id, isRecomment }) }).then(res => this.table._request());
  }

  showModal: boolean;
  add() {
    this.showModal = true;
    this.formGroup.reset();
  }
  update(data) {
    this.showModal = true;
    this.formGroup.patchValue(data);
  }

  saveLoading: boolean;
  save() {
    if (this.formGroup.invalid) {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    } else {
      this.saveLoading = true;
      let url = this.formGroup.get('id') ? '/extract/editRecommentProductSave' : '/extract/saveRecommentProductList';
      this.http.post(url, { paramJson: JSON.stringify(this.formGroup.value) }).then(res => {
        this.saveLoading = false;
        this.showModal = false;
        this.table._request();
      })
    }
  }


}
