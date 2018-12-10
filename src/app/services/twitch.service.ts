import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Stream } from '../models/stream';
import  { User } from '../models/user';
import { Game } from '../models/game';
import { Observable } from 'rxjs';
import { stringify } from 'querystring';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TwitchService {
  private apiUrl = 'https://api.twitch.tv/helix/';
  private v5ApiUrl = 'https://api.twitch.tv/kraken/';
  private streamsEndpoint = 'streams/';
  private usersEndpoint = 'users/';
  private gamesEndpoint = 'games/';
  private headers = {headers: new HttpHeaders().append('Client-ID', environment.clientId)};

  constructor(private http: HttpClient) { }

  getStreamsUrl(params: object): string {
    const endpoint = `${this.apiUrl}${this.streamsEndpoint}`;
    return `${endpoint}?${stringify(params)}`;
  }

  getStreams(params: object): Observable<{data: Stream[], pagination: {cursor: string}}> {
    return this.http.get<{data: Stream[], pagination: {cursor: string}}>(
      this.getStreamsUrl(params),
      this.headers
    );
  }

  getStream(user_id: number): Observable<{data: Stream[]}> {
    return this.http.get<{data: Stream[]}>(
      `${this.apiUrl}${this.streamsEndpoint}?user_id=${user_id}`,
      this.headers
    );
  }

  getUser(id: number): Observable<{data: User[]}> {
    return this.http.get<{data: User[]}>(
      `${this.apiUrl}${this.usersEndpoint}?id=${id}`,
      this.headers
    );
  }

  searchGames(term: string): Observable<{games: Game[]}> {
    return this.http.get<{games: Game[]}>(
      `${this.v5ApiUrl}search/${this.gamesEndpoint}?query=${term}`,
      {headers: this.headers.headers.append('Accept', 'application/vnd.twitchtv.v5+json')}
    );
  }

}
