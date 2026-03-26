import { Injectable } from "@angular/core";
import { Article } from "../models/article.model";

@Injectable({ providedIn: 'root' })
export class StorageService {
  private KEY = 'articles';

  getArticles(): Article[] {
    return JSON.parse(localStorage.getItem(this.KEY) || '[]');
  }

  saveArticles(articles: Article[]) {
    localStorage.setItem(this.KEY, JSON.stringify(articles));
  }
}
