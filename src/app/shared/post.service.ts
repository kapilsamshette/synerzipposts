import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPost } from '../Interface/IPost';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  apiUrL = 'https://jsonplaceholder.typicode.com/posts';
  constructor(private _httpClient:HttpClient) { }

  getAllPosts():Observable<IPost[]>{
    return this._httpClient.get<IPost[]>(this.apiUrL, {
      headers:{
        'Content-type':'application/json'
      }
    });
  }

  getPostDetails(id:number):Observable<IPost> {
    return this._httpClient.get<IPost>(this.apiUrL+'/'+id, {
      headers:{
        'Content-type':'application/json'
      }
    });
  }

  updatePost(id:number,postData:IPost):Observable<IPost>{
    return this._httpClient.put<IPost>(this.apiUrL+'/'+id, postData, {
      headers:{
        'Content-type':'application/json'
      }
    });
  }

  savePostDetails(postData:IPost):Observable<IPost>{
    return this._httpClient.post<IPost>(this.apiUrL, postData, {
      headers:{
        'Content-type':'application/json'
      }
    });
  }

  deletePosts(id:number):Observable<any> {
    return this._httpClient.delete<any>(this.apiUrL+'/'+id,{
      headers:{
        'Content-type':'application/json'
      }
    });
  }
}
