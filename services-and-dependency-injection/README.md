# Services and Dependency Injection

## Injectors in Angular

- Components in Angular look for the dependencies in the dependency tree using injectors, from bottom to top.
- Angular has multiple injectors for dependency injection. Components look for dependencies in the following order:

1. ElementInjector: first level
2. ModuleInjector: look if not in element injector
3. EnvironmentInjector: ... (`@Injectable` with `root`)
4. PlatformInjector: ... (Helps in DI for multiple applications in a single project)
5. NullInjector: if not found, throw an error

### Element Injector

- First level when looking for deps for a component, child components used in the template also access it
- Can't be used for DI between services since they aren't elemnets
- The element's parent can't access the injector, only its children do.
- This thus restricts the dependency to a specific node to the component tree

> Note: this means the value provided in the injector will not be shared when having multiple instances of the injected-into element, each instance will have its own dependency instance

### Injecting Services into Services

- Done normally using the constructor or inject() similar with components
- However, you can't use a service injected from an element injector in another service.
- Services only have access to ModuleInjctor and EnvironmentInjector

### Injecting Non-Service Values

- Usually needed when you want to let a node of the component tree access a value that isn't a service such as constants.
- Done using an injector token and a provided

e.g.

```ts
// task.model.ts

// Creates an injection token that can be imported and used in a component to inject the value using inject(token)
export const TASK_STATUS_OPTIONS = new InjectionToken<TaskStatusOptions>('task-status-options');

// Actual value
const taskStatusOptions: TaskStatusOptions = [
  {
    value: 'open',
    taskStatus: 'OPEN',
    text: 'Open',
  },
  {
    value: 'in-progress',
    taskStatus: 'IN_PROGRESS',
    text: 'In-Progress',
  },
  {
    value: 'done',
    taskStatus: 'DONE',
    text: 'Completed',
  },
];

// Value provided to @Component({ providers: [...] })
export const taskStatusOptionsProvider: Provider = {
  provide: TASK_STATUS_OPTIONS,
  useValue: taskStatusOptions,
};
```
