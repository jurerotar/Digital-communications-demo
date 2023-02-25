import {_RouteLocationBase, RouteMeta} from "vue-router";

export type Route = Partial<_RouteLocationBase> & {
  path: string;
  name: string;
  label: string;
  // TODO: Type this
  component: () => any;
  icon: string[];
  meta: CustomRouteMeta
}

export interface CustomRouteMeta extends RouteMeta {
  title: string;
  properties: MetaObject[];
}

export interface MetaObject {
  propertyName: MetaProperties;
  propertyType: "name" | "property";
  content: string;
}

export type MetaProperties =
  "description" |
  "og:title" |
  "og:description" |
  "og:url" |
  "twitter:title" |
  "twitter:description";