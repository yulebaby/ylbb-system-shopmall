import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from './../../../ng-relax/services/http.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { EditorComponent } from './editor/editor.component';
import { UploadFile, NzMessageService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';

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
      productName         : [, [Validators.required]],              // 商品名称
      productIntroduction : [, [Validators.required]],              // 商品简介
      productNum          : [, [Validators.required]],              // 商品编号
      brandId             : [, [Validators.required]],              // 品牌 Id
      categoryId          : [, [Validators.required]],              // 类型 Id
      originId            : [, [Validators.required]],              // 产地 Id
      price               : [, [Validators.required]],              // 商品原价
      activityPrice       : [],                                     // 活动价
      freight             : [, [Validators.required]],              // 运费
      coverPic            : ['11,22,33', [Validators.required]],              // 封面图
      carouselPic         : [, [Validators.required]],              // 轮播图
      productDesc         : [, [Validators.required]]               // 商品详情
    })
  }

  ngOnInit() {
  }

  _submit() {}

  /* ---------------------- 获取富文本编辑器内容 ---------------------- */
  getContent() {
    this.editor.getContent().then(res => {
      console.log(res);
    })
  }


  coverPicBeforeUpload = (file: UploadFile): boolean => {
    this._validatorUploadFile(file).subscribe(res => {
      if (res) {
        this.coverPicItems.push(file);
        this.baseFormGroup.patchValue({
          coverPic: this.coverPicItems[0]['url']
        });
      }
    })
    return false;
  }
  deleteCoverPicImag = () => {
    this.baseFormGroup.patchValue({
      coverPic: ''
    })
    return true;
  }

  carouselPicBeforeUpload = (file: UploadFile): boolean => {
    this._validatorUploadFile(file).subscribe(res => {
      if (res) {
        this.carouselPicItems.push(file);
        let shopImagValue = [];
        this.carouselPicItems.map((item: any) => {
          shopImagValue.push(item.url)
        });
        this.baseFormGroup.patchValue({
          carouselPic: shopImagValue.join(',')
        });
        setTimeout(() => {
          this.allowuploadNo = this.carouselPicItems.length < 5 ? this.carouselPicItems.length + 1 : 5;
        }, 500);
      }
    })
    return false;
  }
  deleteCarouselPicImag = () => {
    setTimeout(_ => {
      let shopImagValue = [];
      this.carouselPicItems.map((item: any) => {
        shopImagValue.push(item.url)
      });
      this.baseFormGroup.patchValue({
        carouselPic: shopImagValue.join(',')
      })
      this.allowuploadNo = this.allowuploadNo == 5 ? 5 : this.allowuploadNo - 1;
    }, 0)
    return true;
  }


  coverPicItems: UploadFile[] = [];
  carouselPicItems: UploadFile[] = [];
  previewImage: string;
  previewVisible: boolean;
  private _allowUpdateType = ['jpg', 'jpeg', 'png', 'gif'];
  allowuploadNo = 1;
  private _validatorUploadFile(file: UploadFile): Observable<any> {
    return new Observable(observer => {
      let fileType = file.name.split('.')[file.name.split('.').length - 1].toLowerCase();
      if (this._allowUpdateType.indexOf(fileType) === -1) {
        this.message.error(`请选择格式为 ${this._allowUpdateType.join(' | ')} 的图片`);
        observer.next(null);
        observer.complete();
      } else if (!(file.size / 1024 / 1024 < 2)) {
        this.message.error(`图片大小超出2MB，请更换图片`);
        observer.next(null);
        observer.complete();
      } else {
        let fileName = new Date().getTime() + `.${fileType}`;

        this._aliOssClient.multipartUpload(fileName, file, {}).then(res => {
          let imageSrc = res.url ? res.url : 'http://' + res.bucket + '.oss-cn-beijing.aliyuncs.com/' + res.name;
          file.status = 'done';
          file.url = imageSrc;
          observer.next(file);
          observer.complete();
        }, err => {
          observer.next(null);
          observer.complete();
          this.message.error('图片上传失败，请重新尝试');
        })
      }
    })
  }
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }
  
}
