import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'client' | 'barber';
  preferences?: {
    serviceType: string;
  };
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar    // ← injetado para showMessage()
  ) {
    this.initializeMockData();
    this.loadUserFromStorage();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const response = this.handleLogin(email, password);
    return of(response).pipe(
      delay(500),
      tap(res => {
        if (res.success && res.user) {
          this.currentUser = res.user;
          localStorage.setItem('currentUser', JSON.stringify(res.user));
          this.redirectBasedOnRole(res.user.role);
        }
      })
    );
  }

  register(userData: Omit<User, 'id' | 'role' | 'preferences'>): Observable<AuthResponse> {
    return of(this.handleRegister(userData)).pipe(
      delay(500),
      tap(response => {
        if (response.success && response.user) {
          this.currentUser = response.user;
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.redirectBasedOnRole(response.user.role);
        }
      })
    );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  isBarber(): boolean {
    return this.currentUser?.role === 'barber';
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // ← Novos métodos para o UserPanelComponent
  updateUser(updatedUser: User): void {
    const users = this.getAllUsers().map(u =>
      u.id === updatedUser.id ? updatedUser : u
    );
    localStorage.setItem('users', JSON.stringify(users));

    if (this.currentUser?.id === updatedUser.id) {
      this.currentUser = updatedUser;
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  }

  showMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
  // Fim dos métodos novos

  getUsers(): Observable<User[]> {
    return of(this.getAllUsers()).pipe(delay(500));
  }

  getClients(): Observable<User[]> {
    const users = this.getAllUsers();
    return of(users.filter(u => u.role === 'client')).pipe(delay(500));
  }

  getBarbeiros(): Observable<User[]> {
    const users = this.getAllUsers();
    return of(users.filter(u => u.role === 'barber')).pipe(delay(500));
  }

  manageBarber(barber: User, action: 'create' | 'update' | 'delete'): Observable<AuthResponse> {
    let users = this.getAllUsers();
    try {
      switch (action) {
        case 'create':
          if (users.some(u => u.email === barber.email)) {
            throw new Error('E-mail já cadastrado');
          }
          barber.id = this.generateId(users);
          barber.role = 'barber';
          users.push(barber);
          break;
        case 'update':
          users = users.map(u => u.id === barber.id ? { ...barber, role: 'barber' } : u);
          break;
        case 'delete':
          if (barber.id === this.currentUser?.id) {
            throw new Error('Não pode se auto-excluir');
          }
          users = users.filter(u => u.id !== barber.id);
          break;
      }
      localStorage.setItem('users', JSON.stringify(users));
      return of({ success: true }).pipe(delay(500));
    } catch (error) {
      return of({
        success: false,
        message: error instanceof Error ? error.message : 'Erro na operação'
      }).pipe(delay(500));
    }
  }

  manageClient(client: User, action: 'update' | 'delete'): Observable<AuthResponse> {
    let users = this.getAllUsers();
    try {
      switch (action) {
        case 'update':
          users = users.map(u => u.id === client.id ? client : u);
          break;
        case 'delete':
          users = users.filter(u => u.id !== client.id);
          break;
      }
      localStorage.setItem('users', JSON.stringify(users));
      return of({ success: true }).pipe(delay(500));
    } catch (error) {
      return of({
        success: false,
        message: error instanceof Error ? error.message : 'Erro na operação'
      }).pipe(delay(500));
    }
  }

  private initializeMockData(): void {
    if (!localStorage.getItem('users')) {
      const mockUsers: User[] = [
        {
          id: 1,
          name: 'Carlos Barbeiro',
          email: 'barber@example.com',
          password: 'barber123',
          phone: '(11) 9999-8888',
          role: 'barber'
        },
        {
          id: 2,
          name: 'Cliente Teste',
          email: 'client@example.com',
          password: 'client123',
          phone: '(11) 5555-4444',
          role: 'client'
        }
      ];
      localStorage.setItem('users', JSON.stringify(mockUsers));
    }
  }

  private handleLogin(email: string, password: string): AuthResponse {
    const users = this.getAllUsers();
    const user = users.find(u =>
      u.email === email &&
      u.password === password
    );

    return user
      ? { success: true, user }
      : { success: false, message: 'Credenciais inválidas' };
  }

  private handleRegister(userData: Omit<User, 'id' | 'role' | 'preferences'>): AuthResponse {
    const users = this.getAllUsers();
    if (users.some(u => u.email === userData.email)) {
      return { success: false, message: 'Este e-mail já está cadastrado' };
    }
    const newUser: User = {
      id: this.generateId(users),
      ...userData,
      role: 'client'
    };
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    return { success: true, user: newUser };
  }

  private getAllUsers(): User[] {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  private generateId(users: User[]): number {
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  }

  private redirectBasedOnRole(role: 'client' | 'barber'): void {
    const targetRoute = role === 'barber' ? '/barber' : '/user';
    this.router.navigate([targetRoute]);
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('currentUser');
    this.currentUser = user ? JSON.parse(user) : null;
  }
}
