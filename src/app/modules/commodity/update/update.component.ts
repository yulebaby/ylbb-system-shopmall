import { HttpService } from './../../../ng-relax/services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  private _commodityId: number;
  @Input() 
  set commodityId(id) {
    console.log('接受到Id', id)
    this.getDetail(id);
    this._commodityId = id;
  }

  @Output()
  showDetailChange: EventEmitter<boolean> = new EventEmitter();

  commodityGroup: FormGroup;

  dataSet: any[] = [];

  editorContent: string;

  loading: boolean;

  constructor(
    private fb: FormBuilder = new FormBuilder(),
    private http: HttpService
  ) { 
    this.commodityGroup = this.fb.group({
      name                : [, [Validators.required]],              // 商品名称
      productIntroduction : [, [Validators.required]],              // 商品简介
      productNum          : [{value: null, disabled: true}, [Validators.required]],              // 商品编号
      brandId             : [, [Validators.required]],              // 品牌 Id
      categoryId          : [{value: null, disabled: true}, [Validators.required]],              // 类型 Id
      originId            : [, [Validators.required]],              // 产地 Id
      price               : [, [Validators.required]],              // 商品原价
      activityPrice       : [],                                     // 活动价
      freight             : [, [Validators.required]],              // 运费
      coverPic            : [, [Validators.required]],              // 封面图
      carouselPic         : [, [Validators.required]],              // 轮播图
      productDesc         : [],              // 商品详情
    });
  }

  listShopBrand: any[] = [];
  listShopCategory: any[] = [];
  listShopOrigin: any[] = [];

  ngOnInit() {
    this.http.post('/brand/listShopBrand', {}, false).then(res => this.listShopBrand = res.result);
    this.http.post('/category/listShopCategory', {}, false).then(res => this.listShopCategory = res.result);
    this.http.post('/origin/listShopOrigin', {}, false).then(res => this.listShopOrigin = res.result);
  }

  getDetail(id) {
    // this.loading = true;
  }

  submit() {
    for (const i in this.commodityGroup.controls) {
      this.commodityGroup.controls[i].markAsDirty();
      this.commodityGroup.controls[i].updateValueAndValidity();
    }
    if (this.commodityGroup.valid) {

    }
  }

  cancelEdit() {
    this.showDetailChange.emit(false);
  }

}
