import type { PropDefinition, ValidationResult } from '../types/index.js';
export declare function validateComponentMeta(meta: unknown): ValidationResult;
export declare function validatePropDefinition(prop: PropDefinition, path: string): string[];
