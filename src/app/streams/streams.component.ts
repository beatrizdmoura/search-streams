import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { Stream } from '../models/stream';
import { Game } from '../models/game';
import { TwitchService } from '../services/twitch.service';
import { Observable, of } from 'rxjs/index';
import { map, startWith, catchError, debounceTime } from 'rxjs/operators';
import { switchMap } from 'rxjs/internal/operators';

@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.scss']
})
export class StreamsComponent implements OnInit {
  limitOptions = [10, 20, 50];
  streams: Stream[];
  pageCursor: string;
  previousCursor: object;
  page: number;
  limit: number;
  private defaultLimit = this.limitOptions[1];

  searchControl = new FormControl();
  filteredGames: Observable<Game[]>;
  games: Game[];

  @ViewChild('searchStreams') searchStreamsInput: ElementRef<HTMLInputElement>;

  constructor(private twitchService: TwitchService) { }

  ngOnInit() {
    this.page = 1;
    this.limit = parseInt(localStorage.getItem('limit'), 10) || this.defaultLimit;
    this.games = [];
    this.getStreams();
    this.filteredGames = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        if (value !== '') {
          return this.searchGames(value);
        } else {
          return of(null);
        }
      }));
  }

  getStreams(cursor: object = {}): void {
    this.previousCursor = cursor;
    const gameIdsParam = this.games.length ? { game_id: this.games.map(game => game._id) } : {};
    const params = Object.assign(cursor, gameIdsParam, { first: this.limit });
    this.twitchService.getStreams(params)
      .subscribe(res => {
        this.streams = res.data.map(stream => {
          stream.thumbnail_url = stream.thumbnail_url.replace('{width}', '600').replace('{height}', '200');
          return stream;
        });
        this.pageCursor = res.pagination.cursor;
      });

  }

  updateLimit(): void {
    const previousLimit = parseInt(localStorage.getItem('limit'), 10);
    if (previousLimit !== this.limit) {
      this.page = Math.ceil(previousLimit * (this.page - 1) / this.limit) + 1;
    }
    localStorage.setItem('limit', `${this.limit}`);
    this.getStreams(this.previousCursor);
  }

  nextPage(): void {
    this.page++;
    this.getStreams({ after: this.pageCursor });
  }

  previousPage(): void {
    this.page--;
    this.getStreams({ before: this.pageCursor });
  }

  search(): void {
    this.page = 1;
    this.getStreams();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.games.push(event.option.value);
    this.searchStreamsInput.nativeElement.value = '';
    this.searchControl.setValue('');
  }

  remove(game: Game): void {
    const index = this.games.indexOf(game);

    if (index >= 0) {
      this.games.splice(index, 1);
      this.search();
    }
  }

  searchGames(term: string): Observable<Game[]> {
    return this.twitchService.searchGames(term).pipe(
      map(res => res.games)
    );
  }
}
