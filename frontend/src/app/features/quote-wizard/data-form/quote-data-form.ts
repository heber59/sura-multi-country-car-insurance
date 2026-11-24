import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, Injector, input, output, signal } from '@angular/core';
import { Market } from '../../../core/market/market.config';
import { getInvalidQuoteFields, getQuoteValue } from './logic/validate-quote-values';
import { QuoteField, QuoteFieldSection, QuoteValue, QuoteValues } from './types/quote-field';

interface FieldGroup {
  readonly section: QuoteFieldSection;
  readonly fields: QuoteField[];
}

@Component({
  selector: 'app-quote-data-form',
  templateUrl: './quote-data-form.html',
  styleUrl: './quote-data-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteDataForm {
  readonly fields = input.required<readonly QuoteField[]>();
  readonly values = input.required<QuoteValues>();
  readonly market = input.required<Market>();
  readonly completed = output<QuoteValues>();
  private readonly injector = inject(Injector);
  private readonly edits = signal<QuoteValues>({});
  private readonly touched = signal<ReadonlySet<string>>(new Set());
  private readonly submitted = signal(false);
  private readonly draft = computed(() => ({
    ...Object.fromEntries(this.fields().map((field) => [field.key, this.getInitialValue(field)])),
    ...this.edits(),
  }));
  private readonly invalidFields = computed(() =>
    new Set(getInvalidQuoteFields(this.fields(), this.draft(), this.market()).map(({ key }) => key)),
  );

  protected readonly groups = computed(() => {
    const groups: FieldGroup[] = [];
    for (const field of this.fields()) {
      const lastGroup = groups.at(-1);
      if (lastGroup?.section === field.section) {
        lastGroup.fields.push(field);
      } else {
        groups.push({ section: field.section, fields: [field] });
      }
    }
    return groups;
  });

  protected getInitialValue(field: QuoteField): QuoteValue | undefined {
    const value = getQuoteValue(this.values(), field.key);
    if (field.type === 'select' && !field.options.some((option) => option.value === value)) {
      return undefined;
    }
    return value;
  }

  protected setValue(key: string, value: QuoteValue): void {
    this.edits.update((edits) => ({ ...edits, [key]: value }));
  }

  protected setInputValue(field: QuoteField, inputElement: HTMLInputElement): void {
    if (field.type === 'number' && (inputElement.value || inputElement.validity.badInput)) {
      this.setValue(field.key, inputElement.valueAsNumber);
    } else {
      this.setValue(field.key, inputElement.value);
    }
  }

  protected markTouched(key: string): void {
    this.touched.update((touched) => new Set([...touched, key]));
  }

  protected showError(field: QuoteField): boolean {
    return (this.submitted() || this.touched().has(field.key)) && this.invalidFields().has(field.key);
  }

  protected fieldDescription(field: QuoteField, hasError: boolean): string | null {
    const helpId = field.helpText ? 'quote-help-' + field.key : '';
    const errorId = hasError ? 'quote-error-' + field.key : '';
    return [helpId, errorId].filter(Boolean).join(' ') || null;
  }

  protected submit(event: Event, form: HTMLFormElement): void {
    event.preventDefault();
    this.submitted.set(true);

    const draft = this.draft();
    const fields = this.fields();
    const [firstInvalid] = getInvalidQuoteFields(fields, draft, this.market());
    if (firstInvalid) {
      afterNextRender(() => {
        const control = form.elements.namedItem('quote-field-' + firstInvalid.key);
        if (control instanceof HTMLElement) {
          control.focus();
        }
      }, { injector: this.injector });
      return;
    }

    const values: Record<string, QuoteValue> = {};
    for (const { key } of fields) {
      const value = getQuoteValue(draft, key);
      if (value !== undefined) {
        values[key] = typeof value === 'string' ? value.trim() : value;
      }
    }
    this.completed.emit(values);
  }
}
