import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';
import { TwitchService } from '../services/twitch.service';
import { Stream } from '../models/stream';
import { User } from '../models/user';

@Component({
  selector: 'app-stream-detail',
  templateUrl: './stream-detail.component.html',
  styleUrls: ['./stream-detail.component.scss']
})
export class StreamDetailComponent implements OnInit, OnDestroy  {
  userId: number;
  stream: Stream;
  user: User;
  private sub: any;
  playerLink: any;
  _setIntervalHandler: any;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private twitchService: TwitchService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.userId = params['user_id'];
      this.getUser();
      this.getStream();
      this.setRefreshStream();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getUser(): void {
    this.twitchService.getUser(this.userId).subscribe(res => {
      this.user = res.data[0];
      this.playerLink = this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.twitch.tv/?channel=${this.user.login}&muted=false`);
    });
  }

  getStream(): void {
    this.twitchService.getStream(this.userId).subscribe(res => {
      this.stream = res.data[0];
    });
  }

  setRefreshStream(): void {
    this._setIntervalHandler = window.setInterval(() => {
      this.getStream();
    }, 5000);
  }
}
