import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
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
        console.log('accessToken:',accessToken);
        console.log('refreshToken:',refreshToken);
        console.log(profile);

        const fixedRoles = {
            'admin@example.com': 'admin',
            'manager@example.com': 'manager',
            'staff@example.com': 'staff',
        };

        const email = profile.emails[0].value;
        const role = fixedRoles[email] || 'owner';

        const user = await this.authService.validateUser({ 
            email, 
            displayName: profile.displayName,
            avatar: profile.photos[0].value,
            role,
            password: '123456789',
            walletBalance: 0,
            isActive: true,
            phoneNumber:'0',
        })
        console.log('Validate')
        console.log(user);
        return user || null;
    }
}
