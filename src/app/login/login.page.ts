// login.page.ts
import { Component } from '@angular/core';
import { ExploreContainerComponent } from '../explore-container/explore-container';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, ExploreContainerComponent],
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {}
