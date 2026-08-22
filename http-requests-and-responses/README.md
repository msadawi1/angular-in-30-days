# HTTP Requests and Responses - Connecting to a backend

- Angular provides a service `HttpClient` for sending HTTP Requests from `@angular/commont/http`
- That service must be provided in the component tree (using DI) to be used.

## Getting Data

- Usually, you want to fetch data from the server when a component loads.
- This is done using `ngOnInit` lifecycle hook.
- HTTP Client's method correspond to actual HTTP methods, and the returned value for calling them is an observables, meaning that you need to subscribe to it in order to start fetching data.

e.g.
``` ts
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    const subscription = this.httpClient
      .get<{ places: Place[] }>(`${API_BASE_URL}/places`)
      .pipe(map((data) => data.places))
      .subscribe({
        next: (places) => {
          this.places.set(places);
        },
      });

    // it's a good practice to clean up even though there's only one value emitted from the request
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
```

- Note: using a generic to type the http client's method only does type assertion, you still need to do checking.

## Handling Loading & Error States

- Done using states/signals in the component makign the HTTP requests (similar to React's useState)
- You use the http client's observable interfaces: `next`, `error`, `complete` to handle the various states of the request.

## Loading

1. Define a flag state.
2. Set the flag before calling the HTTP method.
3. Unset the flag in the `complete` interface.

e.g.
``` ts
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal<boolean>(false);

  httpClient = inject(HttpClient);
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isFetching.set(true);
    const getPlacesSubscriber = this.httpClient
      .get<{ places: Place[] }>(`${API_BASE_URL}/places`)
      .pipe(
        map((data) => data.places)
      )
      .subscribe({
        next: (places) => this.places.set(places),
        complete: () => this.isFetching.set(false),
      });

    this.destroyRef.onDestroy(() => {
      getPlacesSubscriber.unsubscribe();
    });
  }
}
```

## Errors

1. Define an error state
2. Optionally intercept the error using `catchError` operator from RxJS
3. Set the error flag in `error` interface of the http method subscriber
4.

e.g.
``` ts
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal<boolean>(false);
  error = signal<string>('');

  httpClient = inject(HttpClient);
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isFetching.set(true);
    const getPlacesSubscriber = this.httpClient
      .get<{ places: Place[] }>(`${API_BASE_URL}/places`)
      .pipe(
        map((data) => data.places),
        catchError((error) => {
          console.log(error);
          return throwError(
            () =>
              new Error('Something went wrong fetching available places. Please try again later.'),
          );
        }),
      )
      .subscribe({
        next: (places) => this.places.set(places),
        error: (error: Error) => this.error.set(error.message),
        complete: () => this.isFetching.set(false),
      });

    this.destroyRef.onDestroy(() => {
      getPlacesSubscriber.unsubscribe();
    });
  }

```

## Extracting HTTP management to a service

- Look into `http-requests-and-responses` service implementation.

## HTTP Request Interceptors

- You could add interceptors to the HTTP client provider in order to execute extra things on the outgoing request such as logging or headeres.

``` ts
function loggingInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  console.log("[OUTGOING REQUEST]: " + request.method + ' ' + request.url)
  return next(request)
}

bootstrapApplication(AppComponent, { providers: [provideHttpClient(
  withInterceptors([loggingInterceptor])
)] }).catch((err) =>
  console.error(err),
);
```
