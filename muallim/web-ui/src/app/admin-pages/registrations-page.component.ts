import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, startWith, switchMap } from 'rxjs';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-registrations-page',
  imports: [ReactiveFormsModule, AsyncPipe, NgFor, NgIf],
  templateUrl: './registrations-page.component.html',
  styleUrl: './registrations-page.component.scss'
})
export class RegistrationsPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly draftStorageKey = 'muallim-admin-registration-draft';

  protected readonly sections = [
    'Login',
    'Identification',
    'Education',
    'Professional',
    'Family',
    'Bank',
    'Assistance',
    'Verification'
  ];
  protected readonly maritalStatuses = ['Single', 'Married', 'Widowed', 'Divorced'];
  protected readonly qualifications = [
    'Volume Training Course',
    'Maqsad Training',
    'Hifz Service Course',
    'Volume Lower/Higher',
    'Other'
  ];
  protected readonly courseOptions = [
    { code: '101', label: 'UP Section 4-7' },
    { code: '201', label: 'Secondary level' },
    { code: '301', label: 'Higher Secondary level' }
  ];
  protected readonly districts = [
    'Kasaragod',
    'Kannur',
    'Wayanad',
    'Kozhikode',
    'Malappuram',
    'Palakkad',
    'Thrissur',
    'Ernakulam',
    'Idukki',
    'Kottayam',
    'Alappuzha',
    'Pathanamthitta',
    'Kollam',
    'Thiruvananthapuram'
  ];
  protected readonly healthOptions = [
    'No known disease',
    'Diabetes',
    'Hypertension',
    'Heart disease',
    'Kidney disease',
    'Respiratory disease',
    'Other'
  ];
  protected readonly rationCards = ['Pink', 'Yellow', 'Blue', 'White'];
  protected readonly homeStatuses = ['Rent', 'Own', 'Hut', 'Terrace', 'Other'];
  protected readonly banks = [
    'State Bank of India',
    'Canara Bank',
    'Federal Bank',
    'South Indian Bank',
    'Kerala Gramin Bank',
    'Union Bank of India',
    'Indian Bank',
    'Other'
  ];
  protected readonly certificateOptions = [
    'Photo ID',
    'Aadhaar Copy',
    'Education Certificate',
    'Training Certificate',
    'Bank Passbook',
    'Medical Certificate',
    'Ration Card'
  ];
  private readonly assistanceOrganizations = [
    'DKIMV Board',
    'Welfare Fund',
    'Lajanathul Muallimeen',
    'Central Committee',
    'Regional Assistance'
  ];

  protected saving = false;
  protected admittingPublicId = '';
  protected submitMessage = '';
  protected draftMessage = '';
  protected activeSectionIndex = 0;

  protected readonly searchForm = this.formBuilder.group({
    query: ['']
  });

  protected readonly registrationForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(160)]],
    phone: ['', [Validators.required, Validators.maxLength(20)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
    confirmPassword: ['', [Validators.required]],
    photoFileName: [''],
    name: ['', [Validators.required, Validators.maxLength(120)]],
    fatherName: [''],
    dateOfBirth: [''],
    aadhaarNumber: ['', [Validators.maxLength(12)]],
    maritalStatus: [''],
    schoolEducation: [''],
    islamicEducation: [''],
    aadhaarQualification: ['', Validators.required],
    presentInstituteName: [''],
    currentlyWorkingHere: [true],
    workAddress: [''],
    district: [''],
    meghala: [''],
    positionDesignation: [''],
    monthlySalary: [''],
    workStartingDate: [''],
    health: [''],
    rationCardColor: [''],
    familyMembers: this.formBuilder.array([this.createFamilyMember()]),
    homeStatus: [''],
    houseSquareFeet: [''],
    bankName: [''],
    beneficiaryName: [''],
    accountNumber: [''],
    ifscCode: [''],
    branch: [''],
    previousFinancialAssistance: this.formBuilder.array(
      this.assistanceOrganizations.map((organization) => this.createAssistanceRow(organization))
    ),
    medicalStatus: [''],
    attachedCertificates: [[] as string[]],
    uploadedDocuments: [[] as string[]],
    admissionCourseCode: ['101', Validators.required]
  });

  constructor() {
    this.restoreDraft();
  }

  protected readonly muallims$ = this.searchForm.valueChanges.pipe(
    startWith(this.searchForm.getRawValue()),
    switchMap((value) =>
      this.api.byPath<any[]>(`/api/muallims?status=application&query=${encodeURIComponent(value.query ?? '')}`)
    )
  );

  get familyMembers() {
    return this.registrationForm.get('familyMembers') as FormArray;
  }

  get previousFinancialAssistance() {
    return this.registrationForm.get('previousFinancialAssistance') as FormArray;
  }

  protected addFamilyMember() {
    this.familyMembers.push(this.createFamilyMember());
  }

  protected removeFamilyMember(index: number) {
    if (this.familyMembers.length > 1) {
      this.familyMembers.removeAt(index);
    }
  }

  protected showSection(index: number) {
    this.activeSectionIndex = index;
    this.submitMessage = '';
    this.draftMessage = '';
  }

  protected proceed() {
    if (!this.validateCurrentSection()) {
      this.submitMessage = 'Complete the required fields in this section before proceeding.';
      return;
    }

    this.submitMessage = '';
    this.draftMessage = '';

    if (this.activeSectionIndex < this.sections.length - 1) {
      this.activeSectionIndex += 1;
    }
  }

  protected updateCertificates(certificate: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const current = this.registrationForm.controls.attachedCertificates.value ?? [];
    const next = checked
      ? Array.from(new Set([...current, certificate]))
      : current.filter((item) => item !== certificate);

    this.registrationForm.controls.attachedCertificates.setValue(next);
  }

  protected hasCertificate(certificate: string) {
    return this.registrationForm.controls.attachedCertificates.value?.includes(certificate) ?? false;
  }

  protected updateFileNames(controlName: 'photoFileName' | 'uploadedDocuments', event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files ?? []).map((file) => file.name);

    if (controlName === 'photoFileName') {
      this.registrationForm.controls.photoFileName.setValue(files[0] ?? '');
      return;
    }

    this.registrationForm.controls.uploadedDocuments.setValue(files);
  }

  protected submitRegistration() {
    this.submitMessage = '';
    this.draftMessage = '';

    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      this.submitMessage = 'Complete the required fields before saving.';
      return;
    }

    if (!this.passwordsMatch()) {
      this.registrationForm.controls.confirmPassword.markAsTouched();
      this.submitMessage = 'Password and confirm password must match.';
      return;
    }

    this.saving = true;
    this.api
      .postByPath('/api/muallims/register', this.buildPayload())
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.submitMessage = 'Registration saved.';
          this.clearDraft();
          this.registrationForm.reset({
            currentlyWorkingHere: true,
            attachedCertificates: [],
            uploadedDocuments: [],
            admissionCourseCode: '101'
          });
          this.familyMembers.clear();
          this.familyMembers.push(this.createFamilyMember());
          this.previousFinancialAssistance.clear();
          this.assistanceOrganizations.forEach((organization) => {
            this.previousFinancialAssistance.push(this.createAssistanceRow(organization));
          });
          this.activeSectionIndex = 0;
        },
        error: () => {
          this.submitMessage = 'Unable to save registration. Check the fields and try again.';
        }
      });
  }

  protected admit(muallim: any, courseCode: string) {
    this.submitMessage = '';
    this.draftMessage = '';
    this.admittingPublicId = muallim.publicId;

    this.api
      .postByPath(`/api/muallims/${muallim.publicId}/admit`, { courseCode })
      .pipe(finalize(() => (this.admittingPublicId = '')))
      .subscribe({
        next: (admitted: any) => {
          this.submitMessage = `${admitted.name} admitted with Admission No. ${admitted.admissionNumber}.`;
          this.searchForm.setValue(this.searchForm.getRawValue());
        },
        error: () => {
          this.submitMessage = 'Unable to admit this application. Select a course and try again.';
        }
      });
  }

  protected saveDraft() {
    localStorage.setItem(this.draftStorageKey, JSON.stringify(this.buildDraftPayload()));
    this.draftMessage = 'Draft saved on this device.';
    this.submitMessage = '';
  }

  private createFamilyMember() {
    return this.formBuilder.group({
      name: [''],
      age: [''],
      relationship: ['']
    });
  }

  private createAssistanceRow(organization: string) {
    return this.formBuilder.group({
      organization: [organization],
      year: [''],
      amount: [''],
      itemSector: ['']
    });
  }

  private buildPayload() {
    const value = this.registrationForm.getRawValue();
    const { confirmPassword, ...payload } = value;
    const toNumber = (input: unknown) => {
      if (input === null || input === undefined || input === '') {
        return null;
      }

      const parsed = Number(input);
      return Number.isFinite(parsed) ? parsed : null;
    };

    return {
      ...payload,
      monthlySalary: toNumber(payload.monthlySalary),
      houseSquareFeet: toNumber(payload.houseSquareFeet),
      familyMembers: payload.familyMembers.map((member) => ({
        ...member,
        age: toNumber(member.age)
      })),
      previousFinancialAssistance: payload.previousFinancialAssistance.map((item) => ({
        ...item,
        year: toNumber(item.year),
        amount: toNumber(item.amount)
      }))
    };
  }

  private buildDraftPayload() {
    const value = this.registrationForm.getRawValue();
    const { password, confirmPassword, ...draft } = value;
    return draft;
  }

  private restoreDraft() {
    const savedDraft = localStorage.getItem(this.draftStorageKey);
    if (!savedDraft) {
      return;
    }

    try {
      const draft = JSON.parse(savedDraft);
      this.registrationForm.patchValue(draft);

      if (Array.isArray(draft.familyMembers) && draft.familyMembers.length) {
        this.familyMembers.clear();
        draft.familyMembers.forEach((member: unknown) => {
          const row = this.createFamilyMember();
          row.patchValue(member as { name?: string; age?: string; relationship?: string });
          this.familyMembers.push(row);
        });
      }

      if (Array.isArray(draft.previousFinancialAssistance) && draft.previousFinancialAssistance.length) {
        this.previousFinancialAssistance.clear();
        draft.previousFinancialAssistance.forEach((item: unknown) => {
          const row = this.createAssistanceRow('');
          row.patchValue(item as { organization?: string; year?: string; amount?: string; itemSector?: string });
          this.previousFinancialAssistance.push(row);
        });
      }

      this.draftMessage = 'Draft restored from this device.';
    } catch {
      localStorage.removeItem(this.draftStorageKey);
    }
  }

  private clearDraft() {
    localStorage.removeItem(this.draftStorageKey);
  }

  private validateCurrentSection() {
    const sectionControls = [
      ['username', 'email', 'phone', 'password', 'confirmPassword'],
      ['name'],
      ['aadhaarQualification'],
      [],
      [],
      [],
      [],
      []
    ][this.activeSectionIndex];

    sectionControls.forEach((controlName) => this.registrationForm.get(controlName)?.markAsTouched());
    return sectionControls.every((controlName) => this.registrationForm.get(controlName)?.valid) && this.passwordsMatch();
  }

  private passwordsMatch() {
    return this.registrationForm.controls.password.value === this.registrationForm.controls.confirmPassword.value;
  }
}
