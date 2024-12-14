import { CanDeactivateFn } from '@angular/router';
import { NewsbyidComponent } from '../../core/pages/newsbyid/newsbyid.component';

export const canDeactivateNewsByIdGuard: CanDeactivateFn<NewsbyidComponent> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  if (component.commentForm.get('comment')!.value !== '') {
    return confirm(
      'Weet je zeker dat je deze pagina wilt verlaten? Alle gegevens zullen verloren gaan.'
    );
  }
  return true;
};
