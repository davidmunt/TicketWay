import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConcertFormComponent } from '../../shared/form-concert/form-concert.component';

@Component({
  selector: 'app-form-concert',
  templateUrl: './form-concert.component.html',
  styleUrls: ['./form-concert.component.css'],
  standalone: true,
  imports: [CommonModule, ConcertFormComponent],
})
export class FormConcertComponent {}
