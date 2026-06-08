import type { ComponentSchema, PageSchema } from '../types/index.js';
export declare function deepClone<T>(obj: T): T;
export declare function cloneComponentSchema(schema: ComponentSchema): ComponentSchema;
export declare function clonePageSchema(schema: PageSchema): PageSchema;
