import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config'; // Note a mudança no nome da importação

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));