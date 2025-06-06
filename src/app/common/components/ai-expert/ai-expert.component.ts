import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { GreetingsComponent } from './greetings/greetings.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { TextboxComponent } from './textbox/textbox.component';

@Component({
  selector: 'app-ai-expert',
  templateUrl: './ai-expert.component.html',
  styleUrls: ['./ai-expert.component.scss']
})
export class AiExpertComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
