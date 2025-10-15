import { Component, input } from '@angular/core';
import type { TaskItem } from '../services/dashboard-data.service';

@Component({
  standalone: true,
  imports: [],
  selector: 'tasks-widget',
  template: `
    <div
      class="rounded-xl border border-green-300/50 bg-green-50 text-green-900 p-4 shadow-sm"
    >
      <div class="flex items-center gap-2 text-sm font-medium">
        <span>✅</span>
        <span>Tasks</span>
      </div>
      <ul class="mt-2 space-y-1">
        @for (t of tasks(); track t.id) {
        <li class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            [checked]="t.completed"
            class="size-4 rounded border-green-400"
            disabled
          />
          <span [class.opacity-60]="t.completed">{{ t.title }}</span>
        </li>
        }
      </ul>
    </div>
  `,
})
export class TasksWidget {
  tasks = input<TaskItem[]>([]);
}
