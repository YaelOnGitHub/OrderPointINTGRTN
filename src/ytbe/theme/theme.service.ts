import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class ThemeService {
    theme: ReplaySubject<string> = new ReplaySubject<string>(1);
}
