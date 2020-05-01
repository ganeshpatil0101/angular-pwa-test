import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from '../movie';

@Component({
  selector: 'app-movie-item',
  templateUrl: './movie-item.component.html',
  styleUrls: ['./movie-item.component.css']
})
export class MovieItemComponent implements OnInit {

  constructor() { }
  @Input() data:any;
  @Output() onedit = new EventEmitter();
  ngOnInit(): void {
  }
  edit(data:any) {
    this.onedit.emit(data);
  }
}
