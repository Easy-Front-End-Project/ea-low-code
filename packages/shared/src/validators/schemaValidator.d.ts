import type { ComponentSchema, ValidationResult } from '../types/index.js';
export declare function validatePageSchema(schema: unknown): ValidationResult;
export declare function validateComponent(component: ComponentSchema, path: string, idSet?: Set<string>): string[];
