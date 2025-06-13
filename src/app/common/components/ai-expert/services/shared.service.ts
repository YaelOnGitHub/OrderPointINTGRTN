import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  sendSuggest = new Subject<string>();
  sendTextInput = new Subject<string>();
  userName = new BehaviorSubject<string>('Guest');
  isTyping = new BehaviorSubject<boolean>(false);

  constructor() { }
}
