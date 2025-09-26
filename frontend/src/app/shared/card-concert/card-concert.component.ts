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

  dia: number;
  mes: string;
  concLength: number;

  ngOnInit(): void {
    const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    const fecha = new Date(this.concert.date);
    this.dia = fecha.getDate();
    let month = fecha.getMonth();
    this.mes = meses[month];
    this.concLength = Object.keys(this.concert).length;
  }
}
