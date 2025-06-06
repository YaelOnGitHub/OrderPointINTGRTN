import { Component, EventEmitter, Output, PLATFORM_ID, Inject, ChangeDetectorRef, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../services/shared.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-textbox',
  templateUrl: './textbox.component.html',
  styleUrls: ['./textbox.component.scss']
})
export class TextboxComponent {
  @ViewChild('messageTextarea') messageTextarea!: ElementRef;
  inputText: string = '';
  isMicEnable: boolean = false;
  recognition: SpeechRecognition | null = null;
  finalTranscript: string = '';

  @Output() sendMessage = new EventEmitter<string>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    public sharedService: SharedService
  ) {
    // Initialize speech recognition only in browser environment
    if (isPlatformBrowser(this.platformId)) {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              // Capitalize the first letter of each final transcript
              const capitalizedTranscript = transcript.charAt(0).toUpperCase() + transcript.slice(1);
              this.finalTranscript += capitalizedTranscript + ' ';
            } else {
              // For interim results, only capitalize if it's the start of a new sentence
              if (this.finalTranscript === '' && interimTranscript === '') {
                interimTranscript = transcript.charAt(0).toUpperCase() + transcript.slice(1);
              } else {
                interimTranscript += transcript;
              }
            }
          }

          // Only update textarea if we're actively listening and haven't just sent a message
          if (this.isMicEnable) {
            const textarea = document.querySelector('textarea');
            if (textarea) {
              const combinedText = this.finalTranscript + interimTranscript;
              textarea.value = combinedText;
              // Run the update inside NgZone to ensure change detection
              this.ngZone.run(() => {
                this.inputText = combinedText;
                this.cdr.detectChanges();
                // Maintain focus on textarea
                textarea.focus();
              });
            }
          }
        };

        this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          this.isMicEnable = false;
        };

        this.recognition.onend = () => {
          if (this.isMicEnable && this.recognition) {
            this.recognition.start();
            // Maintain focus on textarea when restarting recognition
            if (this.messageTextarea) {
              this.messageTextarea.nativeElement.focus();
            }
          }
        };
      }
    }
  }

  toggleMic() {
    if (!this.recognition) {
      console.error('Speech recognition not supported');
      return;
    }

    if (this.isMicEnable) {
      this.recognition.stop();
      this.isMicEnable = false;
      // Reset placeholder when stopping voice recognition
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.placeholder = 'Ask anything';
        textarea.focus();
      }
    } else {
      // Clear any existing text when starting voice recognition
      this.inputText = '';
      this.finalTranscript = '';
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.value = '';
        textarea.placeholder = 'Listening...';
        textarea.focus();
      }
      this.recognition.start();
      this.isMicEnable = true;
    }
  }

  handleSend() {
    // Check if we're currently typing or if there's no text to send
    if (this.sharedService.isTyping.getValue() || !this.inputText.trim()) {
      return;
    }

    // Stop voice recognition if it's active
    if (this.isMicEnable && this.recognition) {
      this.recognition.stop();
      this.isMicEnable = false;
    }

    this.sharedService.sendTextInput.next(this.inputText.trim());
    this.sharedService.sendSuggest.next('');
    
    // Clear all text-related variables
    this.inputText = '';
    this.finalTranscript = '';
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = '';
      textarea.placeholder = 'Ask anything';
      textarea.focus();
    }
  }
}
