import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewsComponent } from './views.component';
import { ViewsRoutingModule } from './views-rounting.module';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { FooterComponent } from './common/footer.component';
import { HeaderComponent } from './common/header.component';



@NgModule({
  declarations: [ViewsComponent, PagenotfoundComponent],
  imports: [
    CommonModule,
    ViewsRoutingModule
  ],
})
export class ViewsModule { }
