import { signal } from "@angular/core";
import { User } from "./tables.models";

export class AuthService {
    private readonly user = signal<User[]>([
        { id  }
    ])
}