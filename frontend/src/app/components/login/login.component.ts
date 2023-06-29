import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from '../../models/users.model';
import { DbService } from 'src/app/services/db.service';
import { NotificationService } from '@progress/kendo-angular-notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('notification', { read: ViewContainerRef, static: false })
  public notification: ViewContainerRef | undefined;

  public loginForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private dbService: DbService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: new FormControl<string | null>(null, Validators.required),
      password: new FormControl<string | null>(null, Validators.required),
    });
  }

  login() {
    console.log(this.loginForm);
    if (this.loginForm.valid) {
      const user: User = {} as User;
      user.username = this.loginForm.get('username')?.value;
      user.password = this.loginForm.get('password')?.value;
      console.log(user);

      this.dbService
        .login(user)
        .then((result) => {
          console.log(result);
          this.notificationService.show({
            appendTo: this.notification,
            content: 'Login successful',
            position: { horizontal: 'center', vertical: 'bottom' },
            animation: { type: 'fade', duration: 200 },
            hideAfter: 2000,
            type: { style: 'success', icon: true },
          });
          setTimeout(() => {
            this.router.navigate(['/order-overview'], {
              queryParams: { resellerid: result.reselerid },
            });
          }, 4000);
        })
        .catch((err) => {
          this.notificationService.show({
            appendTo: this.notification,
            content: err.error.message,
            position: { horizontal: 'center', vertical: 'bottom' },
            animation: { type: 'fade', duration: 200 },
            hideAfter: 2000,
            type: { style: 'error', icon: true },
          });
          console.error(err);
        });
    }
  }
}
