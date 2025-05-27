import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService, User } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-barber-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FontAwesomeModule],
  templateUrl: './barber-panel.component.html',
  styleUrls: ['./barber-panel.component.scss']
})
export class BarberPanelComponent implements OnInit {
  clients: User[] = [];
  barbers: User[] = [];
  isLoadingClients = true;
  isLoadingBarbers = true;
  isSubmitting = false;

  // Formulários para Barbeiros
  barberForm: FormGroup;
  editForm: FormGroup;
  
  // Formulários para Clientes (NOVO)
  clientEditForm: FormGroup;
  
  // Controles de Modais
  showEditModal = false;
  showClientEditModal = false; // NOVO
  currentBarber: User | null = null;
  currentClient: User | null = null; // NOVO

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    // Formulário de Criação de Barbeiros
    this.barberForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['']
    });

    // Formulário de Edição de Barbeiros
    this.editForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });

    // NOVO: Formulário de Edição de Clientes
    this.clientEditForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loadClients();
    this.loadBarbers();
  }

  private loadClients(): void {
    this.isLoadingClients = true;
    this.authService.getClients().pipe(
      finalize(() => this.isLoadingClients = false)
    ).subscribe({
      next: (clients) => this.clients = clients,
      error: () => this.showError('Falha ao carregar clientes')
    });
  }

  private loadBarbers(): void {
    this.isLoadingBarbers = true;
    this.authService.getBarbeiros().pipe(
      finalize(() => this.isLoadingBarbers = false)
    ).subscribe({
      next: (barbers) => this.barbers = barbers,
      error: () => this.showError('Falha ao carregar barbeiros')
    });
  }

  // Métodos para Barbeiros
  addBarber(): void {
    if (this.barberForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const newBarber: User = {
      ...this.barberForm.value,
      role: 'barber'
    };

    this.authService.manageBarber(newBarber, 'create').pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: () => {
         this.showSucess('Barbeiro cadastrado com sucesso!');
        this.barberForm.reset();
        this.loadBarbers();
      },
      error: (error) => this.showError(error.message || 'Erro no cadastro')
    });
  }

  deleteBarber(barberId: number): void {
    const confirmation = confirm('Tem certeza que deseja excluir este barbeiro?');
    if (!confirmation) return;

    this.authService.manageBarber({ id: barberId } as User, 'delete').subscribe({
      next: () => {
        this.showSucess('Barbeiro removido!');
        this.loadBarbers();
      },
      error: (error) => this.showError(error.message || 'Erro na exclusão')
    });
  }

  // Métodos para Clientes (ATUALIZADOS)
  deleteClient(clientId: number): void {
    const confirmation = confirm('Tem certeza que deseja excluir este cliente?');
    if (!confirmation) return;

    this.authService.manageClient({ id: clientId } as User, 'delete').subscribe({
      next: () => {
        this.showSucess('Cliente removido com sucesso !');
        this.loadClients();
      },
      error: (error) => this.showError(error.message || 'Erro na exclusão')
    });
  }

  openClientEditModal(client: User): void { // NOVO
    this.currentClient = client;
    this.clientEditForm.patchValue({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone || ''
    });
    this.showClientEditModal = true;
  }

  updateClient(): void { // NOVO
    if (this.clientEditForm.invalid || !this.currentClient || this.isSubmitting) return;

    this.isSubmitting = true;
    const updatedClient: User = {
      ...this.currentClient,
      ...this.clientEditForm.value
    };

    this.authService.manageClient(updatedClient, 'update').pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: () => {
        this.showSucess('Dados do cliente atualizados com sucesso!');
        this.closeClientModal();
        this.loadClients();
      },
      error: (error) => this.showError(error.message || 'Erro na atualização')
    });
  }

  // Métodos Comuns
  openEditModal(barber: User): void {
    this.currentBarber = barber;
    this.editForm.patchValue({
      id: barber.id,
      name: barber.name,
      email: barber.email,
      phone: barber.phone || ''
    });
    this.showEditModal = true;
  }

  updateBarber(): void {
    if (this.editForm.invalid || !this.currentBarber || this.isSubmitting) return;

    this.isSubmitting = true;
    const updatedBarber: User = {
      ...this.currentBarber,
      ...this.editForm.value
    };

    this.authService.manageBarber(updatedBarber, 'update').pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: () => {
        this.snackBar.open('Dados atualizados!', 'Fechar', { duration: 3000 });
        this.closeModal();
        this.loadBarbers();
      },
      error: (error) => this.showError(error.message || 'Erro na atualização')
    });
  }

  closeModal(): void {
    this.showEditModal = false;
    this.currentBarber = null;
    this.editForm.reset();
  }

  closeClientModal(): void { // NOVO
    this.showClientEditModal = false;
    this.currentClient = null;
    this.clientEditForm.reset();
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