import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
  computed,
  effect,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AnnotationService, ArticleService } from '@/services';

@Component({
  selector: 'app-annotation',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class AnnotationComponent implements OnDestroy {

  @ViewChild('container', { static: true })
  contentRef!: ElementRef<HTMLElement>;

  private annotationService = inject(AnnotationService);
  private articleService    = inject(ArticleService);
  private sanitizer         = inject(DomSanitizer);

  readonly article = this.articleService.selectedArticle;
  readonly annotations = this.annotationService.getAnnotationByArticleId;

  private readonly _isSelectedText = signal(false);
  readonly isSelectedText = computed(() => this._isSelectedText());

  private readonly _content = signal<SafeHtml>('');
  readonly content = computed(() => this._content());

  private selectionHandler = () => {
    this._isSelectedText.set(this.checkSelectedText());
  };

  constructor() {
    effect(() => {
      const annotations = this.annotations();
      const article = this.article();

      const html = annotations?.length
        ? annotations
        : article?.content ?? '';

      if (typeof html !== 'string') {
        this._content.set('');
        return;
      }

      this._content.set(
        this.sanitizer.bypassSecurityTrustHtml(html)
      );
    }, { allowSignalWrites: true });

    document.addEventListener('selectionchange', this.selectionHandler);
  }

  ngOnDestroy() {
    document.removeEventListener('selectionchange', this.selectionHandler);
  }

  private checkSelectedText(): boolean {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    const range = selection.getRangeAt(0);
    const container = this.contentRef?.nativeElement;

    return !!(
      container &&
      container.contains(range.startContainer) &&
      container.contains(range.endContainer)
    );
  }

  applyAnnotation(color: string): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const text = range.toString().trim();
    if (!text) return;

    const article = this.article();
    if (!article) return;

    const note = prompt('Введите аннотацию:') ?? '';

    const span = document.createElement('span');
    const id = crypto.randomUUID();

    span.className = 'annotated';
    span.style.backgroundColor = color;
    span.style.textDecoration = 'underline';
    span.dataset['id'] = id;
    span.dataset['note'] = note;
    span.title = note;

    const fragment = range.extractContents();
    span.appendChild(fragment);
    range.insertNode(span);

    const content = this.contentRef.nativeElement.innerHTML;

    this._content.set(content);

    const updatedArticles = this.articleService.articles().map(a => {
      if (a.id !== article.id) return a;

      return {
        ...a,
        annotations: [{
          id,
          text,
          color,
          note,
          articleId: article.id,
          content
        }]
      };
    });

    this.articleService.setArticles(updatedArticles);
    selection.removeAllRanges();
    this._isSelectedText.set(false);
  }

  clearAnnotations(): void {
    if (!confirm('Очистить аннотации?')) return;

    const article = this.article();
    if (!article) return;

    const updated = this.articleService.articles().map(a =>
      a.id === article.id
        ? { ...a, annotations: [] }
        : a
    );

    this.articleService.setArticles(updated);
  }
}
