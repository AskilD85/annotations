import { Article } from '@/models';
import { AnnotationService, ArticleService } from '@/services';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject, effect } from '@angular/core';

@Component({
  selector: 'app-annotation',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class AnnotationComponent {

  @ViewChild('content', { static: true }) contentRef!: ElementRef;

  annotationService = inject(AnnotationService) ;
  articleService    = inject(ArticleService);

  sArticle = this.articleService.selectedArticle;
  isSelectedText = false;

  sAnnotation = this.annotationService.getAnnotationByArticleId;
  sArticles = this.articleService.articles;

  constructor() {
    effect(() => {
      this.contentRef.nativeElement.innerHTML =  this.sAnnotation()?.length ? this.sAnnotation() : this.sArticle()?.content;
    });
  }

  onSelect() {
    const text = window.getSelection()?.toString();
    this.isSelectedText = !!text;
  }

  applyAnnotation(color: string): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText.trim()) return;

    const note = prompt('Введите аннотацию:') || '';

    const span = document.createElement('span');
    const id = Date.now().toString();

    span.className = 'annotated';
    span.style.backgroundColor = color;
    span.style.textDecoration = `underline`;
    span.setAttribute('data-id', id);
    span.setAttribute('data-note', note);
    span.setAttribute('title', note);

    const fragment = range.extractContents();
    span.appendChild(fragment);
    range.insertNode(span);

    const articleId = this.sArticle()!.id;
    const content = this.contentRef.nativeElement.innerHTML;

    const articles = this.articles();
    const index = (articles.map((item: Article) => item.id)).indexOf(articleId);

    if (index !== -1) {
      articles[index]['annotations'] = [];
      articles[index]['annotations'].push({ id, text: selectedText, color, note, articleId, content });
    }

    this.saveArticles(articles);
    selection.removeAllRanges();
  }

  articles(): Article[] {
    let articles = localStorage.getItem('articles');
    if (articles) {
      return JSON.parse(articles);
    }
    return [];
  }

  saveArticles(articles?: any): void {
    this.articleService.setArticles(articles);
    this.isSelectedText = false;
  }

  clearAnnotations(): void {
    if (confirm('Очистить аннотации?')) {
      const articles = this.sArticles();
      const index = (articles.map((item: Article) => item.id)).indexOf(this.sArticle()!.id)
      if (index !== -1) {
        articles[index]['annotations'] = [];
      }
      this.saveArticles(articles);
    }
  }
}
