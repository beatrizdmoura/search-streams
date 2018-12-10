import { Component, OnInit, Input } from '@angular/core';
import { Stream } from '../models/stream';

@Component({
  selector: 'app-stream-info',
  templateUrl: './stream-info.component.html',
  styleUrls: ['./stream-info.component.scss']
})
export class StreamInfoComponent implements OnInit {

  @Input() stream: Stream;

  constructor() { }

  ngOnInit() {
  }

}
