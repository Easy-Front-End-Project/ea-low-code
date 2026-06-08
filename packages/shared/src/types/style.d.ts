export interface StyleConfigPart {
    name: string;
    label: string;
    styles?: string[];
    description?: string;
}
export interface CssVariableDefinition {
    name: string;
    label: string;
    type: string;
    default?: string;
    options?: string[];
}
export type StyleTypeKey = 'cssVariable' | 'position' | 'customCSS' | 'inline';
export declare const STYLE_TYPE_MAP: Record<StyleTypeKey, string>;
export interface StyleConfig {
    parts: StyleConfigPart[];
    cssVariables?: CssVariableDefinition[];
    dynamicCssVariables?: Record<string, unknown>;
}
