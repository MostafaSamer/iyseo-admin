import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService, UserCredentials } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  public sharedUserData: UserCredentials = new UserCredentials();

  public addEditForm!: FormGroup;
  public AnySubmit: Boolean = false;
  public ShowSuccess: boolean = false;
  public ShowError: boolean = false;


  constructor(
    public _sharedUserData: SharedDataService,
    private _fb: FormBuilder,
    private _dataSerevice: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._sharedUserData.userData$.subscribe(
      (userData) => {
        this.sharedUserData.token = userData.token;
      }
    )
    // Build Form
    this.addEditForm = this.BuildForm(this.addEditForm);
  }

  BuildForm(form: FormGroup): FormGroup {
    form = this._fb.group({
      'email': new FormControl('', []),
      'password': new FormControl('', []),
    })
    return form;
  }


  submitAddEdit() {
    this.AnySubmit = true;
    if(this.addEditForm.invalid){
      this.addEditForm.setErrors({invalid: true});
    } else {
      console.log(this.addEditForm)
      const configs = {}
      const formData = this.addEditForm.value;
      const url = 'api/auth/signin';
      var data: any = {
        'email': formData.email,
        'password': formData.password,
      };
      this._dataSerevice.Post(url, data, configs).subscribe(
        (res: any) => {
          if(res.message && res.message == "Unauthorized" && res.statusCode == 401) {
            this.RaiseError("Unauthorized");
            return;
          }
          this.ShowSuccess = true;
          localStorage.setItem('token', res.accessToken);
          this._sharedUserData.setuserData(new UserCredentials(res.accessToken));
          this._sharedUserData.setauthenticated(true);
          this.ShowSuccess = false; this.ShowError = false; this.router.navigateByUrl('/posts');
        },
        (err) => {
          this.RaiseError(err)
        },
        () => {
        }
      )
    }
  }

  RaiseError(err: any) {
    this.ShowError = true;
    setTimeout(() => { this.ShowError = false; this.ShowError = false; }, 4000);
    console.log("Error: ", err)
  }

}
