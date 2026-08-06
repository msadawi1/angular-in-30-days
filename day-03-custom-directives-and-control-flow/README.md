# Day 03 — Custom Directives and Control Flow

## Directives

### Attribute Directvies

- To create a new directive:

1. Generate the directive

``` bash
$ ng generate directive highlight
```

2. Import ElementRef from Angular core. ElementRef holds a reference to the DOM element to modify it directly through its `nativeElement` propert

3. Import `inject` from Angular core and use it in the directive constructor to inject the element reference to the DOM

``` ts
@Directive({
  selector: '[appTextHighlight]'
})
export class TextHighlightDirective {

  private element = inject(ElementRef)

  constructor() { 
    this.element.nativeElement.style.backgroundColor = 'yellow'
   }

}
```

4. Use the directive as a property to the DOM element

``` html 
<h1 appTextHighlight>
    {{ title }}
</h1>
```

> Angular creates an instance of the TextHighlightDirective class and injects a reference to the <h1> element into the directive's constructor, which sets the <h1> element's background style to yellow.

