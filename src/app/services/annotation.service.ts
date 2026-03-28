import { computed, Injectable, signal } from "@angular/core";
import { Annotation } from "../models/annotation.model";
import { Article } from "../models/article.model";

@Injectable({ providedIn: 'root' })
export class AnnotationService {

  public readonly _getAnnotationByArticleId = signal<string | null>(null)
  public readonly getAnnotationByArticleId = computed(() => this._getAnnotationByArticleId() || null)

  getAnnotationById(articleId: string): Annotation | null {
    const articlesRaw = localStorage.getItem('articles');
    if (!articlesRaw) return null;

    let articles: Article[];

    try {
      articles = JSON.parse(articlesRaw);
    } catch {
      console.error('Invalid JSON in localStorage');
      return null;
    }

    const article = articles.find((item: Article) => item.id === articleId);
    if (!article || !article.annotations?.length) {
      return null;
    }

    const annotation = article.annotations[0];

    this._getAnnotationByArticleId.set(annotation.content);

    return annotation;
  }

  setAnnotationByArticleId(text: string) {
    this._getAnnotationByArticleId.set(text)
  }
}
