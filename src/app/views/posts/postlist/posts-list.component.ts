import { AfterViewInit, Component, OnInit, ViewChild, ɵCompiler_compileModuleAndAllComponentsSync__POST_R3__ } from '@angular/core';
import { Observable, Subject, throwError  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IPost } from 'src/app/Interface/IPost';
import { PostService } from 'src/app/shared/post.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  AllPosts:IPost[];
  filteredResult:IPost[];
  SearchText:string;
  isError:boolean=false;
  errorMessage:string = '';
  displayedColumns: string[] = ['id', 'title', 'body', 'action'];
  dataSource: MatTableDataSource<IPost>;

  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

  constructor(private _postService:PostService) { }

  ngOnInit(): void {
    this._postService.getAllPosts().pipe(takeUntil(this.ngUnsubscribe)).subscribe(postData => {
      this.AllPosts = postData.reverse();
      this.filteredResult = postData.reverse();
      this.dataSource = new MatTableDataSource(this.filteredResult.reverse());
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    },
    err=>{ this.errorFunction(err);}
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  SearchPost() {
    this.filteredResult = this.AllPosts.filter(e=>e.title.toLowerCase().indexOf(this.SearchText.toLowerCase()) !== -1 );
    this.dataSource = new MatTableDataSource(this.filteredResult);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  deletePost(id) {
    this.isError = false;
    const index = this.filteredResult.findIndex(e=>e.id == id);
    if( index != -1) {
      this._postService.deletePosts(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(data=>{
        this.errorMessage = 'Record Deleted';
        this.isError = true;
      })
      this.filteredResult.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.filteredResult);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
    
  }
  

  ngOnDestroy() { 
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  errorFunction(err) {
    if (err.error instanceof ErrorEvent) {
      console.log(err.error.message)
    } else {
      console.log(err.error)
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

}
