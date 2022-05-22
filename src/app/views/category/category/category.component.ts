import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserCredentials } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service'
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [DataService]
})
export class CategoryComponent implements OnInit {
  
  @ViewChild('closeModal')
  closeModal!: ElementRef;

  public sharedUserData: UserCredentials = new UserCredentials();
  
  public loading: boolean = false;
  public allCategories: any[] = [];
  
  public Mode: string = 'ADD'; // EDIT, VIEW
  public EditMode: boolean = false;
  public SelectedCategory: any;
  public addEditForm!: FormGroup;
  public AnySubmit: Boolean = false;
  public ShowSuccess: boolean = false;
  public ShowError: boolean = false;
  
  

  constructor(
    private _dataSerevice: DataService,
    private _fb: FormBuilder,
    private sanitization: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.GetAllCategories();
    this.addEditForm = this.BuildForm(this.addEditForm);
  }

  public GetAllCategories() {
    this.loading = true;
    this._dataSerevice.GetAll('api/category', {})
    .subscribe((res: any) => {
      this.allCategories = res.data;
    })
  }

  BuildForm(form: FormGroup): FormGroup {
    form = this._fb.group({
      'name': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      'description': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(300)]),
      'image': new FormControl('', [Validators.required])
    })
    return form;
  }

  // Add/Edit User
  AddEditCategory(cate: any, mode: string) {
    this.Mode = mode;
    if (cate == null) {
      this.SelectedCategory = null;
      return;
    }
    this.SelectedCategory = cate;
    this.SetDataForm()
  }

  SetDataForm() {
    (this.addEditForm.get('name') as FormControl).setValue(this.SelectedCategory.name);
    (this.addEditForm.get('description') as FormControl).setValue(this.SelectedCategory.description);
    (this.addEditForm.get('image') as FormControl).setValue(this.SelectedCategory.cover);
  }

  UploadFile(event: any) {
    console.log(event);
    const _file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", _file);
    const configs = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedUserData.token) };    this._dataSerevice['Post']("api/upload?type=image", formData, configs)
    .subscribe((res: any) => {
      console.log(res);
      (this.addEditForm.get('image') as FormControl).setValue(res.data);
    });
  }

  submitAddEdit() {
    this.AnySubmit = true;
    if (this.addEditForm.invalid) {
      this.addEditForm.setErrors({ invalid: true });
    } else {
      const configs = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedUserData.token) }
      const formData = this.addEditForm.value;
      const url = this.Mode == 'ADD'? 'api/category' : `api/category/${this.SelectedCategory._id}`
      var data: any = {
        'name': formData.name,
        'description': formData.description,
        'cover': formData.image._id
      };
      this._dataSerevice[this.Mode == 'ADD'? 'Post' : 'Put'](url, data, configs).subscribe(
        (res: any) => {
          if (res.statusCode == null) {
            this.ShowSuccess = true;
            this.CancelForm();
            this.GetAllCategories();
            setTimeout(() => {
              this.ShowSuccess = false;
              this.ShowError = false;
              this.closeModal.nativeElement.click();
            }, 2000);
          } else {
            this.ShowError = true;
            setTimeout(() => { this.ShowError = false; this.ShowError = false; }, 2000)
            console.log("Error: ")
          }
        },
        (err) => {
          this.ShowError = true;
          setTimeout(() => { this.ShowError = false; this.ShowError = false; }, 2000)
          console.log("Error: ", err)
        },
        () => {
        }
      )
    }
  }

  MakeURLSave(url: string) {
    return this.sanitization.bypassSecurityTrustUrl(url);
  }

  CancelForm() {
    this.AnySubmit = false;
    (this.addEditForm.get('image') as FormControl).setValue({});
    this.SelectedCategory = {};
    this.addEditForm.reset();
  }

}
