import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  // Imagens convertidas para .jpg (mais compatível)
  services = [
    {
      title: 'CORTE',
      price: 'R$ 110.00',
      image: 'assets/cabelo-homem-corte.jpg' // Removi a barra inicial
    },
    {
      title: 'BARBA',
      price: 'R$ 40.00',
      image: 'assets/cortador-de-barba.jpg'
    },
    {
      title: 'CORTE + BARBA',
      price: 'R$ 140.00',
      image: 'assets/cabeloEbarba.jpg'
    }
  ];

  // trackBy para performance
  trackByTitle(index: number, item: { title: string }): string {
    return item.title;
  }

  // Método para tratar erros de imagem
  handleImageError(event: Event, service: any) {
    const imgElement = event.target as HTMLImageElement;
    console.warn(`Erro ao carregar imagem: ${service.image}`);
    imgElement.style.display = 'none';
    // Alternativamente, você pode definir uma imagem padrão:
    // imgElement.src = 'assets/imagem-padrao.jpg';
  }
}