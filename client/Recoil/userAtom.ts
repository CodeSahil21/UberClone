import { atom } from 'recoil';

interface User {
  email: string;
  password: string;
  fullname: {
    firstname: string;
    lastname?: string;
  };
}

export const userAtom = atom<User>({
  key: 'userState',
  default: {
    email: '',
    password: '',
    fullname: {
      firstname: '',
      lastname: ''
    }
  },
});