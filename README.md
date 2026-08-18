<div align="center">

# Learning Angular in <30d

**Every line of Angular in this repo was typed by hand.**

A topic-by-topic record of going from React/TypeScript to a production Angular 19 + Nx codebase.

[![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.dev)
[![Nx](https://img.shields.io/badge/Nx-monorepo-143055?style=flat-square&logo=nx&logoColor=white)](https://nx.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![RxJS](https://img.shields.io/badge/RxJS-7.x-B7178C?style=flat-square&logo=reactivex&logoColor=white)](https://rxjs.dev)

</div>

---

## Why this repo exists

I am willing to join a team that runs an **Angular 19 codebase inside an Nx monorepo**, with **multiple portals in one workspace** and API services **generated from an OpenAPI specification**.

## The one rule

> **No AI writes Angular code in this repo.**

AI generated the backend API and its OpenAPI spec for the final project only.

---

## Repo structure

```
.
├── setup-and-components/
├── data-and-event-binding/
├── custom-directives-and-control-flow/
│   └── ...
├── <topic>/
│
├── capstone-01-task-board/       # practice apps that combine several topics
├── capstone-02-investement-calculator/
│
├── app/                          # the final project
│   ├── README.md                 # its own architecture docs
│   ├── apps/
│   └── libs/
│
└── README.md                     # you are here
```

Each topic folder stands alone. You can open `components-deep-dive` and run it without touching anything else. The `app/` folder is the only place where everything comes together.

---

## Topic index

Filled in as I go. Each entry links to its folder; each folder explains itself.

### Phase A — Angular core

| Topic                              | Folder                                                                       |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| Setup, CLI, component anatomy      | [`setup-and-components`](./setup-and-components)                             |
| Data and event binding             | [`data-and-event-binding`](./data-and-event-binding)                         |
| Custom directives and control flow | [`custom-directives-and-control-flow`](./custom-directives-and-control-flow) |
| Signals and effects                | [`signals-and-effects`](./signals-and-effects)                               |
| Component inputs and outputs       | [`components-io`](./components-io)                                           |
| Components deep dive               | [`components-deep-dive`](./components-deep-dive)                             |
| Debugging and Angular DevTools     | [`debugging-angular`](./debugging-angular)                                   |
| Routing, forms, HTTP, interceptors | _pending_                                                                    |

### Phase B — The language of the framework

| Topic                                                               | Folder    |
| ------------------------------------------------------------------- | --------- |
| Dependency injection, signal inputs, RxJS, Subjects, signal interop | _pending_ |

### Phase C — Application plumbing

| Topic                                                                         | Folder    |
| ----------------------------------------------------------------------------- | --------- |
| Guards, error handling, custom validators, `FormArray`, typed forms, `OnPush` | _pending_ |

### Phase D — The company stack

| Topic                                                              | Folder    |
| ------------------------------------------------------------------ | --------- |
| Nx workspace, library taxonomy, module boundaries, OpenAPI codegen | _pending_ |

### Practice apps

| App                   | Folder                                                                       |
| --------------------- | ---------------------------------------------------------------------------- |
| Task board            | [`capstone-01-task-board`](./capstone-01-task-board)                         |
| Investment calculator | [`capstone-02-investement-calculator`](./capstone-02-investement-calculator) |

### Phase E — The final project

| Topic                    | Folder         |
| ------------------------ | -------------- |
| Two-portal exam platform | [`app`](./app) |

---

## Folder convention

Every topic folder carries its own `README.md` so the code is never context-free. The template:

Starting a project

```cli
npx @angular/cli@19 new <topic>
```

---

## The final app

`app/` is a **two-portal exam platform** built in a single Nx workspace:

| Portal      | Purpose                                      |
| ----------- | -------------------------------------------- |
| **Admin**   | Create and manage exams, questions, students |
| **Student** | Browse exams, sit them, view results         |

Both consume one OpenAPI-generated API client and one shared UI library, but have separate route trees, guards, and lazy-loaded bundles. Library boundaries are enforced by `@nx/enforce-module-boundaries` — a bad import fails lint, not code review.

Full architecture, setup, and commands are in [`app/README.md`](./app/README.md).

---

## Resources I used

| Topic                 | Resource                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Angular in Depth      | [Angular - The Complete Guide by Maximilian Schwarzmüller](https://www.udemy.com/course/the-complete-guide-to-angular-2) |
| Angular fundamentals  | [Learning Partner — Angular 19 Tutorial](https://www.youtube.com/playlist?list=PL7JmcZV0UQtVNlr8JrjNWzLPtVMjGH_Z2)       |
| Signals, routing gaps | [Code Steps — Angular 19 Tutorial](https://www.youtube.com/playlist?list=PL8p2I9GklV45tiZ9F_rbWnx_WHC0GCShX)             |
| Nx architecture       | [Nx with Angular](https://nx.dev/docs/technologies/angular/introduction)                                                 |
| OpenAPI generation    | [Generating OpenAPI API clients for Angular](https://blog.logrocket.com/generating-openapi-api-clients-angular/)         |
| Concept map           | [roadmap.sh — Angular](https://roadmap.sh/angular)                                                                       |

---
