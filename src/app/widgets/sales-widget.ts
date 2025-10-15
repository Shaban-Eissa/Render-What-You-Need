import { Component, input, computed } from '@angular/core';
import type { SalesPoint } from '../services/dashboard-data.service';

@Component({
  standalone: true,
  imports: [],
  selector: 'sales-widget',
  template: `
    <div
      class="rounded-xl border border-sky-300/50 bg-sky-50 text-sky-900 p-4 shadow-sm"
    >
      <div class="flex items-center gap-2 text-sm font-medium">
        <span>💰</span>
        <span>Sales (7d)</span>
      </div>
      <div class="mt-3 grid grid-cols-7 gap-1 items-end h-24">
        @for (p of series(); track p.label) {
        <div
          class="bg-sky-400/70 rounded"
          [style.height.%]="normalize(p.value)"
        >
          <span class="sr-only">{{ p.label }}: {{ p.value }}</span>
        </div>
        }
      </div>
      <div class="mt-2 flex justify-between text-[10px] opacity-70">
        @for (p of series(); track p.label) { <span>{{ p.label }}</span> }
      </div>
    </div>
  `,
})
export class SalesWidget {
  series = input<SalesPoint[]>([]);

  normalize(value: number): number {
    const arr = this.series() ?? [];
    if (!arr.length) return 0;
    const min = Math.min(...arr.map((s) => s.value));
    const max = Math.max(...arr.map((s) => s.value));
    if (max === min) return 50;
    return ((value - min) / (max - min)) * 100;
  }
}
