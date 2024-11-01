import { Inject, Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { User } from "../../user/entities/user.entity";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(
        @Inject('AUTH_SERVICE')
        private readonly authService: AuthService
    ) {
        super();
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    serializeUser(user: User, done: Function) {
        console.log('Serializer User');
        done(null, user);
      }
    
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      async deserializeUser(payload: any, done: Function) {
        const user = await this.authService.findUser(payload.id);
        console.log('Deserialize User');
        console.log(user);
        return user ? done(null, user) : done(null, null);
      }
}