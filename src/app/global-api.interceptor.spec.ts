import { TestBed } from '@angular/core/testing';

import { GlobalApiInterceptor } from './global-api.interceptor';

describe('GlobalApiInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      GlobalApiInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: GlobalApiInterceptor = TestBed.inject(GlobalApiInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
