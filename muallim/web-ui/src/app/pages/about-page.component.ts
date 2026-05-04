import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SiteFacadeService } from '../core/site-facade.service';

@Component({
  selector: 'app-about-page',
  imports: [AsyncPipe, NgFor, NgIf],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss'
})
export class AboutPageComponent {
  protected readonly siteFacade = inject(SiteFacadeService);
}
