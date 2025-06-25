import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";
@Component({
  selector: 'app-root',

  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: '<router-outlet></router-outlet>',

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'

})
export class AppComponent { title = 'AdviLaw';}



