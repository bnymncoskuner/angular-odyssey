import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Set Up Your Profile</h1>
    <p>Complete your profile to access your favorites.</p>

    <form [formGroup]="profileForm" (ngSubmit)="save()" class="profile-form">
      <div class="field">
        <label for="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          formControlName="firstName"
          placeholder="John"
        />
        <span
          *ngIf="
            profileForm.get('firstName')?.touched &&
            profileForm.get('firstName')?.invalid
          "
          class="error"
        >
          First name must be at least 2 characters
        </span>
      </div>

      <div class="field">
        <label for="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          formControlName="lastName"
          placeholder="Doe"
        />
        <span
          *ngIf="
            profileForm.get('lastName')?.touched &&
            profileForm.get('lastName')?.invalid
          "
          class="error"
        >
          Last name must be at least 2 characters
        </span>
      </div>

      <div class="field">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          formControlName="email"
          placeholder="john.doe@example.com"
        />
        <span
          *ngIf="
            profileForm.get('email')?.touched &&
            profileForm.get('email')?.invalid
          "
          class="error"
        >
          Please enter a valid email address
        </span>
      </div>

      <div class="field">
        <label for="displayName">Display Name</label>
        <input
          id="displayName"
          type="text"
          formControlName="displayName"
          placeholder="johndoe"
        />
        <span
          *ngIf="
            profileForm.get('displayName')?.touched &&
            profileForm.get('displayName')?.invalid
          "
          class="error"
        >
          Display name must be 2-30 characters
        </span>
      </div>

      <button type="submit" [disabled]="profileForm.invalid" class="save-btn">
        Save & Continue to Favorites
      </button>
    </form>
  `,
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  profileForm;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.profileForm = this.fb.group({
      firstName: [
        this.profileService.profile?.firstName ?? '',
        [Validators.required, Validators.minLength(2)],
      ],
      lastName: [
        this.profileService.profile?.lastName ?? '',
        [Validators.required, Validators.minLength(2)],
      ],
      email: [
        this.profileService.profile?.email ?? '',
        [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)],
      ],
      displayName: [
        this.profileService.profile?.displayName ?? '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ],
      ],
    });
  }

  save(): void {
    if (this.profileForm.valid) {
      const data = this.profileForm.getRawValue();
      this.profileService.setProfile({
        firstName: data.firstName!,
        lastName: data.lastName!,
        email: data.email!,
        displayName: data.displayName!,
      });
      this.router.navigate(['/favorites']);
    }
  }
}
