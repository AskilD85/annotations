import { Routes } from "@angular/router";
import { ArticleEditorComponent, ArticleListComponent, ArticleViewerComponent } from "./components";


export const routes: Routes = [
  { path: '', component: ArticleListComponent },
  { path: 'edit/:id', component: ArticleEditorComponent, pathMatch: 'full' },
  { path: 'view/:id', component: ArticleViewerComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
