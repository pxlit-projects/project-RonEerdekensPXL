import { TestBed } from '@angular/core/testing';
import { canDeactivateAddPostGuard } from './can-deactivate-add-post.guard';
import { AddPostComponent } from '../../core/pages/add-post/add-post.component';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('canDeactivateAddPostGuard', () => {
  let component: AddPostComponent;
  let confirmSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AddPostComponent,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatSelectModule,
        CommonModule,
        MatIconModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AddPostComponent);
    component = fixture.componentInstance;

    // Mock the confirm function
    confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
  });

  it('should return true if contentField and titleField are empty', () => {
    component.contentField = '';
    component.titleField = '';

    const mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;

    const result = canDeactivateAddPostGuard(
      component,
      mockActivatedRouteSnapshot,
      mockRouterStateSnapshot,
      mockRouterStateSnapshot
    );

    expect(result).toBe(true);
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('should prompt the user if contentField or titleField are not empty', () => {
    component.contentField = 'Some content';
    component.titleField = '';

    const mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;

    const result = canDeactivateAddPostGuard(
      component,
      mockActivatedRouteSnapshot,
      mockRouterStateSnapshot,
      mockRouterStateSnapshot
    );

    expect(result).toBe(true); // since confirm returns true, guard should pass
    expect(confirmSpy).toHaveBeenCalledWith(
      'Ben je zeker dat je deze pagina wilt verlaten? Alle gegevens worden verwijderd.'
    );
  });

  it('should return false if the user cancels the confirmation', () => {
    component.contentField = 'Some content';
    component.titleField = '';

    confirmSpy.and.returnValue(false);

    const mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;

    const result = canDeactivateAddPostGuard(
      component,
      mockActivatedRouteSnapshot,
      mockRouterStateSnapshot,
      mockRouterStateSnapshot
    );

    expect(result).toBe(false); // since confirm returns false, guard should not pass
    expect(confirmSpy).toHaveBeenCalledWith(
      'Ben je zeker dat je deze pagina wilt verlaten? Alle gegevens worden verwijderd.'
    );
  });
});
