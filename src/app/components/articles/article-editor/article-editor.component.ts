import { NotificationComponent } from '@/components/notification';
import { AnnotationService, ArticleService } from '@/services';
import { NOTIFICATION_TYPE } from '@/shared';
import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';



@Component({
  selector: 'app-article-editor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NotificationComponent,
    CommonModule
  ],
  templateUrl: './article-editor.component.html',
  styleUrls: ['./article-editor.component.scss']
})
export class ArticleEditorComponent implements OnInit {

  private fb = inject(FormBuilder);
  private articleService = inject(ArticleService);
  private annotationService = inject(AnnotationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // signals
  private articleId = signal<string | null>(null);
  private isEditMode = computed(() => !!this.articleId() && this.articleId() !== 'new');

  NOTIFICATION_TYPE = NOTIFICATION_TYPE

  readonly notificationText = signal('');

  // форма
  form = this.fb.nonNullable.group({
    id: [crypto.randomUUID() as string],
    title: ['', [Validators.required, Validators.minLength(3)]],
    content: ['', [Validators.required]],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.articleId.set(id);

    if (!this.isEditMode()) return;

    const article = this.articleService.getById(id!);

    if (!article) {
      this.notificationText.set('Статья не найдена. Будет создана новая.');
      return;
    }

    // заполняем форму
    this.form.patchValue({
      id: article.id,
      title: article.title,
      content: article.content
    });

    const hasAnnotation = !!this.annotationService.getAnnotationById(id!);

    if (hasAnnotation) {
      this.notificationText.set(
        'Статья содержит аннотации! После сохранения они будут удалены.'
      );
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationText.set('Форма содержит ошибки. Пожалуйста, исправьте их перед сохранением.');
      return;
    }

    const formValue = this.form.getRawValue();

    const article = {
      ...formValue,
      annotations: [] // всегда сбрасываем
    };

    if (this.isEditMode()) {
      this.articleService.updateArticle(article);
    } else {
      this.articleService.create(article);
    }

    this.router.navigate(['/view', article.id]);
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  showError(controlName: string): boolean {
    return this.isInvalid(controlName);
  }

}
