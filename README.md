<div align="center">

# Learning Angular in <30d

**Every line of Angular in this repo was typed by hand.**

A topic-by-topic record of going from React/TypeScript to Angular 19.

[![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![RxJS](https://img.shields.io/badge/RxJS-7.x-B7178C?style=flat-square&logo=reactivex&logoColor=white)](https://rxjs.dev)
[![Prettier](https://img.shields.io/badge/Prettier-formatted-F7B93E?style=flat-square&logo=prettier&logoColor=black)](https://prettier.io)

</div>

---

## Why this repo exists

I am willing to join a team that runs an **Angular 19 codebase inside an Nx monorepo**, with **multiple portals in one workspace** and API services **generated from an OpenAPI specification**. This repo is the ramp-up: one standalone Angular 19 app per topic, written by hand, each with its own notes on what the code does and why.

## The one rule

> **No AI writes Angular code in this repo.**

The only exception is the mock Express backend under `http-requests-and-responses/backend`, which exists so the HTTP topic has something to talk to.

---

## Repo structure

```
.
├── setup-and-components/                  # one Angular 19 app per topic
├── data-and-event-binding/
├── custom-directives-and-control-flow/
├── signals-and-effects/
├── components-io/
├── components-deep-dive/
├── debugging-angular/
├── services-and-dependency-injection/
├── rxjs-and-observables/
├── http-requests-and-responses/
│   └── backend/                           # mock Express API (not Angular)
├── managing-forms/
│
├── capstone-01-task-board/                # practice apps combining several topics
├── capstone-02-investement-calculator/
│
├── package.json                           # shared Prettier tooling only
└── README.md                              # you are here
```

Each folder is an independent Angular 19 project with its own `package.json` and `node_modules`. Open any one of them, `npm install`, `ng serve` — nothing else in the repo is needed.

Each folder also carries its own `README.md` holding the notes for that topic, so the code is never context-free.

---

## Topics

| Topic                                                      | Folder                                                                       |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Angular CLI setup, project anatomy                         | [`setup-and-components`](./setup-and-components)                             |
| How the Angular compiler works (AST, codegen, CSS scoping) | [`setup-and-components`](./setup-and-components)                             |
| Change detection, zone.js, the zoneless direction          | [`setup-and-components`](./setup-and-components)                             |
| Components and component composition                       | [`setup-and-components`](./setup-and-components)                             |
| Data binding (interpolation, property binding)             | [`data-and-event-binding`](./data-and-event-binding)                         |
| Event binding                                              | [`data-and-event-binding`](./data-and-event-binding)                         |
| Two-way binding (`ngModel`)                                | [`data-and-event-binding`](./data-and-event-binding)                         |
| Built-in directives and directive types                    | [`data-and-event-binding`](./data-and-event-binding)                         |
| Custom attribute directives                                | [`custom-directives-and-control-flow`](./custom-directives-and-control-flow) |
| Built-in control flow (`@if`, `@for`, `@switch`)           | [`custom-directives-and-control-flow`](./custom-directives-and-control-flow) |
| Writable signals (`set`, `update`)                         | [`signals-and-effects`](./signals-and-effects)                               |
| Computed signals                                           | [`signals-and-effects`](./signals-and-effects)                               |
| Effects                                                    | [`signals-and-effects`](./signals-and-effects)                               |
| Linked signals                                             | [`signals-and-effects`](./signals-and-effects)                               |
| `@Input` decorator and signal `input()`                    | [`components-io`](./components-io)                                           |
| `@Output` decorator and the `output()` function            | [`components-io`](./components-io)                                           |
| `FormsModule` basics                                       | [`components-io`](./components-io)                                           |
| Content projection (`ng-content`)                          | [`components-io`](./components-io)                                           |
| Pipes for template data transformation                     | [`components-io`](./components-io)                                           |
| When to split up components                                | [`components-deep-dive`](./components-deep-dive)                             |
| Extending built-in components                              | [`components-deep-dive`](./components-deep-dive)                             |
| Multi-slot content projection                              | [`components-deep-dive`](./components-deep-dive)                             |
| View encapsulation and CSS scoping                         | [`components-deep-dive`](./components-deep-dive)                             |
| Host elements and programmatic host access                 | [`components-deep-dive`](./components-deep-dive)                             |
| Component lifecycle hooks                                  | [`components-deep-dive`](./components-deep-dive)                             |
| Template variables                                         | [`components-deep-dive`](./components-deep-dive)                             |
| Custom two-way binding (pre-17 and signal-based)           | [`components-deep-dive`](./components-deep-dive)                             |
| Browser DevTools for Angular                               | [`debugging-angular`](./debugging-angular)                                   |
| Angular DevTools extension                                 | [`debugging-angular`](./debugging-angular)                                   |
| Services and dependency injection                          | [`services-and-dependency-injection`](./services-and-dependency-injection)   |
| Injector hierarchy (root vs element injector)              | [`services-and-dependency-injection`](./services-and-dependency-injection)   |
| Injecting services into services                           | [`services-and-dependency-injection`](./services-and-dependency-injection)   |
| Injecting non-service values                               | [`services-and-dependency-injection`](./services-and-dependency-injection)   |
| Observables — what they are and how they work              | [`rxjs-and-observables`](./rxjs-and-observables)                             |
| RxJS operators and subscriptions                           | [`rxjs-and-observables`](./rxjs-and-observables)                             |
| `HttpClient` requests and responses                        | [`http-requests-and-responses`](./http-requests-and-responses)               |
| Loading and error state handling                           | [`http-requests-and-responses`](./http-requests-and-responses)               |
| Extracting HTTP calls into a service                       | [`http-requests-and-responses`](./http-requests-and-responses)               |
| HTTP interceptors                                          | [`http-requests-and-responses`](./http-requests-and-responses)               |
| Template-driven forms and validation                       | [`managing-forms`](./managing-forms)                                         |
| Reactive forms and validation                              | [`managing-forms`](./managing-forms)                                         |
| Nested form groups                                         | [`managing-forms`](./managing-forms)                                         |
| Form arrays                                                | [`managing-forms`](./managing-forms)                                         |

### Practice apps

| App                   | What it combines                                            | Folder                                                                       |
| --------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Task board            | `ngModel`, `NgClass`, control flow, typed models            | [`capstone-01-task-board`](./capstone-01-task-board)                         |
| Investment calculator | Component I/O, services, signals (migrated from decorators) | [`capstone-02-investement-calculator`](./capstone-02-investement-calculator) |

---

## Running any topic

```bash
cd <topic-folder>
npm install
ng serve
```

`http-requests-and-responses` also needs its mock API running:

```bash
cd http-requests-and-responses/backend
npm install
node app.js
```

New topic folders are created with:

```bash
npx @angular/cli@19 new <topic>
```

Formatting is the only tooling shared across the repo:

```bash
npm run format        # from the repo root
npm run format:check
```

---

## Resources I used

| Topic                 | Resource                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Angular in depth      | [Angular - The Complete Guide by Maximilian Schwarzmüller](https://www.udemy.com/course/the-complete-guide-to-angular-2) |
| Angular fundamentals  | [Learning Partner — Angular 19 Tutorial](https://www.youtube.com/playlist?list=PL7JmcZV0UQtVNlr8JrjNWzLPtVMjGH_Z2)       |
| Signals, routing gaps | [Code Steps — Angular 19 Tutorial](https://www.youtube.com/playlist?list=PL8p2I9GklV45tiZ9F_rbWnx_WHC0GCShX)             |
| Nx architecture       | [Nx with Angular](https://nx.dev/docs/technologies/angular/introduction)                                                 |
| OpenAPI generation    | [Generating OpenAPI API clients for Angular](https://blog.logrocket.com/generating-openapi-api-clients-angular/)         |
| Concept map           | [roadmap.sh — Angular](https://roadmap.sh/angular)                                                                       |

---
