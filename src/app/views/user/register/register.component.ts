import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUserDetail } from 'src/app/Interface/IUserDetail';
import { AuthService } from 'src/app/shared/auth.service';
const nonWhitespaceRegExp: RegExp = new RegExp("\\S");

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isError :Boolean=false;
  errorMessage:string='';
  registerForm:FormGroup;
  registerData = {};
  existingUserCheck:boolean = false;
  constructor(private authService:AuthService, private fb:FormBuilder, private router: Router) { }

  validationMessages={
    'name':{
      'required':'Name Required',
      'pattern':'Space not allowed'
    },
    'password':{
      'required':'Password Required',
      'pattern':'Space not allowed'
    },
    'confirm_password':{
      'required':'Confirm Password Required',
      'pattern':'Space not allowed'
    },
    'passwordGroup':{
			'emailMismatch': 'Password & confirm Password are not matching'
		},
    'email' :{
      'required':'Email required',
      'pattern':'Invalid Email'
    },
    'accept_term':{ 'minlength':'Terms & condition Required' }
  };

  registerFormError={
    'email' :'',
    'password':'',
    'confirm_password':'',
    'name':'',
    'accept_term':'',
    'passwordGroup':''
  };

  ngOnInit() {
    this.registerForm = this.fb.group({
      // id:[],
      email:['',  [ Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$") ]],
      passwordGroup : this.fb.group({
        password: ['', [Validators.required ] ],
        confirm_password: ['', Validators.required ],
      },{ validator: matchPassword}),
      name:['', [ Validators.required, Validators.pattern(nonWhitespaceRegExp)]],
      accept_term:[1, Validators.minLength(1)]
    });

    this.registerForm.valueChanges.subscribe((value)=>{
      this.logValidationErrors(this.registerForm);
    });
  }

  onSubmit(){
    this.logValidationErrors(this.registerForm);
    this.checkExistingUsername();
    if(!this.registerForm.invalid && this.existingUserCheck == false) {
      this.mapRegisterData();
      const data = this.authService.registerUser(this.registerData);
      if(data ){
         this.errorMessage = 'Successfully Added';
         this.isError = true;
        // this.router.navigate(['/app/app']);
      }
    }
  }

  mapRegisterData(){
    this.registerData['id'] = this.authService.getMaxUserId();
    this.registerData['name'] = this.registerForm.value.name;
    this.registerData['email'] = this.registerForm.value.email;
    this.registerData['password'] = this.registerForm.get('passwordGroup').get('password').value;
    this.registerData['accept_term'] = this.registerForm.value.accept_term;
  }
  checkExistingUsername(){
    let status = this.authService.checkUsernameAlreadyExist(this.registerForm.get('email').value);
    this.existingUserCheck = (status)? true:false;
  }

  logValidationErrors(group:FormGroup = this.registerForm):void{ 
    
    Object.keys(group.controls).forEach((key:string)=>{
      const abstractControl = group.get(key);
      this.registerFormError[key] = '';
      if( abstractControl && !abstractControl.valid  && (abstractControl.touched || abstractControl.dirty || abstractControl.value !=='')){
        const messages= this.validationMessages[key];
        for( const errorKey in abstractControl.errors) {
          if(errorKey) {
            this.registerFormError[key] += messages[errorKey];
          }
        }
      }
      if(abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }

}

function matchPassword(group: AbstractControl): {[key:string]:any} | null {
	const passwordControl = group.get('password');
	const confirmPasswordControl = group.get('confirm_password');
	if(passwordControl.value === confirmPasswordControl.value || ( confirmPasswordControl.pristine && confirmPasswordControl.value === '' ) ) {
		return null;
	}else {
		return {'emailMismatch': true};
	}
}