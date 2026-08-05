<div align="center">

# 30 Days of Handwritten Angular

**Every line of Angular in this repo was typed by hand.**

A day-by-day record of going from React/TypeScript to a production Angular 19 + Nx codebase.

[![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.dev)
[![Nx](https://img.shields.io/badge/Nx-monorepo-143055?style=flat-square&logo=nx&logoColor=white)](https://nx.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![RxJS](https://img.shields.io/badge/RxJS-7.x-B7178C?style=flat-square&logo=reactivex&logoColor=white)](https://rxjs.dev)
[![Days](https://img.shields.io/badge/progress-0%2F30-lightgrey?style=flat-square)](#day-index)

</div>

---

## Why this repo exists

I have one year of writing frontends in React and TypeScript. I am willing to join a team that runs an **Angular 19 codebase inside an Nx monorepo**, with **multiple portals in one workspace** and API services **generated from an OpenAPI specification**.

## The one rule

> **No AI writes Angular code in this repo.**

AI generated the backend API and its OpenAPI spec for the final project only.

---

## Repo structure

```
.
├── day-01/
├── day-02/
├── day-03/
│   └── ...
├── day-30-.../
│
├── app/                          # the capstone project
│   ├── README.md                 # its own architecture docs
│   ├── apps/
│   └── libs/
│
└── README.md                     # you are here
```

Each day stands alone. You can open `day-14` and run it without touching anything else. The `app/` folder is the only place where everything comes together.

---

## Day index

Filled in as I go. Each day links to its folder; each folder explains itself.

### Phase A — Angular core

| Day | Topic | Folder |
|:---:|---|---|
| 01 | Setup, CLI, component anatomy | [`day-01-setup-and-components`](./day-01-setup-and-components) |
| 02 | Data binding | [`day-02-data-binding`](./day-02-data-binding) |
| 03 | Control flow and directives | [`day-03-control-flow`](./day-03-control-flow) |
| — | Signals, routing, forms, HTTP, interceptors | _pending_ |

### Phase B — The language of the framework

| Day | Topic | Folder |
|:---:|---|---|
| — | Dependency injection, signal inputs, RxJS, Subjects, signal interop | _pending_ |

### Phase C — Application plumbing

| Day | Topic | Folder |
|:---:|---|---|
| — | Guards, error handling, custom validators, `FormArray`, typed forms, `OnPush` | _pending_ |

### Phase D — The company stack

| Day | Topic | Folder |
|:---:|---|---|
| — | Nx workspace, library taxonomy, module boundaries, OpenAPI codegen | _pending_ |

### Phase E — The capstone

| Day | Topic | Folder |
|:---:|---|---|
| — | Two-portal exam platform | [`app`](./app) |

---

## Day folder convention

Every day folder carries its own `README.md` so the code is never context-free. The template:

```markdown
# Day NN — <topic>

**Concepts:** signal(), computed(), effect()
**Time:** ~2h
**Source:** <link to the video, article, or doc section>

## What I built
One or two sentences. What the code in this folder actually does.

## What clicked
The thing I now understand that I didn't this morning.

## What didn't
The thing I got wrong, the error message I hit, or the concept I'm still shaky on.

## Relateion to my experience
The mapping, or the absence of one. This is the section future me will reread.
```

The last section is the point of the whole exercise. Angular concepts that have no React analogue are the ones that will bite me at work, and writing them down forces me to admit which ones I'm faking.

---

## The capstone app

`app/` is a **two-portal exam platform** built in a single Nx workspace:

| Portal | Purpose |
|---|---|
| **Admin** | Create and manage exams, questions, students |
| **Student** | Browse exams, sit them, view results |

Both consume one OpenAPI-generated API client and one shared UI library, but have separate route trees, guards, and lazy-loaded bundles. Library boundaries are enforced by `@nx/enforce-module-boundaries` — a bad import fails lint, not code review.

Full architecture, setup, and commands are in [`app/README.md`](./app/README.md).

---

## Resources I actually used

| Topic | Resource |
|---|---|
| Angular fundamentals | [Learning Partner — Angular 19 Tutorial](https://www.youtube.com/playlist?list=PL7JmcZV0UQtVNlr8JrjNWzLPtVMjGH_Z2) |
| Signals, routing gaps | [Code Steps — Angular 19 Tutorial](https://www.youtube.com/playlist?list=PL8p2I9GklV45tiZ9F_rbWnx_WHC0GCShX) |
| Dependency injection | [Angular University — DI Complete Guide](https://blog.angular-university.io/angular-dependency-injection/) |
| Signal inputs | [Angular University — Signal Components](https://blog.angular-university.io/angular-signal-components/) |
| RxJS, first pass | [Angular University — RxJs for Beginners](https://blog.angular-university.io/functional-reactive-programming-for-angular-2-developers-rxjs-and-observables/) |
| RxJS, practical map | [Ultimate Practical Guide to RxJS in Angular](https://dev.to/abanoubkerols/ultimate-practical-guide-to-rxjs-in-angular-2026-from-zero-to-pro-with-full-examples-5h85) |
| RxJS, depth | [RxJs In Practice — Angular University](https://www.udemy.com/course/rxjs-course/) |
| Guards, lazy loading, HTTP | [Packt — Advanced Angular Development and RxJS](https://www.coursera.org/learn/packt-advanced-angular-development-and-rxjs-dlpce) |
| Nx architecture | [Nx with Angular](https://nx.dev/docs/technologies/angular/introduction) |
| OpenAPI generation | [Generating OpenAPI API clients for Angular](https://blog.logrocket.com/generating-openapi-api-clients-angular/) |
| Concept map | [roadmap.sh — Angular](https://roadmap.sh/angular) |

---

<div align="center">
<sub>Built to learn, not to ship. Corrections welcome — open an issue.</sub>
</div>
