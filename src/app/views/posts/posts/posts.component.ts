import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserCredentials } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  providers: [DataService]
})
export class PostsComponent implements OnInit {
  
  @ViewChild('closeModal')
  closeModal!: ElementRef;

  public sharedUserData: UserCredentials = new UserCredentials();
  
  public loading: boolean = false;
  public allPosts: any[] = [];
  public allCategories: any[] = [];
  
  public Mode: string = 'ADD'; // EDIT, VIEW
  public EditMode: boolean = false;
  public SelectedPosts: any;
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
    this.GetAllPosts();
    this.GetAllCategories();
    this.addEditForm = this.BuildForm(this.addEditForm);
  }

  public GetAllPosts() {
    this.loading = true;
    this._dataSerevice.GetAll('api/post', {})
    .subscribe((res: any) => {
      this.allPosts = res.data;
    })
  }

  BuildForm(form: FormGroup): FormGroup {
    form = this._fb.group({
      'title': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      'cover': new FormControl('', [Validators.required]),
      'content': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(300)]),
      'isFeatured': new FormControl(false),
      'inSlider': new FormControl(false),
      'category': new FormControl(""),
    })
    return form;
  }

  public GetAllCategories() {
    this.loading = true;
    this._dataSerevice.GetAll('api/category', {})
    .subscribe((res: any) => {
      this.allCategories = res.data;
    })
  }

  // Add/Edit User
  AddEditPost(cate: any, mode: string) {
    this.Mode = mode;
    if (cate == null) {
      this.SelectedPosts = null;
      return;
    }
    this.SelectedPosts = cate;
    this.SetDataForm()
  }

  SetDataForm() {
    (this.addEditForm.get('title') as FormControl).setValue(this.SelectedPosts.title);
    (this.addEditForm.get('cover') as FormControl).setValue(this.SelectedPosts.cover);
    (this.addEditForm.get('content') as FormControl).setValue(this.SelectedPosts.content);
    (this.addEditForm.get('isFeatured') as FormControl).setValue(this.SelectedPosts.isFeatured);
    (this.addEditForm.get('inSlider') as FormControl).setValue(this.SelectedPosts.inSlider);
    (this.addEditForm.get('category') as FormControl).setValue(this.SelectedPosts.category);
  }

  UploadFile(event: any) {
    console.log(event);
    const _file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", _file);
    const configs = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedUserData.token) };
    this._dataSerevice['Post']("api/upload?type=image", formData, configs)
    .subscribe((res: any) => {
      console.log(res);
      (this.addEditForm.get('cover') as FormControl).setValue(res.data);
    });
  }

  submitAddEdit() {
    this.AnySubmit = true;
    if (this.addEditForm.invalid) {
      this.addEditForm.setErrors({ invalid: true });
    } else {
      const configs = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedUserData.token) }
      const formData = this.addEditForm.value;
      const url = this.Mode == 'ADD'? 'api/post' : `api/post/${this.SelectedPosts._id}`
      var data: any = {
        'title': formData.title,
        'cover': formData.cover,
        'content': formData.content,
        'isFeatured': formData.isFeatured,
        'inSlider': formData.inSlider,
        'category': formData.category
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
    this.SelectedPosts = {};
    this.addEditForm.reset();
  }

}
