import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts.component';
import { PostRoutingModule } from './post-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FooterComponent } from '../common/footer.component';
import { HeaderComponent } from '../common/header.component';
import { AddPostsComponent } from './addposts/add-posts.component';
import { PostsListComponent } from './postlist/posts-list.component';

@NgModule({
  declarations: [PostsComponent, PostsListComponent, AddPostsComponent,  HeaderComponent, FooterComponent],
  imports: [
    CommonModule,    
    SharedModule,
    PostRoutingModule
  ]
})
export class PostsModule { }
