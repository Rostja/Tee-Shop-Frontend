import { TestBed } from '@angular/core/testing';

import { TeaShopFormService } from './tea-shop-form.service';

describe('TeaShopFormService', () => {
  let service: TeaShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeaShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
