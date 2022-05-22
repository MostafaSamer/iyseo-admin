import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor(
    private router: Router
  ) {
    if(localStorage.getItem('token')){
      this.setauthenticated(true);
    }else{
      this.setauthenticated(false);
    }
  }

  userData = new BehaviorSubject<UserCredentials>(new UserCredentials());
  userData$ = this.userData.asObservable();

  authenticated = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticated.asObservable();

  setuserData(userData: UserCredentials){
    this.userData.next(userData);
  }

  setauthenticated(authenticated: boolean){
    this.authenticated.next(authenticated);
  }

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("email")
    this.setauthenticated(false);
    this.router.navigateByUrl('/sessions');
  }

}

export class UserCredentials{
  public token;

  constructor(_token?: any) {
    this.token = _token? _token : localStorage.getItem('token');
  }
  
}
