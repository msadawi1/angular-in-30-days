import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CadenceSettingsComponent } from './cadence-settings/cadence-settings.component';
import { CadenceConfigService } from '../core/services/cadence-config.service';

@Component({
  selector: 'app-settings',
  imports: [CadenceSettingsComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  private cadenceConfigService = inject(CadenceConfigService);
  private destroyRef = inject(DestroyRef);
  cadenceConfig = this.cadenceConfigService.loadedUserCadenceConfig;

  // get the config on load
  ngOnInit(): void {
    this.cadenceConfigService.loadUserCadenceConfig().subscribe();
  }

  onResetDefaults() {
    const sub = this.cadenceConfigService.resetToDefault().subscribe();

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
