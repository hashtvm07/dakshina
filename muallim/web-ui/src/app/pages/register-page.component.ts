import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SiteFacadeService } from '../core/site-facade.service';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, NgIf, NgFor, AsyncPipe],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly api = inject(ApiService);
  protected readonly siteFacade = inject(SiteFacadeService);
  private readonly draftStorageKey = 'muallim-registration-draft';

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

  protected submittedId = '';
  protected submitMessage = '';
  protected draftMessage = '';
  protected saving = false;
  protected activeSectionIndex = 0;

  protected readonly form = this.formBuilder.group({
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
    uploadedDocuments: [[] as string[]]
  });

  constructor() {
    this.restoreDraft();
  }

  get familyMembers() {
    return this.form.get('familyMembers') as FormArray;
  }

  get previousFinancialAssistance() {
    return this.form.get('previousFinancialAssistance') as FormArray;
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
    const current = this.form.controls.attachedCertificates.value ?? [];
    const next = checked
      ? Array.from(new Set([...current, certificate]))
      : current.filter((item) => item !== certificate);

    this.form.controls.attachedCertificates.setValue(next);
  }

  protected hasCertificate(certificate: string) {
    return this.form.controls.attachedCertificates.value?.includes(certificate) ?? false;
  }

  protected updateFileNames(controlName: 'photoFileName' | 'uploadedDocuments', event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files ?? []).map((file) => file.name);

    if (controlName === 'photoFileName') {
      this.form.controls.photoFileName.setValue(files[0] ?? '');
      return;
    }

    this.form.controls.uploadedDocuments.setValue(files);
  }

  protected submit() {
    this.submittedId = '';
    this.submitMessage = '';
    this.draftMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.submitMessage = 'Complete the required fields before submitting.';
      return;
    }

    if (!this.passwordsMatch()) {
      this.form.controls.confirmPassword.markAsTouched();
      this.submitMessage = 'Password and confirm password must match.';
      return;
    }

    this.saving = true;
    this.api.post<any>('muallimRegister', this.buildPayload()).subscribe({
      next: (response) => {
        this.submittedId = response.publicId;
        this.submitMessage = 'Registration submitted successfully.';
        this.clearDraft();
        this.resetForm();
      },
      error: () => {
        this.submitMessage = 'Unable to submit registration. Check the fields and try again.';
        this.saving = false;
      },
      complete: () => {
        this.saving = false;
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

  private resetForm() {
    this.form.reset({
      currentlyWorkingHere: true,
      attachedCertificates: [],
      uploadedDocuments: []
    });
    this.familyMembers.clear();
    this.familyMembers.push(this.createFamilyMember());
    this.previousFinancialAssistance.clear();
    this.assistanceOrganizations.forEach((organization) => {
      this.previousFinancialAssistance.push(this.createAssistanceRow(organization));
    });
    this.activeSectionIndex = 0;
  }

  private restoreDraft() {
    const savedDraft = localStorage.getItem(this.draftStorageKey);
    if (!savedDraft) {
      return;
    }

    try {
      const draft = JSON.parse(savedDraft);
      this.form.patchValue(draft);

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

    sectionControls.forEach((controlName) => this.form.get(controlName)?.markAsTouched());
    return sectionControls.every((controlName) => this.form.get(controlName)?.valid) && this.passwordsMatch();
  }

  private passwordsMatch() {
    return this.form.controls.password.value === this.form.controls.confirmPassword.value;
  }

  private buildPayload() {
    const value = this.form.getRawValue();
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
    const value = this.form.getRawValue();
    const { password, confirmPassword, ...draft } = value;
    return draft;
  }
}
