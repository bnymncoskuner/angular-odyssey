import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
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
        @if (
          profileForm.get('firstName')?.touched &&
          profileForm.get('firstName')?.invalid
        ) {
          <span class="error">First name must be at least 2 characters</span>
        }
      </div>

      <div class="field">
        <label for="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          formControlName="lastName"
          placeholder="Doe"
        />
        @if (
          profileForm.get('lastName')?.touched &&
          profileForm.get('lastName')?.invalid
        ) {
          <span class="error">Last name must be at least 2 characters</span>
        }
      </div>

      <div class="field">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          formControlName="email"
          placeholder="john.doe&#64;example.com"
        />
        @if (
          profileForm.get('email')?.touched && profileForm.get('email')?.invalid
        ) {
          <span class="error">Please enter a valid email address</span>
        }
      </div>

      <div class="field">
        <label for="displayName">Display Name</label>
        <input
          id="displayName"
          type="text"
          formControlName="displayName"
          placeholder="johndoe"
        />
        @if (
          profileForm.get('displayName')?.touched &&
          profileForm.get('displayName')?.invalid
        ) {
          <span class="error">Display name must be 2-30 characters</span>
        }
      </div>

      <button type="submit" [disabled]="profileForm.invalid" class="save-btn">
        Save & Continue to Favorites
      </button>
    </form>
  `,
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private profileService = inject(ProfileService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  profileForm = this.fb.group({
    firstName: [
      this.profileService.profile()?.firstName ?? '',
      [Validators.required, Validators.minLength(2)],
    ],
    lastName: [
      this.profileService.profile()?.lastName ?? '',
      [Validators.required, Validators.minLength(2)],
    ],
    email: [
      this.profileService.profile()?.email ?? '',
      [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)],
    ],
    displayName: [
      this.profileService.profile()?.displayName ?? '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(30)],
    ],
  });

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
