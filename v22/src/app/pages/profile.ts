import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, pattern, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';

@Component({
  imports: [FormField],
  template: `
    <h1>Set Up Your Profile</h1>
    <p>Complete your profile to access your favorites.</p>

    <div class="profile-form">
      <div class="field">
        <label>First Name</label>
        <input type="text" [formField]="profileForm.firstName" placeholder="John" />
        @if (profileForm.firstName().touched() && profileForm.firstName().invalid()) {
          <span class="error">First name must be at least 2 characters</span>
        }
      </div>

      <div class="field">
        <label>Last Name</label>
        <input type="text" [formField]="profileForm.lastName" placeholder="Doe" />
        @if (profileForm.lastName().touched() && profileForm.lastName().invalid()) {
          <span class="error">Last name must be at least 2 characters</span>
        }
      </div>

      <div class="field">
        <label>Email</label>
        <input
          type="email"
          [formField]="profileForm.email"
          placeholder="john.doe&#64;example.com"
        />
        @if (profileForm.email().touched() && profileForm.email().invalid()) {
          <span class="error">Please enter a valid email address</span>
        }
      </div>

      <div class="field">
        <label>Display Name</label>
        <input type="text" [formField]="profileForm.displayName" placeholder="johndoe" />
        @if (profileForm.displayName().touched() && profileForm.displayName().invalid()) {
          <span class="error">Display name must be 2-30 characters</span>
        }
      </div>

      <button (click)="save()" [disabled]="profileForm().invalid()" class="save-btn">
        Save & Continue to Favorites
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './profile.scss',
})
export class Profile {
  private profileService = inject(ProfileService);
  private router = inject(Router);

  private profileData = signal({
    firstName: this.profileService.profile()?.firstName ?? '',
    lastName: this.profileService.profile()?.lastName ?? '',
    email: this.profileService.profile()?.email ?? '',
    displayName: this.profileService.profile()?.displayName ?? '',
  });

  profileForm = form(this.profileData, (s) => {
    required(s.firstName);
    minLength(s.firstName, 2);

    required(s.lastName);
    minLength(s.lastName, 2);

    required(s.email);
    pattern(s.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    required(s.displayName);
    minLength(s.displayName, 2);
    maxLength(s.displayName, 30);
  });

  save(): void {
    if (this.profileForm().valid()) {
      const data = this.profileData();
      this.profileService.setProfile(data);
      this.router.navigate(['/favorites']);
    }
  }
}
