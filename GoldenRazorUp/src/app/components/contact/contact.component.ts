import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contactForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    mensagem: new FormControl('', Validators.required)
  });

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Formulário enviado:', this.contactForm.value);
      // Aqui você pode adicionar a lógica para enviar os dados
    }
  }
}