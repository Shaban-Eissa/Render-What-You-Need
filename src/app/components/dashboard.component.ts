import {
  Component,
  ViewChild,
  ViewContainerRef,
  signal,
  computed,
  inject,
  HostListener,
} from '@angular/core';
import { WeatherWidget } from '../widgets/weather-widget';
import { TasksWidget } from '../widgets/tasks-widget';
import { SalesWidget } from '../widgets/sales-widget';
import { NewsWidget } from '../widgets/news-widget';
import { GithubWidget } from '../widgets/github-widget';
import { DashboardFacade } from '../services/dashboard-facade.service';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-dashboard',
  template: `
    <div class="p-4 max-w-5xl mx-auto">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">User Dashboard</h2>
        <div class="flex items-center gap-2">
          <button
            class="px-3 py-1.5 rounded-md bg-slate-900 text-white text-sm cursor-pointer"
            (click)="reloadWidgets()"
          >
            Reload
          </button>
          <button
            class="px-3 py-1.5 rounded-md border text-sm cursor-pointer"
            (click)="toggleSettings()"
          >
            {{ showSettings() ? 'Close' : 'Customize' }}
          </button>
        </div>
      </div>

      <div class="mt-2 text-sm text-slate-600 leading-relaxed">
        <p>
          This demo shows dynamic component injection in Angular with real data
          sources and a Tailwind UI. Widgets are loaded in parallel and fully
          configurable.
        </p>
        <div class="mt-2 flex flex-wrap gap-2">
          <span class="px-2 py-0.5 text-xs rounded-full bg-slate-100"
            >Widgets: {{ selectedPublic().length }}</span
          >
          <span
            class="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-900"
            >Open‑Meteo</span
          >
          <span
            class="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-900"
            >JSONPlaceholder</span
          >
          <span
            class="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-900"
            >Hacker News</span
          >
          <span class="px-2 py-0.5 text-xs rounded-full bg-zinc-100"
            >GitHub</span
          >
        </div>
      </div>

      @if (showSettings()) {
      <div class="fixed inset-0 z-50">
        <div
          class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          (click)="toggleSettings()"
        ></div>
        <div
          class="absolute inset-0 flex items-start md:items-center justify-center p-4 md:p-6"
          (click)="$event.stopPropagation()"
        >
          <div class="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
            <div class="flex items-center justify-between p-4">
              <div>
                <div class="text-sm font-medium">Customize dashboard</div>
                <p class="text-xs text-slate-600">
                  Pick which widgets to show. Your selection is saved locally.
                </p>
              </div>
              <button
                class="px-2.5 py-1.5 text-xs rounded-md bg-slate-100 hover:bg-slate-200 cursor-pointer"
                (click)="toggleSettings()"
              >
                Close
              </button>
            </div>
            <div class="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="md:col-span-2">
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    class="rounded-lg p-3 text-left text-sm bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                    [class.ring-1]="selectedSet().has('weather')"
                    (click)="
                      toggleWidget('weather', !selectedSet().has('weather'))
                    "
                  >
                    <div class="font-medium">🌤️ Weather</div>
                    <div class="text-xs text-slate-600">
                      Current temp and wind
                    </div>
                  </button>
                  <button
                    class="rounded-lg p-3 text-left text-sm bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                    [class.ring-1]="selectedSet().has('tasks')"
                    (click)="toggleWidget('tasks', !selectedSet().has('tasks'))"
                  >
                    <div class="font-medium">✅ Tasks</div>
                    <div class="text-xs text-slate-600">Sample to‑dos list</div>
                  </button>
                  <button
                    class="rounded-lg p-3 text-left text-sm bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                    [class.ring-1]="selectedSet().has('sales')"
                    (click)="toggleWidget('sales', !selectedSet().has('sales'))"
                  >
                    <div class="font-medium">💰 Sales</div>
                    <div class="text-xs text-slate-600">7‑day mini chart</div>
                  </button>
                  <button
                    class="rounded-lg p-3 text-left text-sm bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                    [class.ring-1]="selectedSet().has('news')"
                    (click)="toggleWidget('news', !selectedSet().has('news'))"
                  >
                    <div class="font-medium">📰 News</div>
                    <div class="text-xs text-slate-600">HN front page</div>
                  </button>
                  <button
                    class="rounded-lg p-3 text-left text-sm bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                    [class.ring-1]="selectedSet().has('github')"
                    (click)="
                      toggleWidget('github', !selectedSet().has('github'))
                    "
                  >
                    <div class="font-medium">🐙 GitHub</div>
                    <div class="text-xs text-slate-600">Trending repos</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      }

      <div class="mt-4">
        @if (isLoading()) {
        <div class="text-sm opacity-70">Loading data…</div>
        } @if (errorMessage()) {
        <div class="text-sm text-red-600">{{ errorMessage() }}</div>
        }
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
        <ng-container #widgetContainer></ng-container>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  @ViewChild('widgetContainer', { read: ViewContainerRef })
  private widgetContainer!: ViewContainerRef;

  private facade = inject(DashboardFacade);

  showSettings = this.facade.showSettings;
  isLoading = this.facade.isLoading;
  errorMessage = this.facade.errorMessage;
  selectedSet = this.facade.selectedSet;
  selectedPublic = this.facade.selectedPublic;
  weather = this.facade.weather;
  tasks = this.facade.tasks;
  sales = this.facade.sales;
  news = this.facade.news;
  repos = this.facade.repos;

  toggleSettings() {
    this.facade.toggleSettings();
  }

  @HostListener('window:keydown.escape')
  onEsc() {
    if (this.showSettings()) this.showSettings.set(false);
  }

  toggleWidget(
    key: 'weather' | 'tasks' | 'sales' | 'news' | 'github',
    checked: boolean
  ) {
    this.facade.toggleWidget(key, checked);
    this.reloadWidgets();
  }

  reloadWidgets() {
    this.widgetContainer.clear();
    this.facade.loadAll().subscribe({
      next: () => this.renderSelected(),
      error: () => this.facade.errorMessage.set('Failed to load data'),
    });
  }

  private renderSelected() {
    const selection = this.selectedPublic();
    for (const key of selection) {
      if (key === 'weather') {
        const ref = this.widgetContainer.createComponent(WeatherWidget);
        ref.setInput('data', this.weather());
      }
      if (key === 'tasks') {
        const ref = this.widgetContainer.createComponent(TasksWidget);
        ref.setInput('tasks', this.tasks());
      }
      if (key === 'sales') {
        const ref = this.widgetContainer.createComponent(SalesWidget);
        ref.setInput('series', this.sales());
      }
      if (key === 'news') {
        const ref = this.widgetContainer.createComponent(NewsWidget);
        ref.setInput('items', this.news());
      }
      if (key === 'github') {
        const ref = this.widgetContainer.createComponent(GithubWidget);
        ref.setInput('repos', this.repos());
      }
    }
  }

  ngAfterViewInit() {
    this.reloadWidgets();
  }

  selectAll() {
    this.facade.selectAll();
    this.reloadWidgets();
  }
  resetDefault() {
    this.facade.resetDefault();
    this.reloadWidgets();
  }
}
