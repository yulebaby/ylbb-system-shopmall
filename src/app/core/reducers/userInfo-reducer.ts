import { Action } from '@ngrx/store';

export function userInfoReducer (state: UserInfoState, action: Action) {
  switch (action.type) {
    case 'setUserInfo':
      try {
        window.localStorage.setItem('userInfo', JSON.stringify(action['payload']));
        return action['payload'];
      } catch (error) {
        return state;
      }
    
    default:
      return state;
  }
}
export interface UserInfoState {
  name    : string;
  email?  : string;
  id      : number;
  roles   : any[];
  status  : number;
  store   : object;
  roleAllowPath?: string;
}