import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-page',
  imports: [FormsModule],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  private readonly router = inject(Router);
  protected searchId = '';

  protected submitSearch() {
    const publicId = this.searchId.trim();
    if (!publicId) {
      return;
    }

    void this.router.navigate(['/muallim', publicId]);
  }
}
