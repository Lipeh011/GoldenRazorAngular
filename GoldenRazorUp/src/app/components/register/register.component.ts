import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  // Atualizar os nomes dos controles
  registerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[A-Za-zÀ-ÿ\s]+$/)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    phone: new FormControl('', [
      Validators.pattern(/^\d{11}$/)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    ])
  });

  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

 onSubmit() {
  if (this.registerForm.valid) {
    this.isLoading = true;
    const formValue = this.registerForm.value;
    
    const userData = {
      name: formValue.name!,
      email: formValue.email!,
      phone: formValue.phone ?? undefined,
      password: formValue.password!,
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
           this.showError("Cadastro realizado com sucesso")
          this.router.navigate(['/login']);
        } else {
          this.showError('Erro ao cadastrar: ' + response.message);
        }
      },
      error: (err) => {
        this.isLoading = false;
     
        console.error('Register error:', err);
      }
    });
  }
}

private showError(message: string): void {
  this.snackBar.open(message, '', {
    duration: 5000,
    panelClass: ['custom-sucess-snackbar'], 
    verticalPosition: 'bottom', 
    horizontalPosition: 'center' 
  });
}
}