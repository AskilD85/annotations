import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Article } from '@/models';
import { ArticleService } from '@/services/article.service';
import { NotificationComponent } from '@/components/notification';
import { NotificationService } from './../../../services/notification.service';


@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  standalone: true,
  imports: [
  CommonModule,
    NotificationComponent
  ],
})
export class ArticleListComponent implements OnInit {

  articles$!: Observable<Article[]>;
  notificationText = ''

  constructor(
    private articleService: ArticleService,
    private router: Router,
    protected notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.articles$ = this.articleService.getAll();
  }

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
