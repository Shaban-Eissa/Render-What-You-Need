import { Component, input } from '@angular/core';
import type { RepoItem } from '../services/dashboard-data.service';

@Component({
  standalone: true,
  selector: 'github-widget',
  imports: [],
  template: `
    <div
      class="rounded-xl border border-zinc-300/60 bg-white text-zinc-900 p-4 shadow-sm"
    >
      <div class="flex items-center gap-2 text-sm font-medium">
        <span>🐙</span>
        <span>Trending Repos</span>
      </div>
      <ul class="mt-2 space-y-1">
        @for (r of repos(); track r.id) {
        <li class="text-sm flex items-center justify-between gap-2">
          <a
            [href]="r.url"
            target="_blank"
            rel="noopener"
            class="hover:underline truncate"
            >{{ r.name }}</a
          >
          <span class="text-xs px-1.5 py-0.5 rounded bg-zinc-100"
            >★ {{ r.stars }}</span
          >
        </li>
        }
      </ul>
    </div>
  `,
})
export class GithubWidget {
  repos = input<RepoItem[]>([]);
}
