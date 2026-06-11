import { Component, inject, signal, OnInit, DestroyRef, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { StorageService } from '../../core/services/storage.service';
import { AuthService } from '../../core/services/auth.service';
import { UserMediaResponse } from '../../core/models/media.model';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-media-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent
  ],
  templateUrl: './media-management.component.html',
  styleUrl: './media-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaManagementComponent implements OnInit {
  private storageService = inject(StorageService);
  protected authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);

  mediaList = signal<UserMediaResponse[]>([]);
  isLoading = signal(true);
  
  // Drag and Drop / Upload states
  isDragOver = signal(false);
  isUploading = signal(false);
  uploadProgress = signal(0);
  uploadFileName = signal('');
  uploadIsPublic = signal(true);

  // Clipboard Copied State
  copiedId = signal<string | null>(null);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadMedia();
    } else {
      this.isLoading.set(false);
    }
  }

  loadMedia() {
    this.isLoading.set(true);
    this.storageService.getMyMedia()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (media) => {
          this.mediaList.set(media);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to load media files:', err);
          this.isLoading.set(false);
        }
      });
  }

  setUploadVisibility(isPublic: boolean) {
    this.uploadIsPublic.set(isPublic);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileUpload(files[0]);
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.handleFileUpload(files[0]);
    }
  }

  private handleFileUpload(file: File) {
    const user = this.authService.user();
    if (!user) {
      alert('You must be logged in to upload files.');
      return;
    }

    const extension = file.name.substring(file.name.lastIndexOf('.'));
    this.isUploading.set(true);
    this.uploadProgress.set(0);
    this.uploadFileName.set(file.name);

    this.storageService.getPresignedUrl(user.id, extension, file.type, this.uploadIsPublic())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (presigned) => {
          this.storageService.uploadFileDirect(presigned.uploadUrl, file)
            .subscribe({
              next: (event: HttpEvent<any>) => {
                if (event.type === HttpEventType.UploadProgress && event.total) {
                  const percentDone = Math.round((100 * event.loaded) / event.total);
                  this.uploadProgress.set(percentDone);
                } else if (event.type === HttpEventType.Response) {
                  this.uploadProgress.set(100);
                  // Wait a short delay to allow S3 to trigger the async backend listener, then poll
                  setTimeout(() => {
                    this.pollForMetadata(presigned.fileName);
                  }, 1200);
                }
              },
              error: (err) => {
                console.error('File upload failed:', err);
                alert('File upload failed. Please try again.');
                this.isUploading.set(false);
              }
            });
        },
        error: (err) => {
          console.error('Failed to get presigned URL:', err);
          alert('Failed to initialize upload. Please try again.');
          this.isUploading.set(false);
        }
      });
  }

  // Polling to retrieve the newly processed metadata from the DB
  private pollForMetadata(fileName: string, attempts = 3) {
    this.storageService.getMyMedia()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (media) => {
          const found = media.some(m => m.s3Key === fileName);
          if (found || attempts <= 1) {
            this.mediaList.set(media);
            this.isUploading.set(false);
          } else {
            setTimeout(() => {
              this.pollForMetadata(fileName, attempts - 1);
            }, 800);
          }
        },
        error: () => {
          this.isUploading.set(false);
        }
      });
  }

  toggleVisibility(item: UserMediaResponse) {
    const newWorldRead = !item.worldRead;
    this.storageService.updateVisibility(item.id, newWorldRead)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.mediaList.update(list =>
            list.map(m => m.id === item.id ? { ...m, worldRead: updated.worldRead, s3Key: updated.s3Key, downloadUrl: updated.worldRead ? m.downloadUrl.replace('private/', 'public/') : m.downloadUrl } : m)
          );
          // Reload the list to ensure all presigned/CDN URLs are fully synchronized from database state
          this.loadMedia();
        },
        error: (err) => {
          console.error('Failed to update file visibility:', err);
          alert('Failed to update file visibility. Please try again.');
        }
      });
  }

  deleteItem(item: UserMediaResponse) {
    if (!confirm('Are you sure you want to delete this media file? This action is permanent.')) {
      return;
    }

    this.storageService.deleteFile(item.s3Key)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.mediaList.update(list => list.filter(m => m.id !== item.id));
        },
        error: (err) => {
          console.error('Failed to delete media file:', err);
          alert('Failed to delete file. Please try again.');
        }
      });
  }

  copyUrl(item: UserMediaResponse) {
    navigator.clipboard.writeText(item.downloadUrl).then(() => {
      this.copiedId.set(item.id);
      setTimeout(() => {
        if (this.copiedId() === item.id) {
          this.copiedId.set(null);
        }
      }, 1500);
    });
  }

  isImage(contentType: string): boolean {
    return contentType.startsWith('image/');
  }

  isVideo(contentType: string): boolean {
    return contentType.startsWith('video/');
  }
}
