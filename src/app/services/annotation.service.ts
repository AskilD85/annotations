import { Injectable } from "@angular/core";
import { Annotation } from "../models/annotation.model";
import { Article } from "../models/article.model";

@Injectable({ providedIn: 'root' })
export class AnnotationService {

  createAnnotation(container: HTMLElement, color: string, note: string): Annotation | null {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const text = range.toString();
    if (!text.trim()) return null;

    const articleId = 'articleId';

    // Оборачиваем в span
    const span = document.createElement('span');
    span.style.borderBottom = `2px solid ${color}`;
    span.dataset['annotation'] = note;
    span.dataset['color'] = color;
    span.classList.add('annotated');

    range.surroundContents(span);

    return {
      id: crypto.randomUUID(),
      text: note,
      color,
      articleId,
      note,
      content: ''
    };
  }

  getAnnotationById(articleId: string): Annotation {
    const articles = localStorage.getItem('articles');
    let article!: Article;
    if (articles) {
       article = JSON.parse(articles).find((item: any) => item.id === articleId);
    }
    return article.annotations[0];
  }

}
