import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnnotationComponent, NotificationComponent } from '@/components';
import { Article } from '@/models';
import { ArticleService } from '@/services';


@Component({
  selector: 'app-article-viewer',
  templateUrl: './article-viewer.component.html',
  styleUrls: ['./article-viewer.component.scss'],
  standalone: true,
  imports: [CommonModule, AnnotationComponent, RouterLink, NotificationComponent]
})
export class ArticleViewerComponent implements OnInit {

  article!: Article;
  notificationText = 'Для добавления аннотациий нужно выделить текст!'

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
  ) {}


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const article = id ? this.articleService.getById(id) : null;

    if (!article) {
      this.router.navigate(['/'])
      throw new Error('Article not found');
    }

    this.article = { ...article };
  }

}
