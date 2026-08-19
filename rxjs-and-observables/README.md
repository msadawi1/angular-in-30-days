# RxJS & Observables

## Observables

A concept introduced by RxJS (3rd-party library that Angular uses) that handles asynchronous event-based programs, where **observables** emit events, and you set up subscription to those events in variuos components.

> RxJS has multiple observables (as functions) that can be imported and used for different purposes.

- Observables won't fire unless there are at least a single subscriber to them.
- You should clean up subscriptions before a component is destroyed.
- Subscribing and destroying are done using lifecycle hooks.
- RxJS also provides operators that can be applied to emitted observable values to transform data.




