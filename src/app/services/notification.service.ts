import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  text$ = new BehaviorSubject<string>('');

  getNotifyText(): Observable<string> {
    return this.text$.asObservable();
  }

  updateText(text: string) {
    this.text$.next(text);
    setTimeout(() => {
      this.text$.next('');
    }, 4000);
  }
}
