import { Injectable, computed, inject, signal } from '@angular/core';
import {
  DashboardDataService,
  type WeatherData,
  type TaskItem,
  type SalesPoint,
  type NewsItem,
  type RepoItem,
} from './dashboard-data.service';
import { Observable, tap, finalize } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private dataService = inject(DashboardDataService);

  // UI state
  showSettings = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  // Selection state
  private selected = signal<string[]>(this.readPersistedSelection());
  selectedSet = computed(() => new Set(this.selected()));
  selectedPublic = computed(() => this.selected());

  // Data cache
  weather = signal<WeatherData | undefined>(undefined);
  tasks = signal<TaskItem[]>([]);
  sales = signal<SalesPoint[]>([]);
  news = signal<NewsItem[]>([]);
  repos = signal<RepoItem[]>([]);

  toggleSettings() {
    this.showSettings.update((v) => !v);
  }

  toggleWidget(
    key: 'weather' | 'tasks' | 'sales' | 'news' | 'github',
    checked: boolean
  ) {
    const set = new Set(this.selected());
    if (checked) set.add(key);
    else set.delete(key);
    const next = Array.from(set);
    this.selected.set(next);
    this.persistSelection(next);
  }

  selectAll() {
    const all = ['weather', 'tasks', 'sales', 'news', 'github'];
    this.selected.set(all);
    this.persistSelection(all);
  }

  resetDefault() {
    const def = ['weather', 'tasks', 'sales'];
    this.selected.set(def);
    this.persistSelection(def);
  }

  loadAll(
    lat?: number,
    lon?: number
  ): Observable<{
    weather: WeatherData;
    tasks: TaskItem[];
    sales: SalesPoint[];
    news: NewsItem[];
    repos: RepoItem[];
  }> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    return this.dataService.fetchAll(lat, lon).pipe(
      tap(({ weather, tasks, sales, news, repos }) => {
        this.weather.set(weather);
        this.tasks.set(tasks);
        this.sales.set(sales);
        this.news.set(news);
        this.repos.set(repos);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  private persistSelection(keys: string[]) {
    try {
      localStorage.setItem('dashboard.widgets', JSON.stringify(keys));
    } catch {}
  }

  private readPersistedSelection(): string[] {
    try {
      const raw = localStorage.getItem('dashboard.widgets');
      if (!raw) return ['weather', 'tasks', 'sales'];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string'))
        return parsed;
      return ['weather', 'tasks', 'sales'];
    } catch {
      return ['weather', 'tasks', 'sales'];
    }
  }
}
