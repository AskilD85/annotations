import { computed, Injectable, signal } from "@angular/core";
import { Annotation } from "../models/annotation.model";
import { Article } from "../models/article.model";

@Injectable({ providedIn: 'root' })
export class AnnotationService {

  public readonly _getAnnotationByArticleId = signal<string | null>(null)
  public readonly getAnnotationByArticleId = computed(() => this._getAnnotationByArticleId() || null)

  getAnnotationById(articleId: string):  Annotation {
    const articles = localStorage.getItem('articles');
    let article!: Article;
    if (articles) {
       article = JSON.parse(articles).find((item: any) => item.id === articleId);
    }
    this._getAnnotationByArticleId.set(article.annotations.length ? article.annotations[0].content : '')
    return article.annotations[0];
  }

  setAnnotationByArticleId(text: string) {
    this._getAnnotationByArticleId.set(text)
  }
}
