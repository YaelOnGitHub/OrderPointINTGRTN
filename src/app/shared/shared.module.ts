import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';

const MODULES = [CommonModule, RouterModule];

const COMPONENTS = [ThemeSwitcherComponent];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [...MODULES],
    exports: [...MODULES, ...COMPONENTS],
})

export class SharedModule { }
