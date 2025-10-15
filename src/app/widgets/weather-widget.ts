import { Component, input } from '@angular/core';
import type { WeatherData } from '../services/dashboard-data.service';

@Component({
  standalone: true,
  selector: 'weather-widget',
  template: `
    <div
      class="rounded-xl border border-yellow-300/50 bg-yellow-50 text-yellow-900 p-4 shadow-sm"
    >
      <div class="flex items-center gap-2 text-sm font-medium">
        <span>🌤️</span>
        <span>Weather</span>
      </div>
      <div class="mt-2 flex items-end justify-between">
        <div>
          <div class="text-3xl font-semibold">
            {{ data()?.temperatureC ?? '—' }}°C
          </div>
          <div class="text-xs opacity-80">{{ data()?.city }}</div>
        </div>
        <div class="text-sm">💨 {{ data()?.windKph ?? '—' }} kph</div>
      </div>
      <div class="mt-1 text-xs opacity-80">{{ data()?.description }}</div>
    </div>
  `,
})
export class WeatherWidget {
  data = input<WeatherData | undefined>(undefined);
}
