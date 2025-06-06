import { Component } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent {
  isFadingOut = false;
  isHidden = false;
  isProcessing = false;

  constructor(private sharedService: SharedService) {
    this.sharedService.sendSuggest.subscribe(() => {
      this.SuggestFadeOut();
    });
  }

  SuggestFadeOut() {
    this.isFadingOut = true;
    setTimeout(() => {
      this.isHidden = true;
    }, 500);
  }
  
  handleSuggestionClick(text: string) {
    if (!this.isProcessing) {
      this.isProcessing = true;
      this.sharedService.sendSuggest.next(text);
      this.SuggestFadeOut();
      
      // Reset the processing flag after a short delay
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    }
  }
}
