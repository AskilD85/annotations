import { Article } from "@/models";
import { computed, inject, Injectable, signal } from "@angular/core";
import { AnnotationService } from "./annotation.service";
import { StorageService } from "./storage.service";
import { NotificationService } from "./notification.service";

@Injectable({ providedIn: 'root' })
export class ArticleService {

  private annotationService   = inject(AnnotationService);
  private storageService      = inject(StorageService);
  private notificationService = inject(NotificationService);

  private readonly _articles = signal<Article[]>([]);
  readonly articles = computed(() => this._articles());

  private readonly _selectedId = signal<string | null>(null);
  readonly selectedArticle = computed(() =>
    this._articles().find(a => a.id === this._selectedId()) ?? null
  );

  constructor() {
    this._articles.set(this.storageService.getArticles());
  }

  getById(id: string) {
    return this._articles().find(a => a.id === id) ?? null;
  }

  create(article: Article) {
    const updated = [...this._articles(), article];
    this.update(updated);
    this.notificationService.updateText('Успешно создано!');
  }

  updateArticle(article: Article) {
    const updated = this._articles().map(a =>
      a.id === article.id ? article : a
    );
    this.update(updated);
    this.notificationService.updateText('Успешно отредактировано!');
  }

  delete(id: string) {
    const updated = this._articles().filter(a => a.id !== id);
    this.update(updated);
    this.notificationService.updateText('Успешно удалено!');
  }

  private update(data: Article[]) {
    this._articles.set(data);
    this.storageService.saveArticles(data);
  }

  selectArticle(id: string) {
    this._selectedId.set(id);

    const article = this.selectedArticle();
    if (!article) return;

    this.annotationService.getAnnotationById(id);

    const firstAnnotation = article.annotations?.[0]?.content ?? '';
    this.annotationService.setAnnotationByArticleId(firstAnnotation);
  }

  setArticles(articles: Article[]) {
    this.update(articles);

    if (this.selectedArticle()) {
      const firstAnnotation =
        this.selectedArticle()?.annotations?.[0]?.content ?? '';
      this.annotationService.setAnnotationByArticleId(firstAnnotation);
    }
  }
}
