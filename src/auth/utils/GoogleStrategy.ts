import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: AuthService,
  ) {
    super({
      clientID:
        '493141261768-evsi4cjtlul83un645fgcgafi8ldobvl.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:8000/api/auth/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    const user = await this.authService.validateUser({
      email: profile.emails?.[0]?.value || null, 
      displayName: profile.displayName || 'No Name', 
      avatar: profile.photos?.[1]?.value || profile.photos?.[0]?.value || null,
      phoneNumber: '0123456789',
      role: 'store owner',
      password: '123456789',
      walletBalance: 0,
      isActive: true,
    });
    console.log('Validate');
    console.log(user);
    return user || null;
  }
}
