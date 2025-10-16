import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Concert } from "../../core/models";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-card-concert",
  templateUrl: "./card-concert.component.html",
  styleUrls: ["./card-concert.component.css"],
  standalone: true,
  imports: [RouterLink, CommonModule],
})
export class CardConcertComponent implements OnInit {
  @Input() concert: Concert = {} as Concert;
  @Input() artists: any[];
  @Input() venues: any[];

  dia: number;
  mes: string;
  anyo: number;
  horario: string;
  concLength: number;

  ngOnInit(): void {
    const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    const fecha = new Date(this.concert.date);
    this.dia = fecha.getDate();
    let month = fecha.getMonth();
    let hora = fecha.getHours();
    this.anyo = fecha.getFullYear();
    let minutes = fecha.getMinutes().toString().padStart(2, "0");
    this.horario = `${hora} : ${minutes}`;
    this.mes = meses[month];
    this.concLength = Object.keys(this.concert).length;
  }

  get artistName(): string {
    return this.artists.find((a) => a._id === this.concert.artist)?.name || "Sin artista";
  }

  get venueName(): string {
    return this.venues.find((v) => v.venue_id === this.concert.venue)?.name || "Sin venue";
  }
}
