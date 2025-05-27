import { Injectable } from '@angular/core';
import { Appointment } from '../models/appointment.model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private storageKey = 'userAppointments';

  private getAll(): Appointment[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  list(): Observable<Appointment[]> {
    return of(this.getAll()).pipe(delay(200));
  }

  create(service: string, date: string): Observable<Appointment> {
    const apps = this.getAll();
    const newApp: Appointment = {
      id: apps.length > 0 ? Math.max(...apps.map(a => a.id)) + 1 : 1,
      service,
      date,
      status: 'Agendado'
    };
    apps.unshift(newApp);
    localStorage.setItem(this.storageKey, JSON.stringify(apps));
    return of(newApp).pipe(delay(200));
  }
}
