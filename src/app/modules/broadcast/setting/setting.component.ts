import { HttpService } from 'src/app/ng-relax/services/http.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  
  formModel: FormGroup;

  shopItems: any[] = [];

  constructor(
    private http: HttpService,
    private fb: FormBuilder = new FormBuilder()
  ) { 
    this.formModel = this.fb.group({
      shop: []
    })
    this.formModel.get('shop').valueChanges.subscribe(res => {
      let items =  [];
      res && res.split(',').map(it => items.push({ bannerPicture: it, bannerUrl: null }));
      this.shopItems = items;
    })
  }

  ngOnInit() {
    this.http.post('/banner/listBanner').then(res => {
      let imgs = [];
      res.result.map(item => imgs.push(item.bannerPicture));
      this.formModel.patchValue({ shop: imgs.join(',') });
      setTimeout(() => {
        this.shopItems = res.result;
      });
    })
  }

  save() {
    console.log(this.shopItems);
    this.http.post('/banner/saveBanner', { paramJson: JSON.stringify(this.shopItems) });
  }

}
