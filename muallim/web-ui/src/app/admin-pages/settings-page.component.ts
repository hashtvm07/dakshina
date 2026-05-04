import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-settings-page',
  imports: [ReactiveFormsModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly api = inject(ApiService);

  protected readonly form = this.formBuilder.group({
    heroTitle: [''],
    heroSubtitle: [''],
    heroDescription: [''],
    heroImageUrl: [''],
    bannerImageUrl: [''],
    aboutTitle: [''],
    aboutBody: [''],
    registerEnabled: [true]
  });

  constructor() {
    this.api.get<any>('siteSettings').subscribe((settings) => this.form.patchValue(settings));
  }

  protected save() {
    this.api.put('siteSettings', this.form.getRawValue()).subscribe();
  }
}
