import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnnotationComponent, NotificationComponent } from '@/components';
import { Article } from '@/models';
import { ArticleService } from '@/services';
import { toSignal } from '@angular/core/rxjs-interop';
import { NOTIFICATION_TYPE } from '@/shared';


@Component({
  selector: 'app-article-viewer',
  templateUrl: './article-viewer.component.html',
  styleUrls: ['./article-viewer.component.scss'],
  standalone: true,
  imports: [CommonModule, AnnotationComponent, RouterLink, NotificationComponent]
})
export class ArticleViewerComponent {

  article!: Article;
  notificationText = 'Для добавления аннотациий нужно выделить текст!'

  private articleService  = inject(ArticleService);
  private route           = inject(ActivatedRoute);
  private router          = inject(Router);

  NOTIFICATION_TYPE = NOTIFICATION_TYPE

  sArticle = this.articleService.selectedArticle;

  id = toSignal(this.route.paramMap);


  constructor() {
    effect(() => {
      const id = this.id()!.get('id')
      if (id) {
        this.articleService.selectArticle(id);
      }
      if (!this.sArticle()) {
        this.router.navigate(['/']);
      }

    }, { allowSignalWrites: true });
  }

  deleteArticle() {
    if (confirm('Удалить статью?')) {
      this.articleService.delete(this.sArticle()!.id);
    }
  }

}
