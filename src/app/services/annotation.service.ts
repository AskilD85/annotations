import { Injectable } from "@angular/core";
import { Annotation } from "../models/annotation.model";
import { Article } from "../models/article.model";

@Injectable({ providedIn: 'root' })
export class AnnotationService {

  getAnnotationById(articleId: string): Annotation {
    const articles = localStorage.getItem('articles');
    let article!: Article;
    if (articles) {
       article = JSON.parse(articles).find((item: any) => item.id === articleId);
    }
    return article.annotations[0];
  }

}
