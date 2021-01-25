import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IPost } from 'src/app/Interface/IPost';
import { PostService } from 'src/app/shared/post.service';

const nonWhitespaceRegExp: RegExp = new RegExp("\\S");

@Component({
  selector: 'app-add-posts',
  templateUrl: './add-posts.component.html',
  styleUrls: ['./add-posts.component.css']
})
export class AddPostsComponent implements OnInit {
  postsFrom:FormGroup;
  postData:IPost;
  private ngUnsubscribe= new Subject();
  errorMessage:string;
  isError:Boolean= false;
  constructor(private _activatedRoute:ActivatedRoute, private fb:FormBuilder, private _postService:PostService, private router:Router) { }

  validationMessages={
    'title':{
      'required':'Title Required',
      'pattern':'Space not allowed'
    },
    'body':{
      'required':'Content Required',
      'pattern':'Space not allowed'
    }    
  };

  FormError={
    'title' :'',
    'body':''
  };

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(param=>{
      const id = +param.get('id');
      if(id){
        this._postService.getPostDetails(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(postData=>{
          this.postData = postData;
          this.existingPostData(postData);
        });
      }else {
        this.postData = {
          id:0,
          userId: +sessionStorage.getItem('Usertoken'),
          title:'',
          body:''
        }
      }
    });

    this.postsFrom = this.fb.group({
      title:['', [Validators.required, Validators.pattern(nonWhitespaceRegExp)]],
      body:['', [ Validators.required, Validators.pattern(nonWhitespaceRegExp)]]
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  existingPostData(postData) {
    this.postsFrom.patchValue({
      title:postData.title,
      body:postData.body
    });
  }

  onSubmit() {
    this.logValidationErrors();
    if(!this.postsFrom.invalid){
      this.postData.title = this.postsFrom.value.title;
      this.postData.body = this.postsFrom.value.body;
    
      if(this.postData.id){
        this._postService.updatePost(this.postData.id, this.postData).pipe(takeUntil(this.ngUnsubscribe)).subscribe(saveData=>{
          this.router.navigate(['../']);
        })
      }else{
        this._postService.savePostDetails(this.postData).pipe(takeUntil(this.ngUnsubscribe)).subscribe(saveData=>{
          this.router.navigate(['../']);
        });
      }
    }
  }

  redirectToPosts() {
    this.router.navigate(['../'])
  }

  
  logValidationErrors(group:FormGroup = this.postsFrom):void{ 
    
    Object.keys(group.controls).forEach((key:string)=>{
      const abstractControl = group.get(key);
      this.FormError[key] = '';
      if( abstractControl && !abstractControl.valid  && (abstractControl.touched || abstractControl.dirty || abstractControl.value !=='')){
        const messages= this.validationMessages[key];
        for( const errorKey in abstractControl.errors) {
          if(errorKey) {
            this.FormError[key] += messages[errorKey];
          }
        }
      }
      if(abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }
}
