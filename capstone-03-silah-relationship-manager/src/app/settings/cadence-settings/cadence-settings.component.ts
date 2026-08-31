import { Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { CardComponent } from '../../shared/ui/card/card.component';
import { CadenceConfig } from '../../core/models/cadence-config.model';
import { relationshipBaselineToken } from '../../core/tokens/relationship-baseline.token';
import { Relationship } from '../../core/models/relationship.model';
import { FormsModule } from '@angular/forms';
import { CadenceConfigService } from '../../core/services/cadence-config.service';
import { RelationshipLabelPipe } from '../../shared/pipes/relationship-label.pipe';

@Component({
  selector: 'app-cadence-settings',
  imports: [CardComponent, FormsModule, RelationshipLabelPipe],
  templateUrl: './cadence-settings.component.html',
  styleUrl: './cadence-settings.component.css',
})
export class CadenceSettingsComponent {
  cadenceConfig = input.required<CadenceConfig>();
  private relationshipBaseline = inject(relationshipBaselineToken);
  private cadenceConfigService = inject(CadenceConfigService);
  private destroyRef = inject(DestroyRef);

  // false for every relationship until its edit form is toggled open.
  private shownForms = signal<Partial<Record<Relationship, boolean>>>({});

  cadenceConfigArray = computed(() => {
    const overrides = this.cadenceConfig();
    const shownForms = this.shownForms();

    return this.relationshipBaseline.map((entry) => ({
      value: entry.value,
      frequency: overrides[entry.value] ?? entry.defaultCadenceDays,
      showForm: shownForms[entry.value] ?? false,
    }));
  });

  toggleForm(type: Relationship): void {
    this.shownForms.update((shownForms) => ({
      ...shownForms,
      [type]: !shownForms[type],
    }));
  }

  onSaveCadence(relationship: Relationship, value: string, currentCadence: number) {
    const newCadence = Number(value);
    if (!Number.isInteger(newCadence) || newCadence < 1) return;

    if (newCadence === currentCadence) {
      this.toggleForm(relationship);
      return;
    }

    const sub = this.cadenceConfigService
      .updateUserCadenceConfig(relationship, newCadence, false)
      .subscribe({ next: () => this.toggleForm(relationship) });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
