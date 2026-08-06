import { Directive } from '@angular/core';
import { ElementRef, inject, HostListener } from '@angular/core';

@Directive({
  selector: '[appTextHighlight]'
})
export class TextHighlightDirective {

  private element = inject(ElementRef)

  @HostListener("mouseenter") onMouseEnter() {
    this.highlight('yellow')
  }

  @HostListener("mouseleave") onMouseLeave() {
    this.highlight('')
  }

  highlight(color: 'yellow' | '') {
    this.element.nativeElement.style.backgroundColor = color
  }

}
