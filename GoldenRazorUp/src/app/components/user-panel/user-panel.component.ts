import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppointmentService } from '../../models/service.model';
import { Appointment } from '../../models/appointment.model';
import { AuthService, User } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

interface ServiceType { value: string; label: string; }

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent implements OnInit {
  // Forms
  profileForm = new FormGroup({
    name:  new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required)
  });
  preferencesForm = new FormGroup({
    serviceType: new FormControl('corte', Validators.required)
  });
  newAppForm = new FormGroup({
    service: new FormControl('corte', Validators.required),
    date:    new FormControl('', Validators.required)
  });

  // Dados
  appointments: Appointment[] = [];
  serviceTypes: ServiceType[] = [
    { value: 'corte',      label: 'Corte de Cabelo' },
    { value: 'barba',      label: 'Barba' },
    { value: 'corte-barba',label: 'Corte e Barba' }
  ];

  // Estado de navegação e preferências
  activeSection = 'perfil';
  selectedServiceType = 'corte';

  constructor(
    private auth: AuthService,
    private router: Router,
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
    
  ) {}

  ngOnInit(): void {
    // Protege rota
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // Popula perfil
    this.profileForm.patchValue({
      name:  user.name,
      email: user.email,
      phone: user.phone || ''
    });

    // Popula preferências
    const initialPref = user.preferences?.serviceType || 'corte';
    this.preferencesForm.patchValue({ serviceType: initialPref });
    this.selectedServiceType = initialPref;

    // Sincroniza selectedServiceType com o form
    this.preferencesForm.get('serviceType')!
      .valueChanges
      .subscribe(val => {
        this.selectedServiceType = val!;
      });

    // Carrega agendamentos
    this.loadAppointments();
  }

  private loadAppointments(): void {
    this.appointmentService.list().subscribe(apps => {
      this.appointments = apps;
    });
  }

  // Salva perfil
  onSubmitProfile(): void {
    if (this.profileForm.invalid) return;
    const user = this.auth.getCurrentUser()!;
    const updated: User = {
      ...user,
      name:  this.profileForm.value.name!,
      email: this.profileForm.value.email!,
      phone: this.profileForm.value.phone!
    };
    this.auth.updateUser(updated);
    this.showSucess('Perfil atualizado com sucesso!');

  }

  // Salva preferências
  onSubmitPreferences(): void {
    if (this.preferencesForm.invalid) return;
    const user = this.auth.getCurrentUser()!;
    const chosen = this.preferencesForm.value.serviceType!;
    const updated: User = {
      ...user,
      preferences: { serviceType: chosen }
    };
    this.auth.updateUser(updated);
    // selectedServiceType já sincronizado por valueChanges
    this.showSucess('Preferências salvas !');
  }

  // Label legível
  getServiceLabel(value: string): string {
    const found = this.serviceTypes.find(s => s.value === value);
    return found ? found.label : '';
  }

  // Novo agendamento
  schedule(): void {
    if (this.newAppForm.invalid) return;
    const svc  = this.newAppForm.value.service!;
    const dt   = this.newAppForm.value.date!;
    this.appointmentService.create(svc, dt).subscribe(app => {
      this.appointments.unshift(app);
      this.newAppForm.reset({ service: svc, date: '' });
      this.showSucess('Agendamento criado com sucesso!');
    });
  }

  // Scroll suave e troca de seção
  scrollTo(section: string): void {
    this.activeSection = section;
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  // Logout
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private showError(message: string): void {
  this.snackBar.open(message, '', {
    duration: 5000,
    panelClass: ['custom-error-snackbar'], 
    verticalPosition: 'bottom', 
    horizontalPosition: 'center' 
  });

}
private showSucess(message: string): void {
  this.snackBar.open(message, '', {
    duration: 5000,
    panelClass: ['custom-sucess-snackbar'], 
    verticalPosition: 'bottom', 
    horizontalPosition: 'center' 
  });
}


}
