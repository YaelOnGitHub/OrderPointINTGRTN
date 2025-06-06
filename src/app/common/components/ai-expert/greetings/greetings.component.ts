import { Component } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-greetings',
  templateUrl: './greetings.component.html',
  styleUrls: ['./greetings.component.scss']
})
export class GreetingsComponent {
  isFadingOut = false;
  isHidden = false;

  constructor(public sharedService: SharedService) {
    this.sharedService.sendSuggest.subscribe(() => {
      this.GreetFadeOut();
    });
  }

  GreetFadeOut() {
    this.isFadingOut = true;
    setTimeout(() => {
      this.isHidden = true;
    }, 500);
  }
}
