import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-muallim-profile-page',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './muallim-profile-page.component.html',
  styleUrl: './muallim-profile-page.component.scss'
})
export class MuallimProfilePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);

  protected muallim: any;
  protected message = '';
  protected saving = false;

  protected readonly form = this.formBuilder.group({
    name: [''],
    email: [''],
    phone: [''],
    address: [''],
    bio: [''],
    fatherName: [''],
    dateOfBirth: [''],
    maritalStatus: [''],
    schoolEducation: [''],
    islamicEducation: [''],
    presentInstituteName: [''],
    workAddress: [''],
    district: [''],
    meghala: [''],
    positionDesignation: [''],
    monthlySalary: [''],
    health: ['']
  });

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const publicId = params.get('publicId');
      if (!publicId) {
        return;
      }

      this.api.getByPath<any>(`/api/muallims/${publicId}`).subscribe((muallim) => {
        this.muallim = muallim;
        this.form.patchValue(muallim);
      });
    });
  }

  protected get canEdit() {
    return this.muallim ? this.auth.canEditMuallim(this.muallim.publicId) : false;
  }

  protected saveProfile() {
    if (!this.muallim || !this.canEdit) {
      return;
    }

    this.saving = true;
    this.message = '';

    this.api.putByPath<any>(`/api/muallims/${this.muallim.publicId}`, this.form.getRawValue()).subscribe({
      next: (muallim) => {
        this.muallim = muallim;
        this.form.patchValue(muallim);
        this.message = 'Profile updated.';
      },
      error: () => {
        this.message = 'Unable to update profile.';
        this.saving = false;
      },
      complete: () => {
        this.saving = false;
      }
    });
  }
}
