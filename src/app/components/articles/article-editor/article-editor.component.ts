import { NotificationComponent } from "@/components/notification";
import { Article } from "@/models";
import { AnnotationService, ArticleService } from "@/services";
import { NOTIFICATION_TYPE } from "@/shared";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-article-editor',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NotificationComponent
  ],
  templateUrl: './article-editor.component.html',
  styleUrls: ['./article-editor.component.scss']
})
export class ArticleEditorComponent implements OnInit {

  NOTIFICATION_TYPE = NOTIFICATION_TYPE;

  article: Article = this.createEmptyArticle();
  notificationText = '';

  private articleId: string | null = null;
  private isEditMode = false;

  constructor(
    private articleService: ArticleService,
    private annotationService: AnnotationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.articleId = this.route.snapshot.paramMap.get('id');

    if (!this.articleId || this.articleId === 'new') return;

    const existing = this.articleService.getById(this.articleId);

    if (!existing) {
      this.notificationText = 'Статья не найдена, будет создана новая!';
      return;
    }
    this.isEditMode = true;

    this.article = { ...existing };

    const hasAnnotation = !!this.annotationService.getAnnotationById(this.articleId);

    if (hasAnnotation) {
      this.notificationText =
        'Статья содержит аннотации! После сохранения они будут удалены.';
    }
  }

  save() {
    const articleToSave: Article = {
      ...this.article,
      annotations: []
    };

    if (this.isEditMode) {
      this.articleService.updateArticle(articleToSave);
    } else {
      this.articleService.create(articleToSave);
    }

    this.router.navigate(['/view', articleToSave.id]);
  }

  private createEmptyArticle(): Article {
    return {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      annotations: []
    };
  }
}
