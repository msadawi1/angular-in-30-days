import { ChangeDetectionStrategy, Component, linkedSignal, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  // // Equity override to compare by value rather than reference
  // names = signal(['Ali', 'Mohammed'], {
  //   equal: (prevValue: string[], newValue: string[]) => this.areDeeplyEqual(prevValue, newValue)
  // })

  // // Writable and computed signals
  // firstName = signal('Mohammed')
  // lastName = signal('Alsadawi')
  // fullName = computed(() => this.firstName() + ' ' + this.lastName())

  // // helper
  // areDeeplyEqual(list1: string[], list2: string[]): boolean {
  //   const sorted1 = [...list1].sort();
  //   const sorted2 = [...list2].sort();

  //   return sorted1.every((val, index) => val === sorted2[index]);
  // }

  // // effect to detect renders by names signal
  // constructor(private injector: Injector) {}

  // // detect names signal renders
  // ngOnInit() {
  //   effect(() => {
  //     this.names()
  //     console.log("Rerendered component due to names list change")
  //   }, {injector: this.injector})
  // }

  // // change list reference
  // onListChange() {
  //   this.names.update((prevValue) => [...prevValue])
  // }

  stockCount= signal<number>(10)

  selectedQuantity = linkedSignal<number, number>({
    source: this.stockCount,
    computation: (newStock, previous) => {
      if (!previous) return 7
      return previous.value > newStock ? newStock : previous.value
    }
  })

  onChange() {
    this.stockCount.set(6)
  }

}
