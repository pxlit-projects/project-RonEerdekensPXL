import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';
import { canDeactivateAddPostGuard } from './can-deactivate-add-post.guard';

describe('canDeactivateAddPostGuard', () => {
  it('should execute the guard', () => {
    const executeGuard: CanDeactivateFn<any> = (
      component,
      currentRoute,
      currentState,
      nextState
    ) =>
      TestBed.runInInjectionContext(() =>
        canDeactivateAddPostGuard(
          component,
          currentRoute,
          currentState,
          nextState
        )
      );

    expect(executeGuard).toBeDefined();
  });
});
