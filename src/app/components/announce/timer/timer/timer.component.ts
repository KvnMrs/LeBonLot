import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, interval, map } from 'rxjs';
import { AnnouncesService } from 'src/app/services/announce/announces.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit {
  @Input() hideText? = false;
  @Input() announceId: string
  @Input() endDate: number
  timer$: Subscription = new Subscription();
  private timeDiff$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  timerValue = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  constructor(private announceService: AnnouncesService) {}

  ngOnInit(): void {
    if (this.endDate > 0) {
    this.timer$ = this.createTimerObservable(this.endDate)
      .subscribe((v: number) => {
        this.timeDiff$.next(v);
      });
    this.timeDiff$
      .pipe(map((diff) => this.calculateTimeValues(diff)))
      .subscribe((values) => {
        this.timerValue = values;
      });
    } else {
      this.announceService.deleteAnnounceById(this.announceId)
    }
  }

  createTimerObservable(endDate: number): Observable<number> {
    const time = interval(1000).pipe(map(() => endDate + new Date().getTime()));
    return time;
  }

  calculateTimeValues(diffInMillis: number): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } {
    const days = Math.floor(diffInMillis / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diffInMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((diffInMillis % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffInMillis % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  get getDays(): number {
    return this.timerValue.days;
  }

  get getHours(): number {
    return this.timerValue.hours;
  }

  get getMinutes(): number {
    return this.timerValue.minutes;
  }

  get getSeconds(): number {
    return this.timerValue.seconds;
  }

  ngOnDestroy() {
    this.timer$.unsubscribe();
  }
}