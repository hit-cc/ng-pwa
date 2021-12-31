/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FirebaseStorageService } from './firebase-storage.service';

describe('Service: FirebaseStorage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseStorageService]
    });
  });

  it('should ...', inject([FirebaseStorageService], (service: FirebaseStorageService) => {
    expect(service).toBeTruthy();
  }));
});
