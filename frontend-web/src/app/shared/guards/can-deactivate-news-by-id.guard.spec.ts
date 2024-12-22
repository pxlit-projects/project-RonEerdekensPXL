import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';
import { canDeactivateNewsByIdGuard } from './can-deactivate-news-by-id.guard';

describe('canDeactivateNewsByIdGuard', () => {
  it('should execute the guard', () => {
    const executeGuard: CanDeactivateFn<any> = (
      component,
      currentRoute,
      currentState,
      nextState
    ) =>
      TestBed.runInInjectionContext(() =>
        canDeactivateNewsByIdGuard(
          component,
          currentRoute,
          currentState,
          nextState
        )
      );

    expect(executeGuard).toBeDefined();
  });
});
