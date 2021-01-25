import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { IUser } from '../Interface/IUser';
let users = JSON.parse(localStorage.getItem('users')) || [];

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router) { }

  signIn(email:string, password:string){
    const user = users.find(x => x.email === email && x.password === password);
    if (!user) return ({Status:'Error', Message: 'No User Data Found'});
    return ({
      Status: 'Success',
      Message:'Login Data',
      Data:{
        id: user.id,
        email: user.email,
        name: user.name
      }
        
    });
  }

  getMaxUserId() {
    const userId = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
    return userId;
  }

  checkUsernameAlreadyExist(email){
    if (users.find(x => x.email === email)) {
      return 1;
    }else{
      return 0;
    }
  }

  registerUser(userData){
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    return 1;
  }

  logout() {
    sessionStorage.removeItem('Usertoken');
    this.router.navigate(['../']);
  }
  
}
