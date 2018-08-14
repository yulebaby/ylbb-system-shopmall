import { AppState } from '../reducers/reducers-config';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

declare const CryptoJS;

@Component({
  selector: 'ea-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private http       : HttpClient,
    private router     : Router,
    private store      : Store<AppState>
  ) {
  }

  ngOnInit() {
    this.store.dispatch({
      type: 'setUserInfo', payload: {
        name: '管理员',
        id: 1,
        roleAllowPath: '**'
      }})
    setTimeout(() => {
      this.router.navigateByUrl('/home');
    });
  }
}
