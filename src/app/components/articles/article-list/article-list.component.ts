import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ArticleService } from '@/services/article.service';
import { NotificationService } from './../../../services/notification.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  standalone: true,
  imports: [
  CommonModule,
  ],
})
export class ArticleListComponent {

  articleService      = inject(ArticleService)
  router              = inject(Router)
  notificationService = inject(NotificationService)

  sArticles = this.articleService.articles;

  createArticle() {
    this.router.navigate(['/edit', 'new']);
  }

  editArticle(id: string) {
    this.router.navigate(['/edit', id]);
  }

  viewArticle(id: string) {
    this.router.navigate(['/view', id]);
  }

  deleteArticle(id: string) {
    if (confirm('Удалить статью?')) {
      this.articleService.delete(id);
    }
  }
}
