import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { AddPostsComponent } from './addposts/add-posts.component';
import { PostsListComponent } from './postlist/posts-list.component';
import { PostsComponent } from './posts.component';


const routes: Routes = [
    {path:'', component:PostsComponent,
        children:[
        // { path: '', redirectTo: 'client-list', pathMatch: 'full' },
        { path: '', component: PostsListComponent, canActivate:[AuthGuard] },
        { path:'edit', component:AddPostsComponent, canActivate:[AuthGuard]},
        { path:'edit/:id', component:AddPostsComponent, canActivate:[AuthGuard]}
    ]}
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostRoutingModule { }
