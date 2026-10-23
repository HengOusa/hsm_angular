import {
  Directive,
  input,
  effect,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { AuthFacade } from '../../store/auth/auth.facade';
import { UserRole } from '../../core/auth/auth.service';

@Directive({
  selector: '[mcHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private readonly auth = inject(AuthFacade);
  private readonly tpl = inject(TemplateRef<unknown>);
  private readonly vcr = inject(ViewContainerRef);
  private shown = false;

  readonly mcHasRole = input.required<UserRole | UserRole[]>();

  constructor() {
    effect(() => {
      const _user = this.auth.user();
      const roles = this.mcHasRole();
      const allowed = this.auth.hasRole(roles);

      if (allowed && !this.shown) {
        this.vcr.createEmbeddedView(this.tpl);
        this.shown = true;
      } else if (!allowed && this.shown) {
        this.vcr.clear();
        this.shown = false;
      } else if (!allowed && !this.shown) {
        this.vcr.clear();
      }
    });
  }
}
