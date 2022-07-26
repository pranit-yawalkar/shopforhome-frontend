import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  response!: any;
  registered!: string | null;
  loggedIn!: boolean;
  flag!: boolean;

  constructor(private router: Router, private route: ActivatedRoute,
    private userService: UserService, private formBuilder: FormBuilder,
    private toastrService: ToastrService) {
    if (this.route.snapshot.paramMap.get('registered') != null) {
      this.registered = this.route.snapshot.paramMap.get('registered');
    }
  }


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  reloadComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['']);
  }

  doSignIn(): void {
    this.userService.doSignIn(this.loginForm.value).subscribe(response => {
      this.response = response;
      this.loggedIn = true;
      localStorage.setItem('token', this.response.message);
      this.reloadComponent();
      this.toastrService.success("Keep Shopping...", "Logged In Successfully!!", {
        timeOut: 2000,
        progressBar: true,
      })
    }, error => {
      this.loggedIn = false;
      this.flag = true;
      this.toastrService.error('', 'Invalid credentials', {
        timeOut: 3000,
        progressBar: true,
      })
    })
  }
}
