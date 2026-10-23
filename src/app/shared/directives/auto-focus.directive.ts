import { Directive, ElementRef, AfterViewInit, input, inject } from '@angular/core';

/**
 * Auto-focuses the host element after view init.
 * Usage: <input mcAutoFocus /> or <input [mcAutoFocus]="true" />
 */
@Directive({
  selector: '[mcAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements AfterViewInit {
  private readonly el = inject(ElementRef<HTMLElement>);

  readonly mcAutoFocus = input(true);

  ngAfterViewInit(): void {
    if (this.mcAutoFocus()) {
      // Delay so Material form fields are ready
      setTimeout(() => this.el.nativeElement.focus(), 100);
    }
  }
}
