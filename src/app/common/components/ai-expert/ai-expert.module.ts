import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiExpertComponent } from './ai-expert.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { GreetingsComponent } from './greetings/greetings.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { TextboxComponent } from './textbox/textbox.component';
import { SharedService } from './services/shared.service';

@NgModule({
  declarations: [
    AiExpertComponent,
    ChatboxComponent,
    GreetingsComponent,
    SuggestionsComponent,
    TextboxComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    SharedService
  ],
  exports: [
    AiExpertComponent,
    ChatboxComponent,
    GreetingsComponent,
    SuggestionsComponent,
    TextboxComponent
  ]
})
export class AiExpertModule { } 