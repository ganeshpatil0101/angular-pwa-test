import { Component, OnInit, Input } from '@angular/core';
import { Movie } from '../movie';

@Component({
  selector: 'app-movie-item',
  templateUrl: './movie-item.component.html',
  styleUrls: ['./movie-item.component.css']
})
export class MovieItemComponent implements OnInit {

  constructor() { }
  @Input() data:Movie;
  ngOnInit(): void {
    console.log('======> data',this.data);
  }
  edit(data) {
    console.log(data);
  }
}
