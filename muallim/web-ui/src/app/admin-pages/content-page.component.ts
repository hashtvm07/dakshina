import { AsyncPipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-content-page',
  imports: [ReactiveFormsModule, AsyncPipe, NgFor],
  templateUrl: './content-page.component.html',
  styleUrl: './content-page.component.scss'
})
export class ContentPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly api = inject(ApiService);

  protected editingBlockId?: number;
  protected editingMediaId?: number;

  protected readonly blockForm = this.formBuilder.group({
    title: [''],
    body: [''],
    imageUrl: [''],
    sortOrder: [0]
  });

  protected readonly mediaForm = this.formBuilder.group({
    title: [''],
    imageUrl: [''],
    category: ['gallery']
  });

  protected readonly blocks$ = this.api.get<any[]>('contentBlocks');
  protected readonly media$ = this.api.get<any[]>('mediaAssets');

  protected saveBlock() {
    const request = this.editingBlockId
      ? this.api.putByPath(`/api/site/content-blocks/${this.editingBlockId}`, this.blockForm.getRawValue())
      : this.api.post('contentBlocks', this.blockForm.getRawValue());

    request.subscribe(() => location.reload());
  }

  protected saveMedia() {
    const request = this.editingMediaId
      ? this.api.putByPath(`/api/site/media-assets/${this.editingMediaId}`, this.mediaForm.getRawValue())
      : this.api.post('mediaAssets', this.mediaForm.getRawValue());

    request.subscribe(() => location.reload());
  }

  protected removeBlock(id: number) {
    this.api.deleteByPath(`/api/site/content-blocks/${id}`).subscribe(() => location.reload());
  }

  protected removeMedia(id: number) {
    this.api.deleteByPath(`/api/site/media-assets/${id}`).subscribe(() => location.reload());
  }

  protected editBlock(block: any) {
    this.editingBlockId = block.id;
    this.blockForm.patchValue(block);
  }

  protected editMedia(media: any) {
    this.editingMediaId = media.id;
    this.mediaForm.patchValue(media);
  }
}
