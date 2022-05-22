import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserCredentials } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [DataService]
})
export class UsersComponent implements OnInit {
  
  @ViewChild('closeModal')
  closeModal!: ElementRef;

  public sharedUserData: UserCredentials = new UserCredentials();
  
  public loading: boolean = false;
  public allUsers: any[] = [];
  
  public Mode: string = 'ADD'; // EDIT, VIEW
  public EditMode: boolean = false;
  public SelectedUsers: any;
  public addEditForm!: FormGroup;
  public AnySubmit: Boolean = false;
  public ShowSuccess: boolean = false;
  public ShowError: boolean = false;

  constructor(
    private _dataSerevice: DataService,
    private _fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.GetAllUsers();
    this.addEditForm = this.BuildForm(this.addEditForm);
  }

  public GetAllUsers() {
    this.loading = true;
    const configs = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedUserData.token) };
    this._dataSerevice.GetAll('api/test/admin', configs)
    .subscribe((res: any) => {
      this.allUsers = res.data;
    })
  }

  BuildForm(form: FormGroup): FormGroup {
    form = this._fb.group({
      'fullName': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      'email': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      'password': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      'confirmPassword': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      'phoneNumber': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    })
    return form;
  }

  // Add/Edit User
  AddEditCategory(cate: any, mode: string) {
    this.Mode = mode;
    if (cate == null) {
      this.SelectedUsers = null;
      return;
    }
    this.SelectedUsers = cate;
    this.SetDataForm()
  }

  SetDataForm() {
    (this.addEditForm.get('fullName') as FormControl).setValue(this.SelectedUsers.fullName);
    (this.addEditForm.get('email') as FormControl).setValue(this.SelectedUsers.email);
    (this.addEditForm.get('password') as FormControl).setValue(this.SelectedUsers.password);
    (this.addEditForm.get('confirmPassword') as FormControl).setValue(this.SelectedUsers.confirmPassword);
    (this.addEditForm.get('phoneNumber') as FormControl).setValue(this.SelectedUsers.phoneNumber);
  }

  submitAddEdit() {
    this.AnySubmit = true;
    if (this.addEditForm.invalid) {
      this.addEditForm.setErrors({ invalid: true });
    } else {
      const configs = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedUserData.token) }
      const formData = this.addEditForm.value;
      const url = 'api/auth/signup'
      var data: any = {
        'fullName': formData.fullName,
        'email': formData.email,
        'password': formData.password,
        'confirmPassword': formData.confirmPassword,
        'phoneNumber': formData.phoneNumber,
      };
      this._dataSerevice['Post'](url, data, configs).subscribe(
        (res: any) => {
          if (res.statusCode == null) {
            this.ShowSuccess = true;
            this.CancelForm();
            this.GetAllUsers();
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

  CancelForm() {
    this.AnySubmit = false;
    (this.addEditForm.get('image') as FormControl).setValue({});
    this.SelectedUsers = {};
    this.addEditForm.reset();
  }

}
