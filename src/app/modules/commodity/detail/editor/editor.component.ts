import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';


declare const OSS;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EditorComponent),
    multi: true
  }]
})
export class EditorComponent implements OnInit {

  @Input() editorContent;

  private editorContentChange: any;

  constructor(
    private http: HttpService,
  ) { }

  ngOnInit() {
  }


  getContent(): Promise<string> {
    return new Promise((resolve, reject) => {    
      let dom = document.createElement('div');
      dom.innerHTML = this.editorContent;
      let imgs = dom.getElementsByTagName('img');
      let uploadNum = 0;
      if (imgs.length) {
        const _this_ = this;
        this.http.get('http://oss.beibeiyue.com/oss/getOSSToken?type=1', {}, false).then(res => {
          if (res.result == 0) {
            let creds = res.data;
            let client = new OSS.Wrapper({
              region: 'oss-cn-beijing',
              accessKeyId: creds.accessKeyId,
              accessKeySecret: creds.accessKeySecret,
              stsToken: creds.securityToken,
              bucket: 'ylbb-business'
            });
            for (let i = 0; i < imgs.length; i++) {
              (function (i) {
                // 获取到 base64 格式的图片
                const ImageURL = imgs[i].src
                if (ImageURL.substr(0, 4) == 'http') {
                  uploadNum++;
                  _this_.getContentComplate(imgs.length, uploadNum, dom);
                  return;
                }
                // 将 base64 图片转换成 blob 流
                const block = ImageURL.split(";");
                const contentType = block[0].split(":")[1];
                const realData = block[1].split(",")[1];
                var blob = _this_.b64toBlob(realData, contentType);
                // blob 转 arrayBuffer
                var reader = new FileReader();
                reader.readAsArrayBuffer(blob);
                reader.onload = function (event: any) {
                  // arrayBuffer转Buffer
                  var buffer = new OSS.Buffer(event.target.result);
                  client.put(`${new Date().getTime()}-${i}.${contentType.split('/')[1]}`, buffer).then(function (result) {
                    imgs[i].src = result.url;
                    uploadNum++;
                    _this_.getContentComplate(imgs.length, uploadNum, dom).then(res => { resolve(res) }).catch();
                  }, err => {
                    reject('上传图片失败，请重新上传');
                  });
                }
              })(i)
            }
          }
        });
        setTimeout(() => {
          reject('上传图片超时，建议重新上传')
        }, 20 * 1000);
      } else {
        resolve(this.editorContent);
      }

    })
  }

  private getContentComplate(imgsLength, currentLoadLength, dom): Promise<string> {
    return new Promise((resolve, reject) => {
      if (imgsLength === currentLoadLength) {
        resolve(dom.innerHTML);
      } else {
        reject('图片未全部上传完毕')
      }
    })
  }

  private b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }




  /* 实现 ControlValueAccessor 接口部分 */
  writeValue(val: number): void {
    if (val) {
      this.editorContent = val;
    }
  }
  registerOnChange(fn: any): void {
    this.editorContentChange = fn;
  }
  registerOnTouched(fn: any): void {
  }

}
