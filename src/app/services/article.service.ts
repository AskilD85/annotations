import { BehaviorSubject } from "rxjs";
import { Article } from "../models/article.model";
import { StorageService } from "./storage.service";
import { Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private articles$ = new BehaviorSubject<Article[]>([]);

  constructor(private storage: StorageService, private notificationService: NotificationService) {
    this.articles$.next(this.storage.getArticles());
  }

  getAll() {
    return this.articles$.asObservable();
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

    console.log('updated ', updated);

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
    this.storage.saveArticles(data);
  }
}
