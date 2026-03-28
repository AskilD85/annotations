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
  imports:[
    FormsModule,
    RouterLink,
    NotificationComponent
  ],
  templateUrl:'./article-editor.component.html',
  styleUrls:['./article-editor.component.scss']
})
export class ArticleEditorComponent implements OnInit {
  article: Article = {
    id: crypto.randomUUID(),
    title: '',
    content: '',
    annotations: []
  };

  NOTIFICATION_TYPE = NOTIFICATION_TYPE

  notificationText = '';

  existArticle: Article | undefined;
  existAnnotation = false;

  constructor(
    private articleService: ArticleService,
    private annotationService: AnnotationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');

  if (id && id !== 'new') {
    this.existArticle = this.articleService.getById(id);
    if (this.existArticle) {
      this.article = { ...this.existArticle };
      if (this.annotationService.getAnnotationById(String(id))) {
        this.existAnnotation = true;
        this.notificationText = 'Статья содержит аннотации! После сохранения - все существующие аннотации удалятся!'
      }
    } else {
      this.notificationText = 'ID документа не найден, будет создана новая статья с новым ID!'
    }
  }
}

  save() {
    if (this.article.annotations.length > 0) {
      this.article.annotations.length = 0;
    }

    this.existArticle ? this.articleService.updateArticle(this.article) : this.articleService.create(this.article);
    this.router.navigate(['/view', this.article.id])
  }
}
