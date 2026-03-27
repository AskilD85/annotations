import { BehaviorSubject } from "rxjs";
import { Article } from "../models/article.model";
import { StorageService } from "./storage.service";
import { computed, inject, Injectable, signal } from "@angular/core";
import { NotificationService } from "./notification.service";
import { AnnotationService } from './annotation.service';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private articles$ = new BehaviorSubject<Article[]>([]);

  private annotationService   = inject(AnnotationService);
  private storageService      = inject(StorageService);
  private notificationService = inject(NotificationService);

  private readonly _articles = signal<Article[]>([]);
  public readonly articles = computed(() => this._articles() || null );

  private readonly _selectedId = signal<string | null>(null);
  public readonly selectedArticle = computed(() => this._articles().find(a => a.id === this._selectedId()) || null );

  constructor() {
    this.articles$.next(this.storageService.getArticles());
    this.loadFromStorage();
  }

  getById(id: string) {
    return this.articles$.value.find(a => a.id === id);
  }

  create(article: Article) {
    const updated = [...this.articles$.value, article];
    this.notificationService.updateText('Успешно создано!');
    this.update(updated);
  }

  updateArticle(article: Article) {
    const updated = this.articles$.value.map(a =>
      a.id === article.id ? article : a
    );
    this.update(updated);
    this.notificationService.updateText('Успешно отредактировано!');
  }

  delete(id: string) {
    const updated = this.articles$.value.filter(a => a.id !== id);
    this.notificationService.updateText('Успешно удалено!');
    this.update(updated);
  }

  private update(data: Article[]) {
    this.articles$.next(data);
    this.storageService.saveArticles(data);
    this._articles.set(data);
  }

  selectArticle(id: string) {
    this._selectedId.set(id);
    if (this.selectedArticle()) {
      this.annotationService.getAnnotationById(id);
    }
  }

  private loadFromStorage() {
    this._articles.set(this.storageService.getArticles());
  }

  setArticles(articles: Article[]) {
    this.storageService.saveArticles(articles);
    this._articles.set(articles);
    if (this.selectedArticle()) {
      this.selectedArticle()?.annotations.length
      ? this.annotationService.setAnnotationByArticleId(this.selectedArticle()?.annotations[0].content as string)
      : this.annotationService.setAnnotationByArticleId('');
    }
  }
}
