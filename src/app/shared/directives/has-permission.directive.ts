import {
  Directive,
  input,
  effect,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { AuthFacade } from '../../store/auth/auth.facade';

@Directive({
  selector: '[mcHasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private readonly auth = inject(AuthFacade);
  private readonly tpl = inject(TemplateRef<unknown>);
  private readonly vcr = inject(ViewContainerRef);
  private shown = false;

  readonly mcHasPermission = input.required<string | string[]>();
  readonly mcHasPermissionMode = input<'all' | 'any'>('all');

  constructor() {
    effect(() => {
      // Re-run when user changes
      const _user = this.auth.user();
      const perms = this.mcHasPermission();
      const mode = this.mcHasPermissionMode();
      const list = Array.isArray(perms) ? perms : [perms];
      const allowed =
        mode === 'any'
          ? list.some((p) => this.auth.hasPermission(p))
          : list.every((p) => this.auth.hasPermission(p));

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
