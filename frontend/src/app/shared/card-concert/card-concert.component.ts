import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Concert } from '../../core/models';
import { ConcertService } from '../../core/services';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-concert',
  templateUrl: './card-concert.component.html',
  styleUrls: ['./card-concert.component.css'],
  standalone: true,
  imports: [RouterLink, CommonModule],
})
export class CardConcertComponent implements OnInit {
  @Input() concert: Concert = {} as Concert;
  @Output() deleted = new EventEmitter<string>();

  constructor(private concertService: ConcertService) {}

  ngOnInit(): void {}

  deleteConcert(slug: string) {
    this.concertService.delete_concert(slug).subscribe({
      next: (res) => {
        this.deleted.emit(slug);
      },
      error: (err) => {
        console.error('Error deleting concert', err);
      },
    });
  }
}
