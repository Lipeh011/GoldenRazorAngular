export interface Appointment {
  id: number;
  service: string;         // ex: “Corte de Cabelo”
  date: string;            // ISO string, ex: “2025-05-17T14:30:00.000Z”
  status: 'Agendado' | 'Confirmado' | 'Pendente' | 'Cancelado';
}