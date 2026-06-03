import type { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import type { RouteMeta, RouteRecordRaw } from 'vue-router';

export type Route = RouteRecordRaw & {
  name: string;
  label: string;
  icon: IconDefinition;
  meta: CustomRouteMeta;
};

export interface CustomRouteMeta extends RouteMeta {
  title: string;
  properties: MetaObject[];
}

export interface MetaObject {
  propertyName: MetaProperties;
  propertyType: 'name' | 'property';
  content: string;
}

export type MetaProperties =
  | 'description'
  | 'og:title'
  | 'og:description'
  | 'og:url'
  | 'twitter:title'
  | 'twitter:description';
