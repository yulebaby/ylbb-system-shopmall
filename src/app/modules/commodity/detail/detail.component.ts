import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpService } from './../../../ng-relax/services/http.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EditorComponent } from './editor/editor.component';
import { NzMessageService } from 'ng-zorro-antd';

declare const OSS;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  @ViewChild('editor') editor: EditorComponent;

  // 阿里云OSS 上传SDK
  private _aliOssClient;

  // 富文本编辑器内容
  editorContent;

  dataSet: any[] = [];

  // 商品基础内容
  baseFormGroup: FormGroup;

  _submitLoading: boolean;

  constructor(
    private http    : HttpService,
    private fb      : FormBuilder = new FormBuilder(),
    private message : NzMessageService
  ) { 

    /* ----------------- 获取OSS上传凭证 ----------------- */
    this.http.get('http://oss.beibeiyue.com/oss/getOSSToken?type=1', {}, false).then(res => {
      if (res.result == 0) {
        let creds = res.data;
        this._aliOssClient = new OSS.Wrapper({
          region: 'oss-cn-beijing',
          accessKeyId: creds.accessKeyId,
          accessKeySecret: creds.accessKeySecret,
          stsToken: creds.securityToken,
          bucket: 'ylbb-business'
        });
      }
    });
    this.baseFormGroup = this.fb.group({
      name                : [, [Validators.required]],              // 商品名称
      productIntroduction : [, [Validators.required]],              // 商品简介
      productNum          : [, [Validators.required]],              // 商品编号
      brandId             : [, [Validators.required]],              // 品牌 Id
      categoryId          : [, [Validators.required]],              // 类型 Id
      originId            : [, [Validators.required]],              // 产地 Id
      price               : [, [Validators.required]],              // 商品原价
      activityPrice       : [],                                     // 活动价
      freight             : [, [Validators.required]],              // 运费
      coverPic            : [, [Validators.required]],              // 封面图
      carouselPic         : [, [Validators.required]],              // 轮播图
      productDesc         : [],              // 商品详情
      specifications      : new FormGroup({})
    });
    this.baseFormGroup.get('specifications')
  }
  /* ----------------------------- 更改商品类型，获取到该类型下商品规格 ----------------------------- */
  categoryIdChange(categoryId) {
    this.http.get('/shop/listProductSpecification', { categoryId }, false).then(res => {
      res.result.map(item => {
        item.specificationAttributeValueList.map(list => {
          list.label = list.specificationAttributeValueName;
          list.value = list.middleId;
        })
      })
      this.specifications = res.result;
      let controlName = {};
      this.specifications.map((category, idx) => {
        controlName[`category${category.specificationAttributeId}`] = this.specifications[idx].specificationAttributeValueList || [];
      })
      let specificationsGroup: FormGroup = this.baseFormGroup.get('specifications') as FormGroup;
      Object.keys(controlName).map(key => specificationsGroup.addControl(key, new FormControl(controlName[key])));
    })
  }

  listShopBrand: any[] = [];
  listShopCategory: any[] = [];
  listShopOrigin: any[] = [];

  specifications: any[];
  ngOnInit() {
    this.http.post('/brand/listShopBrand', {}, false).then(res => this.listShopBrand = res.result);
    this.http.post('/category/listShopCategory', {}, false).then(res => this.listShopCategory = res.result);
    this.http.post('/origin/listShopOrigin', {}, false).then(res => this.listShopOrigin = res.result);
  }

  _submit() {
    for (const i in this.baseFormGroup.controls) {
      this.baseFormGroup.controls[i].markAsDirty();
      this.baseFormGroup.controls[i].updateValueAndValidity();
    }
    if (this.baseFormGroup.valid) {
      this._submitLoading = true;
      let params = this.baseFormGroup.value;
      // 获取到富文本编辑器内容
      this.editor.getContent().then(res => {
        params.productDesc = res;
        this.dataSet.map(res => { 
          res.middleId = res.middle.map(m => m.value).join(',');
          res.propertiesName = res.middle.map(m => m.label).join(',');
        })
        console.log(params, this.dataSet)
        this.http.get('/shop/saveProduct', { productJson: JSON.stringify(params), skuJson: JSON.stringify(this.dataSet) }).then(res => {
          this._submitLoading = false;
        }, err => this._submitLoading = false)
      })
    }
  }

  /* ------------------- 商品规格信息改变，重新计算商品各种规格数量 ------------------- */
  specificationsChange(e) {
    this.dataSet = [];
    let specificationsGroup = this.baseFormGroup.get('specifications') as FormGroup;
    let specificationList = []
    Object.values(specificationsGroup.controls).map((control: FormControl, idx) => {
      let arr = [];
      control.value.map(res => res.checked && (arr.push(res)));
      arr.length && specificationList.push(arr);
    });
    let doCombination = this.doCombination(specificationList);
    let tableItems = [];
    doCombination.map(res => tableItems.push({ middle: res }));
    this.dataSet = tableItems;
  }




  /* ---------------------- 新增分类 ---------------------- */
  showAddModal: boolean | string;
  saveAddTitle: string;
  addClassValue: string;
  saveClassLoading: boolean;
  saveClassSource: string;
  openSaveModal(type, hasId?) {
    this.addClassValue = '';
    this.showAddModal = true;
    this.saveAddTitle = addClassType[type];
    this.saveClassSource = saveSource[type];
    !hasId && (this.specificationAttributeId = null);
  }
  saveAddClass() {
    if (this.addClassValue) {
      this.saveClassLoading = true;
      let params = {
        name: this.addClassValue,
        specificationAttributeId: this.specificationAttributeId
      }
      this.http.get(this.saveClassSource, { paramJson: JSON.stringify(params) }, false).then(res => {
        this.saveClassLoading = false;
        this.showAddModal = false;
        if (this.specificationAttributeId) {
          // 这里是新增商品规格信息
        }
      }, err => this.saveClassLoading = false);
    } else {
      this.message.warning(`请输入${this.saveAddTitle}`);
    }
  }
  specificationAttributeId: number;
  addSpecifications(id) {
    this.specificationAttributeId = id;
    this.openSaveModal('specification', true);
  }


  /* ---------------------- 多数组排序，获取所有组合 ---------------------- */
  doCombination(arr) {
    if (!arr || !arr.length) { return []; }
    let count = arr.length - 1; //数组长度(从0开始)
    let tmp = [];
    let totalArr = [];// 总数组

    return doCombinationCallback(arr, 0);//从第一个开始
    //js 没有静态数据，为了避免和外部数据混淆，需要使用闭包的形式
    function doCombinationCallback(arr, curr_index) {
      for (let val of arr[curr_index]) {
        tmp[curr_index] = val;//以curr_index为索引，加入数组
        //当前循环下标小于数组总长度，则需要继续调用方法
        if (curr_index < count) {
          doCombinationCallback(arr, curr_index + 1);//继续调用
        } else {
          totalArr.push(tmp);//(直接给push进去，push进去的不是值，而是值的地址)
        }
        //js  对象都是 地址引用(引用关系)，每次都需要重新初始化，否则 totalArr的数据都会是最后一次的 tmp 数据；
        let oldTmp = tmp;
        tmp = [];
        for (let index of oldTmp) {
          tmp.push(index);
        }
      }
      return totalArr;
    }
  }

  
}

enum addClassType {
  brand = '品牌',
  category = '类型',
  origin = '产地',
  specification = '规格'
}

enum saveSource {
  brand = '/brand/saveShopBrand',
  category = '/category/saveShopCategory',
  origin = '/origin/saveShopOrigin',
  specification = '/specificationValue/saveSpecificationAttributeValue'
}