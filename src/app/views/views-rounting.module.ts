import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { ViewsComponent } from './views.component';



const routes: Routes = [
    {
        path: '',
        component: ViewsComponent,
        pathMatch: 'full',
    },
    { path: 'posts', loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule), canActivate:[AuthGuard] },
    { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
    { path: 'error', component: PagenotfoundComponent },
    { path: '**', redirectTo: '/error' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewsRoutingModule { }
