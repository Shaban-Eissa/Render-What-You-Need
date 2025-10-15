import { Component, input } from '@angular/core';
import type { NewsItem } from '../services/dashboard-data.service';

@Component({
  standalone: true,
  selector: 'news-widget',
  imports: [],
  template: `
    <div
      class="rounded-xl border border-amber-300/50 bg-amber-50 text-amber-900 p-4 shadow-sm"
    >
      <div class="flex items-center gap-2 text-sm font-medium">
        <span>📰</span>
        <span>Top News</span>
      </div>
      <ul class="mt-2 space-y-1">
        @for (n of items(); track n.id) {
        <li class="text-sm">
          @if (n.url) {
          <a
            [href]="n.url"
            target="_blank"
            rel="noopener"
            class="hover:underline"
            >{{ n.title }}</a
          >
          } @else {
          {{ n.title }}
          }
          <span class="text-xs opacity-70"> • {{ n.points }} points</span>
        </li>
        }
      </ul>
    </div>
  `,
})
export class NewsWidget {
  items = input<NewsItem[]>([]);
}
