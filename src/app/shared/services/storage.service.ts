import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
  constructor() {}

  getItem(key: string) {
    const data = localStorage.getItem(key);

    if (data === '' || data === null) {
      return null;
    }

    return data;
  }

  setItem(key: string, data: string) {
    localStorage.setItem(key, data);
  }

  deleteItem(key: string) {
    localStorage.removeItem(key);
  }

  clearStorage() {
    localStorage.clear();
  }
}
