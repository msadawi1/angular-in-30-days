import { Component, DestroyRef, inject, OnInit } from '@angular/core';

import { interval, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  timerInSeconds: number = 0;

  ngOnInit(): void {
    const subscription = interval(1000)
      .pipe(map((value) => value + 1))
      .subscribe({
        next: (value) => (this.timerInSeconds = value),
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
