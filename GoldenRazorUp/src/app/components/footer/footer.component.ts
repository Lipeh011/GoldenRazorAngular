import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  
  socialLinks = [
    { 
      icon: 'facebook', 
      url: 'https://facebook.com' 
    },
    { 
      icon: 'instagram', 
      url: 'https://instagram.com' 
    },
    { 
      icon: 'twitter', 
      url: 'https://twitter.com' 
    }
  ];
}