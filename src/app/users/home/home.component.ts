import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserControlService } from '../service/user-control.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  showAiExpert$ = this.userControl.showAiExpert;
  private subscriptions: Subscription[] = [];

  constructor(private userControl: UserControlService) {}

  ngOnInit(): void {
    // console.log('HomeComponent');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
