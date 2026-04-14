import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-muallim-profile-page',
  imports: [AsyncPipe, NgIf],
  templateUrl: './muallim-profile-page.component.html',
  styleUrl: './muallim-profile-page.component.scss'
})
export class MuallimProfilePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);

  protected readonly muallim$ = this.route.paramMap.pipe(
    switchMap((params) => this.api.getByPath<any>(`/api/muallims/${params.get('publicId')}`))
  );
}
