import { Directive, ElementRef, output, OnInit, OnDestroy, inject } from '@angular/core';

/**
 * Emits when a click occurs outside the host element.
 * Usage: <div (mcClickOutside)="close()">
 */
@Directive({
  selector: '[mcClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private listener: ((e: MouseEvent) => void) | null = null;

  readonly mcClickOutside = output<MouseEvent>();

  ngOnInit(): void {
    this.listener = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (target && !this.el.nativeElement.contains(target)) {
        this.mcClickOutside.emit(event);
      }
    };
    // Capture phase so it works with stopPropagation inside
    document.addEventListener('click', this.listener, true);
  }

  ngOnDestroy(): void {
    if (this.listener) {
      document.removeEventListener('click', this.listener, true);
    }
  }
}
