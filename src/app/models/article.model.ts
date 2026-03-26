import { Annotation } from "./annotation.model";

export interface Article {
  id: string;
  title: string;
  content: string;
  annotations: Annotation[];
}
