import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { CommonModule } from '@angular/common';

// Importe os módulos do Swiper que serão usados
Swiper.use([Navigation, Pagination, Autoplay]);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  galleryImages: string[] = [
    'assets/images/corte-1.jpg',
    'assets/images/corte-2.jpg',
    'assets/images/corte-3.jpg',
    'assets/images/corte-4.jpg',
    'assets/images/corte-5.jpg',
    'assets/images/corte-6.jpg',
    'assets/images/corte-7.jpg',
    'assets/images/corte-8.jpg',
  ];

  ngAfterViewInit() {
    const swiper = new Swiper('.mySwiper', {
      // Configurações básicas
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      centeredSlides: true,
      
      // Módulos
      modules: [Navigation, Pagination, Autoplay],
      
      // Autoplay
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      
      // Navegação
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        disabledClass: 'swiper-button-disabled'
      },
      
      // Paginação
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
      },
      
      // Breakpoints responsivos
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 40
        }
      }
    });
  }
}