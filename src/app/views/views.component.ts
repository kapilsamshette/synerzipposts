import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.css'],
})
export class ViewsComponent implements OnInit {

  constructor(private router:Router) { 
    this.router.navigateByUrl('/posts');
  }

  ngOnInit(): void {
  }

}
