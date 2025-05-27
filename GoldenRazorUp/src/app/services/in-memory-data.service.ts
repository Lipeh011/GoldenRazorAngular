// src/app/services/in-memory-data.service.ts
import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    return {
      users: [],
      barbeiros: [
        { id: 1, email: 'barbeiro@example.com', senha: 'Barbeiro123!', role: 'barbeiro' }
      ]
    };
  }
}