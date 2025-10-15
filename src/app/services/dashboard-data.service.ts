import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

export interface WeatherData {
  temperatureC: number;
  windKph: number;
  description: string;
  city: string;
}

export interface TaskItem {
  id: number;
  title: string;
  completed: boolean;
}

export interface SalesPoint {
  label: string;
  value: number;
}

export interface NewsItem {
  id: string;
  title: string;
  url: string | null;
  points: number;
}

export interface RepoItem {
  id: number;
  name: string;
  url: string;
  stars: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  http = inject(HttpClient);

  fetchWeather(lat = 40.7128, lon = -74.006): Observable<WeatherData> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    return this.http.get<any>(url).pipe(
      map((res) => {
        const current = res?.current_weather ?? {};
        return {
          temperatureC: Number(current.temperature ?? 20),
          windKph: Number(current.windspeed ?? 10),
          description: 'Current conditions',
          city: 'New York',
        } satisfies WeatherData;
      })
    );
  }

  fetchTasks(limit = 5): Observable<TaskItem[]> {
    const url = `https://jsonplaceholder.typicode.com/todos?_limit=${limit}`;
    return this.http.get<TaskItem[]>(url).pipe(
      map((items) =>
        items.map((t) => ({
          id: t.id,
          title: t.title,
          completed: t.completed,
        }))
      )
    );
  }

  fetchSales(days = 7): Observable<SalesPoint[]> {
    const today = new Date();
    const points: SalesPoint[] = Array.from({ length: days }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (days - 1 - i));
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      const value = Math.round(
        2000 + Math.sin(i / 2) * 500 + Math.random() * 400
      );
      return { label, value };
    });
    return new Observable((subscriber) => {
      // Simulate async fetch
      setTimeout(() => {
        subscriber.next(points);
        subscriber.complete();
      }, 300);
    });
  }

  fetchNews(limit = 5): Observable<NewsItem[]> {
    const url = `https://hn.algolia.com/api/v1/search?tags=front_page`;
    return this.http.get<any>(url).pipe(
      map((res) =>
        (res?.hits ?? []).slice(0, limit).map(
          (h: any) =>
            ({
              id: String(h.objectID),
              title: h.title ?? 'Untitled',
              url: h.url ?? null,
              points: Number(h.points ?? 0),
            } as NewsItem)
        )
      )
    );
  }

  fetchGithubRepos(
    query = 'angular language:typescript',
    limit = 5
  ): Observable<RepoItem[]> {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
      query
    )}&sort=stars&order=desc&per_page=${limit}`;
    return this.http.get<any>(url).pipe(
      map((res) =>
        (res?.items ?? []).map(
          (r: any) =>
            ({
              id: Number(r.id),
              name: String(r.full_name),
              url: String(r.html_url),
              stars: Number(r.stargazers_count ?? 0),
            } as RepoItem)
        )
      )
    );
  }

  fetchAll(
    lat?: number,
    lon?: number
  ): Observable<{
    weather: WeatherData;
    tasks: TaskItem[];
    sales: SalesPoint[];
    news: NewsItem[];
    repos: RepoItem[];
  }> {
    return forkJoin({
      weather: this.fetchWeather(lat, lon),
      tasks: this.fetchTasks(),
      sales: this.fetchSales(),
      news: this.fetchNews(),
      repos: this.fetchGithubRepos(),
    });
  }
}
