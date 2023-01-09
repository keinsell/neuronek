import {Entity} from '@internal/common'

export interface UserProperties {  
    username: string;
    password: string;
    recoveryKey: string;
}

export class User extends Entity<UserProperties> {
    
    constructor(props: UserProperties, id?: string) {
        super(props, id);
    }

    public static create(props: UserProperties): User {
        return new User(props);
    }
}