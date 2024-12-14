import { CanDeactivateFn } from '@angular/router';
import { AddPostComponent } from '../../core/pages/add-post/add-post.component';

export const canDeactivateAddPostGuard: CanDeactivateFn<AddPostComponent> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  if (component.contentField !== '' || component.titleField !== '') {
    return confirm(
      'Ben je zeker dat je deze pagina wilt verlaten? Alle gegevens worden verwijderd.'
    );
  }
  return true;
};
