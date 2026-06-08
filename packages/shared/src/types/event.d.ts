export type ActionType = 'message' | 'notification' | 'custom' | 'callMethod' | 'setProp' | 'apiRequest';
export declare const ActionTypes: Record<string, ActionType>;
export interface ComponentContext {
    get: (id: string) => HTMLElement | null;
    setProp: (id: string, prop: string, value: unknown) => boolean;
    getProp: (id: string, prop: string) => unknown;
    call: (id: string, method: string, ...args: unknown[]) => unknown;
}
export interface VarsContext {
    get: (name: string) => unknown;
    set: (name: string, value: unknown) => void;
    call: (name: string, ...args: unknown[]) => unknown;
}
export interface AliasContext {
    get: (alias: string) => string | null;
    find: (alias: string) => unknown;
    getElement: (alias: string) => HTMLElement | null;
    setProp: (alias: string, prop: string, value: unknown) => void;
    getProp: (alias: string, prop: string) => unknown;
    call: (alias: string, method: string, ...args: unknown[]) => void;
}
export interface ExecutionContext {
    $component: ComponentContext;
    $vars: VarsContext;
    $alias: AliasContext;
}
