import { bootstrapApplication } from '@angular/platform-browser';
import { UserApp } from './user/user-app';

bootstrapApplication(UserApp).catch((error) => console.error(error));
