import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  public formSignUp!: UntypedFormGroup;
  @Input() haveAccount!: boolean;
  @Output() onAccount = new EventEmitter<boolean>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.formSignUp = this.authService.form;
  }

  public onCreateUser() {
    const dataUser = this.formSignUp.value;
    this.authService.createUser(dataUser);
    this.router.navigate(['/liste']);
  }

  onHaveAccount() {
    this.onAccount.emit(this.haveAccount);
  }
}