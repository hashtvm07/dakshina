import { Component, signal } from '@angular/core';
import { ApplicationsManagementComponent } from './applications-management.component';
import { AdmissionsListComponent } from './admissions-list.component';

@Component({
  selector: 'app-admissions-panel',
  imports: [ApplicationsManagementComponent, AdmissionsListComponent],
  templateUrl: './admissions-panel.component.html',
  styleUrl: './admissions-panel.component.css',
})
export class AdmissionsPanelComponent {
  protected readonly activeTab = signal<'applications' | 'admissions'>('applications');

  protected showTab(tab: 'applications' | 'admissions') {
    this.activeTab.set(tab);
  }
}
