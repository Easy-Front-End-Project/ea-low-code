export type VariableType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'function';
export interface VariableItem {
    id: string;
    name: string;
    type: VariableType;
    defaultValue: unknown;
    remark: string;
}
export interface VariableBinding {
    type: 'variable';
    value: string;
}
export interface RemoteConfig {
    id: string;
    url: string;
    styleUrl?: string;
    exportName: string;
}
export interface ComponentSchema {
    id: string;
    type: string;
    props: Record<string, unknown>;
    style: Record<string, string>;
    events: EventConfig[];
    children: ComponentSchema[];
    slots: Record<string, unknown>;
    positionStyle?: Record<string, string>;
    cssVariables?: Record<string, string>;
    customCSS?: string;
    isRemote?: boolean;
    remoteConfig?: RemoteConfig;
    childrenText?: string;
    alias?: string;
    scopeBindings?: Record<string, unknown>;
}
export interface ParamItem {
    key: string;
    value: string;
}
export interface ActionConfig {
    code?: string;
    message?: string;
    title?: string;
    targetComponentId?: string;
    methodName?: string;
    methodArgs?: unknown[];
    propName?: string;
    propValue?: unknown;
    url?: string;
    method?: string;
    params?: ParamItem[];
    body?: ParamItem[];
    enableDataBinding?: boolean;
    targetVariable?: string;
    [key: string]: unknown;
}
export interface EventConfig {
    action?: string;
    actionConfig?: ActionConfig;
    targetComponentAlias?: string;
    targetComponentId?: string;
    [key: string]: unknown;
}
export interface PageLayout {
    type: string;
    config: Record<string, unknown>;
}
export interface PageMeta {
    title: string;
    description: string;
    viewport: Record<string, unknown>;
}
export interface PageSchema {
    version: string;
    components: ComponentSchema[];
    layout: PageLayout;
    meta: PageMeta;
}
export interface StorePageSchema extends PageSchema {
    settings: Record<string, unknown>;
    variables: VariableItem[];
}
export interface ValidationResult {
    valid: boolean;
    errors: string[];
}
export interface FunctionExecutionContext {
    $component?: Record<string, unknown>;
    $vars?: Record<string, unknown>;
    $alias?: Record<string, unknown>;
    $utils?: Record<string, unknown>;
}
