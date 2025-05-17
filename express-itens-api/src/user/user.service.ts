import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUserAll() {
    return console.log('getUserAll');
  }

  getUserById(id: string) {
    return console.log('getUserById', id);
  }

  createUser(user: any) {
    return console.log('createUser', user);
  }

  updateUser(id: string, user: any) {
    return console.log('updateUser', id, user);
  }

  deleteUser(id: string) {
    return console.log('deleteUser', id);
  }
}
