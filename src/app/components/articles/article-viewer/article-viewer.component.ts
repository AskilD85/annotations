import {
  Component,
  computed,
  effect,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AnnotationComponent } from '@/components/annotation';
import { NotificationComponent } from '@/components/notification';
import { ArticleService } from '@/services';
import { NOTIFICATION_TYPE } from '@/shared';

@Component({
  selector: 'app-article-viewer',
  templateUrl: './article-viewer.component.html',
  styleUrls: ['./article-viewer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    AnnotationComponent,
    RouterLink,
    NotificationComponent
  ]
})
export class ArticleViewerComponent {

  private articleService = inject(ArticleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  NOTIFICATION_TYPE = NOTIFICATION_TYPE;

  readonly notificationText =
    'Для добавления аннотаций нужно выделить текст!';

  // 🔥 сигнал из route
  private readonly routeParams = toSignal(this.route.paramMap);

  // 🔥 текущий id
  readonly articleId = computed(() =>
    this.routeParams()?.get('id')
  );

  // 🔥 статья
  readonly article = computed(() =>
    this.articleService.selectedArticle()
  );

  constructor() {
    // загрузка статьи
    effect(() => {
      const id = this.articleId();
      if (id) {
        this.articleService.selectArticle(id);
      }
    }, {allowSignalWrites: true});

    // обработка отсутствия статьи
    effect(() => {
      const id = this.articleId();
      const article = this.article();

      if (id && !article) {
        this.router.navigate(['/']);
      }
    });
  }

  deleteArticle() {
    const article = this.article();
    if (!article) return;

    if (confirm('Удалить статью?')) {
      this.articleService.delete(article.id);
      this.router.navigate(['/']); // ✅ важно после удаления
    }
  }
}
