import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'mc-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly query$ = new Subject<string>();

  /** Placeholder text */
  readonly placeholder = input('Search…');
  /** Debounce ms before emitting */
  readonly debounceMs = input(250);
  /** data-test id */
  readonly testId = input('search-bar');
  /** Autofocus on init */
  readonly autofocus = input(false);

  /** Emits debounced search query */
  readonly search = output<string>();
  /** Emits immediately on clear */
  readonly cleared = output<void>();

  readonly value = signal('');

  ngOnInit(): void {
    this.query$
      .pipe(
        debounceTime(this.debounceMs()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((q) => this.search.emit(q));
  }

  onInput(event: Event): void {
    const q = (event.target as HTMLInputElement).value;
    this.value.set(q);
    this.query$.next(q.trim());
  }

  onClear(): void {
    this.value.set('');
    this.query$.next('');
    this.cleared.emit();
  }
}
