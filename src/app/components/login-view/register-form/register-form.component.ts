import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginData } from 'src/app/global/auth/auth.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {
  @Output() formData: EventEmitter<LoginData> = new EventEmitter();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
    });
  }

  ngOnInit(): void { }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get name() {
    return this.form.get('password');
  }

  get surname() {
    return this.form.get('password');
  }

  onSubmit() {
    this.formData.emit(this.form.value);
  }
}