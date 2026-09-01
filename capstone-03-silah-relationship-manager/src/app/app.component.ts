import { afterNextRender, Component, inject } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { LogContactModalComponent } from './profile/log-contact-modal/log-contact-modal.component';
import { ContactLogService } from './core/services/contact-log.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [HeaderComponent, FooterComponent, RouterOutlet, LogContactModalComponent],
})
export class AppComponent {
  title = 'Silah - Bring People Closer';

  private contactLogService = inject(ContactLogService);
  person = this.contactLogService.targetPerson;
}
