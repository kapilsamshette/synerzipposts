import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { throwError, Subscriber } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    // @ViewChild('loginForm') loginForm: NgForm;
    isError :Boolean=false;
    errorMessage:string='';
    loginForm:FormGroup;
    constructor(private authService:AuthService, private fb:FormBuilder, private router: Router) { }

    validationMessages={
      'email' :{
        'required':'Email required',
        'pattern':'Invalid Email'
      },
      'password':{ 'required':'Password Required' }
    };

    loginFormError={
      'email' :'',
      'password':''
    };

    ngOnInit() {
      this.loginForm = this.fb.group({
        email:['',  [ Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$") ]],
        password:['', Validators.required]
      });

      this.loginForm.valueChanges.subscribe((value)=>{
        this.loginValidation(this.loginForm);
      });
    }

    userLogin(){
      this.loginValidation(this.loginForm);
      if(!this.loginForm.invalid) {
        const data = this.authService.signIn(this.loginForm.get('email').value, this.loginForm.get('password').value);
        if(data.Status == 'Success' ){ console.log('kook')
          sessionStorage.setItem('Usertoken', data.Data.id);
          this.router.navigate(['../../posts/']);
        }else{
          this.errorMessage = data.Message;
          this.isError = true;
        }
      }
    }



    loginValidation(group:FormGroup = this.loginForm):void{ 
      
      Object.keys(group.controls).forEach((key:string)=>{
        const abstractControl = group.get(key);
        this.loginFormError[key] = '';
        if( abstractControl && !abstractControl.valid  && (abstractControl.touched || abstractControl.dirty || abstractControl.value !=='')){
          const messages= this.validationMessages[key];
          for( const errorKey in abstractControl.errors) {
            if(errorKey) {
              this.loginFormError[key] += messages[errorKey];
            }
          }
        }
        if(abstractControl instanceof FormGroup) {
          this.loginValidation(abstractControl);
        }
      });
    }

}
