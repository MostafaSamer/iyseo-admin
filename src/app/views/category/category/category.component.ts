import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service'

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [DataService]
})
export class CategoryComponent implements OnInit {

  private allCategories: any[] = [];

  private loading: boolean = false;

  constructor(
    private _dataSerevice: DataService
  ) { }

  ngOnInit(): void {
    this.GetAllCategories();
  }

  public GetAllCategories() {
    this.loading = true;
    this._dataSerevice.GetAll('api/category', {})
    .subscribe((res: any) => {
      console.log(res)
    })
  }

}
