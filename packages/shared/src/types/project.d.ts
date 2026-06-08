import type { PageSchema, VariableItem } from './schema.js';
export interface ProjectConfig {
    theme?: string;
    locale?: string;
    [key: string]: unknown;
}
export interface Project {
    id: number;
    name: string;
    description?: string;
    userId: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    pages?: Page[];
}
export interface Page {
    id: number;
    name: string;
    description?: string;
    schema?: PageSchema;
    variables?: VariableItem[];
    sortOrder: number;
    projectId: number;
    createdAt: Date;
    updatedAt: Date;
}
export type DatasourceType = 'mysql' | 'postgresql' | 'rest_api' | 'graphql' | 'feishu';
export interface DatasourceConfig {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database?: string;
    url?: string;
    headers?: Record<string, string>;
    [key: string]: unknown;
}
export interface Datasource {
    id: number;
    name: string;
    type: DatasourceType;
    config: DatasourceConfig;
    description?: string;
    projectId: number;
    createdAt: Date;
    updatedAt: Date;
}
export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'text' | 'json' | 'enum';
export interface ModelField {
    id: number;
    name: string;
    label: string;
    type: FieldType;
    required: boolean;
    defaultValue?: unknown;
    options?: string[];
    sortOrder: number;
    modelId: number;
}
export interface DataModel {
    id: number;
    name: string;
    description?: string;
    tableName: string;
    fields: ModelField[];
    projectId: number;
    createdAt: Date;
    updatedAt: Date;
}
