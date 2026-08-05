# Day 01 — Setup and Components

**Concepts:** Angular architecture & setting up a project
**Time:** ~4
**Sources:** 

## Setting up a project

1. Install Angular CLI

``` cli
npm i -g angular@cli
```

2. Create a new project using Angular CLI
``` cli
ng new <project-name>
```

3. Running the app
``` cli
ng serve --open
```

The ng serve command launches the server, watches your files, as well as rebuilds the app and reloads the browser as you make changes to those files.

Note: --open to open browser automatically

## Angular Architecture

Angular is a single page application (SPA) framework, `index.html` is the default app template, while the bootstrapping boint is `main.ts`.

1. **Components** : Reusable UI pieces, has HTML & CSS bundled in a single file
2. **Services**: Shared logic
3. **Modules**: Groups of related components and services
4. **Templates**: HTML files with special Angular syntax

## Components

- Each Angular component has three parts:
1. TypeScript class
2. HTML template
3. CSS styles

- Templates and styles can be inline or via a file URL.

- Components are declared using the `@Component({})` decorator, example:
``` ts
import { Component } from '@angular/core'

@Component({
    selector: 'profile',
    'templateUrl: './profile.html',
    'styleUrl: './profile.css',
})
export class Profile() {
    name = 'Angular'
}
```
Notes:
1. Component member variables are accessible by the template, either inline or external.
2. 

## Summary

List of most important things learnt during this day