import { canDeactivateNewsByIdGuard } from './can-deactivate-news-by-id.guard';
import { NewsbyidComponent } from '../../core/pages/newsbyid/newsbyid.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('canDeactivateNewsByIdGuard', () => {
  let component: NewsbyidComponent;

  beforeEach(() => {
    // Mock the NewsbyidComponent
    component = {
      commentForm: new FormGroup({
        comment: new FormControl(''),
      }),
    } as any; // Casting to bypass the compiler error

    // You can also mock methods if needed
  });

  it('should return true if comment field is empty', () => {
    // Simulate the comment field being empty
    component.commentForm.get('comment')!.setValue('');

    const mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;

    const result = canDeactivateNewsByIdGuard(
      component,
      mockActivatedRouteSnapshot,
      mockRouterStateSnapshot,
      mockRouterStateSnapshot
    );

    expect(result).toBe(true);
  });

  it('should return false and prompt user if comment field is not empty', () => {
    // Simulate the comment field having some value
    component.commentForm.get('comment')!.setValue('Some comment');

    // Spy on the window.confirm function to simulate user interaction
    spyOn(window, 'confirm').and.returnValue(true);

    const mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;

    const result = canDeactivateNewsByIdGuard(
      component,
      mockActivatedRouteSnapshot,
      mockRouterStateSnapshot,
      mockRouterStateSnapshot
    );

    expect(window.confirm).toHaveBeenCalledWith(
      'Weet je zeker dat je deze pagina wilt verlaten? Alle gegevens zullen verloren gaan.'
    );
    expect(result).toBe(true);
  });

  it('should return false if user cancels the prompt', () => {
    // Simulate the comment field having some value
    component.commentForm.get('comment')!.setValue('Some comment');

    // Simulate user canceling the confirmation dialog
    spyOn(window, 'confirm').and.returnValue(false);

    const mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;

    const result = canDeactivateNewsByIdGuard(
      component,
      mockActivatedRouteSnapshot,
      mockRouterStateSnapshot,
      mockRouterStateSnapshot
    );

    expect(result).toBe(false);
  });
});
