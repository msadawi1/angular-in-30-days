import { Component } from '@angular/core';
import { IndicatorComponent } from './indicator/indicator.component';
import { StatusBreakdownComponent } from './status-breakdown/status-breakdown.component';
import { NeedsAttentionComponent } from './needs-attention/needs-attention.component';
import { ByRelationshipComponent } from './by-relationship/by-relationship.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    IndicatorComponent,
    StatusBreakdownComponent,
    NeedsAttentionComponent,
    ByRelationshipComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
