import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialService } from '../shared/classes/material.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  aSub!: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    if (this.aSub) this.aSub.unsubscribe();
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterialService.toast(
          'Тепер можна зайти в ситему використовуючи свої дані'
        );
      } else if (params['accessDenied']) {
        MaterialService.toast('Для початку авторизуйтесь');
      } else if (params['sessionFailed']) {
        MaterialService.toast('Закінчився термін дії токену. Перезайдіть');
      }
    });
  }

  onSubmit() {
    this.form.disable();
    const user = {
      email: this.form.value.email,
      password: this.form.value.password,
    };
    this.aSub = this.auth.login(user).subscribe(
      () => {
        this.router.navigate(['/overview'])
      },
      (error) => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }
}
