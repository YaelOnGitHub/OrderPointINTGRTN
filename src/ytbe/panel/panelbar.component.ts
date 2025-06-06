import { Component, OnInit, ContentChildren, AfterContentInit, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { PanelComponent } from './panel.component';
import { PanelbarType } from '../panel/panelbar-type.enum';

/**
 * Container for a set of expandable/collapsible panels
 * */
@Component({
  selector: 'ytbe-panelbar',
  templateUrl: './panelbar.component.html',
  styleUrls: ['./panelbar.component.scss'],
  host: { 'class': 'y-panelbar' },
  encapsulation: ViewEncapsulation.None
})
export class PanelbarComponent implements OnInit, AfterContentInit {

  @ContentChildren(PanelComponent) panels: PanelComponent[] = [];

  private _expandedIndices: number[] = [];

  @Input() panelbarType: PanelbarType = PanelbarType.default;

  @Output() expandedIndicesChange: EventEmitter<number[]> = new EventEmitter<number[]>();
  get expandedIndices(): number[] { return this._expandedIndices; }
  @Input() set expandedIndices(indices: number[]) {
    this._expandedIndices = indices;
    if (this.panels) {
      this.panels.forEach((p, i) => {
        p.expanded = this.expandedIndices.indexOf(i) >= 0;
      });
    }
  };
   
  constructor() { }

  private collapseHandler(panel: PanelComponent) {
    this._expandedIndices = [];
    if (this.panelbarType !== PanelbarType.default) {
      panel.collapsed = false;
    }
    this.panels.forEach((p, i) => {
      if (this.panelbarType !== PanelbarType.default && p != panel) {
        p.collapsed = true;
      }
      if (p.expanded) this._expandedIndices.push(i); //Update array holding list of expanded indices
    });
    this.expandedIndicesChange.emit(this._expandedIndices);
  }

  ngOnInit() {
  }
  ngAfterContentInit(): void {
    this.panels.forEach((p, i) => {
      p.collapsible = true;
      p.collapsed = this.expandedIndices.indexOf(i) < 0;
      p.collapsedChange.subscribe(x => { this.collapseHandler(p) });
    });
  }

}
