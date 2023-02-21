import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.sass'],
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  aSub!: Subscription;
  
  constructor(private auth: AuthService, private router: Router) {}
  ngOnDestroy(): void {
    if (this.aSub) this.aSub.unsubscribe();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit() {
    this.form.disable();
    this.aSub = this.auth.register(this.form.value).subscribe(
      () => {
        this.router.navigate(['/login'], { queryParams: { registered: true } });
      },
      (error) => {
        console.warn(error);
        this.form.enable();
      }
    );
  }
}
