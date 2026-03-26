import { Article } from '@/models';
import { AnnotationService } from '@/services';
import { Component, ElementRef, ViewChild, Input, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-annotation',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.scss'],
  standalone: true,
})
export class AnnotationComponent implements OnInit {

  @ViewChild('content', { static: true }) contentRef!: ElementRef;
  @Input() currentArticle!: Article;

  annotationService = inject(AnnotationService) ;
  isSelectedText = false;

  ngOnInit() {
    this.loadAnnotations();
    this.setCurrentArticle();
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

    const articleId= this.currentArticle.id;
    const content = this.contentRef.nativeElement.innerHTML;

    const articles = this.articles();
    const index = (articles.map((item: Article) => item.id)).indexOf(articleId);

    if (index !== -1) {
      articles[index]['annotations'] = [];
      articles[index]['annotations'].push({ id, text: selectedText, color, note, articleId, content });
    }
    // this.currentArticle = articles[index];


    this.saveAnnotations(articles);
    selection.removeAllRanges();
  }

  articles(): Article[] {
    let articles = localStorage.getItem('articles');
    if (articles) {
      return JSON.parse(articles);
    }
    return [];
  }

  saveAnnotations(articles?: any): void {
    localStorage.setItem('articles', JSON.stringify(articles));
    this.isSelectedText = false;
    this.setCurrentArticle();
  }

  loadAnnotations(): void {
    const currentAnnotation =  this.annotationService.getAnnotationById(this.currentArticle.id);
    this.contentRef.nativeElement.innerHTML = currentAnnotation ? currentAnnotation.content : this.currentArticle.content;
  }

  setCurrentArticle() {
    const articles = localStorage.getItem('articles');
    if (articles) {
      this.currentArticle = JSON.parse(articles).find((item: any) => item.id === this.currentArticle.id);
    }
  }

  clearAnnotations(): void {
    if (confirm('Очистить аннотации?')) {
      const articles = this.articles();
      const index = (articles.map((item: Article) => item.id)).indexOf(this.currentArticle.id)
      this.currentArticle = articles[index];
      if (index !== -1) {
        articles[index]['annotations'] = [];
      }
      this.saveAnnotations(articles);
      this.loadAnnotations();
    }
  }
}
