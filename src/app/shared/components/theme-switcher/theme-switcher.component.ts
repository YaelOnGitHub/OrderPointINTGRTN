import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ThemeService } from '@bcodes/ngx-theme-service';
import { MainService } from '../../services/main.service';

@Component({
    selector: 'app-theme-switcher',
    template: `
        <!-- <div #themeSwitcher>
            <a
                role="button"
                (click)="handleSwitcherClick($event)"
                [routerLink]=""
            >App
                <fa-icon [icon]="['fas', 'fill-drip']"></fa-icon>
            </a> -->
            <ul class="theme-menu" *ngIf="switcherVisible">
                <li
                    (click)="handleThemeSelected($event, 'light')"
                    [class.selected]="(selected$ | async) === 'light'"
                    title="Light"
                >
                <i class="fa fa-sun-o"></i>
                </li>
                <li
                    (click)="handleThemeSelected($event, 'dark')"
                    [class.selected]="(selected$ | async) === 'dark'" title="Dark"
                >
                

                <i class="fa fa-moon-o"></i>
                </li>
            </ul>
        <!-- </div> -->
    `,
    styleUrls: ['./theme-switcher.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcherComponent implements OnInit {
    @ViewChild('themeSwitcher', { static: false })
    themeSwitcher!: ElementRef<HTMLElement>;

    selected$ = this.themeService.selectedTheme$;

    switcherVisible = true;   // = false

    constructor(public mainService: MainService, private themeService: ThemeService) { }

    ngOnInit(): void {
        // console.log('ThemeSwitcherComponent');
        // this.getCurrentTheme()
    }

    // handleSwitcherClick(event: any = null) {
    //     this.switcherVisible = !this.switcherVisible;
    // }

    handleThemeSelected({ currentTarget }: any, theme: string) {
        if ((currentTarget as HTMLElement).classList.contains('selected')) {
            return;
        }
        const themeId = theme === 'dark' ? 2 : 1;

        // User not change theme
        // this.mainService.setTheme(themeId).subscribe(data => {
        //     // console.log(data);
        //     this.mainService.currentTheme.next(theme);
        //     this.themeService.switchTheme(theme);
        // });
        
    }

    // @HostListener('document:mousedown', ['$event.target'])
    // handleMouseDown(target: HTMLElement) {
    //     if (
    //         !this.themeSwitcher.nativeElement.contains(target) &&
    //         this.switcherVisible
    //     ) {
    //         this.handleSwitcherClick();
    //     }
    // }

      getCurrentTheme(): any {
        this.mainService.getThemeType.subscribe(data => {
          if (data.themeType === 0) {
            this.mainService.currentTheme.next('light');
            this.themeService.switchTheme('light');
          }
          if (data.themeType === 1) {
            this.mainService.currentTheme.next('light');
            this.themeService.switchTheme('light');
          }
          if (data.themeType === 2) {
            this.mainService.currentTheme.next('dark');
            this.themeService.switchTheme('dark');
          }
        });
      }
}
