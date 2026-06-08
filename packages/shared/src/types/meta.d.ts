export declare const PropTypes: {
    readonly STRING: "string";
    readonly NUMBER: "number";
    readonly BOOLEAN: "boolean";
    readonly SELECT: "select";
    readonly MULTI_SELECT: "multi-select";
    readonly COLOR: "color";
    readonly OBJECT: "object";
    readonly ARRAY: "array";
    readonly FUNCTION: "function";
    readonly UNIT: "unit";
    readonly TIME: "time";
};
export type PropType = (typeof PropTypes)[keyof typeof PropTypes];
export interface PropOption {
    label: string;
    value: string | number;
}
export interface PropDescription {
    type: string;
    content: string;
    props?: Record<string, unknown>;
}
export interface PropDefinition {
    name: string;
    label: string;
    type: PropType | string;
    default?: unknown;
    options?: PropOption[] | string[];
    description?: string | PropDescription;
    slotScope?: Array<{
        name: string;
        label: string;
    }>;
}
export interface SlotDefinition {
    name: string;
    label: string;
    isContentSlot?: boolean;
    description?: string;
    child?: string;
    slotScope?: Array<{
        name: string;
        label: string;
    }>;
}
export interface EventDefinition {
    name: string;
    label: string;
    params?: string;
    detail?: string;
}
export interface MethodDefinition {
    name: string;
    label: string;
    description?: string;
}
export declare const ComponentCategories: {
    readonly BASIC: "basic";
    readonly LAYOUT: "layout";
    readonly FORM: "form";
    readonly DATA: "data";
    readonly NAVIGATION: "navigation";
    readonly FEEDBACK: "feedback";
    readonly REMOTE: "remote";
};
export type ComponentCategory = (typeof ComponentCategories)[keyof typeof ComponentCategories];
export interface SpecialConfig {
    type: string;
    propName: string;
}
export interface ComponentMeta {
    type: string;
    name: string;
    category: ComponentCategory | string;
    icon: string;
    isChildComponent?: boolean;
    parentComponents?: string[];
    isRemote?: boolean;
    remoteConfig?: import('./schema.js').RemoteConfig;
    props: PropDefinition[];
    events: EventDefinition[];
    slots: SlotDefinition[];
    styleConfig?: import('./style.js').StyleConfig;
    childComponents?: string[];
    defaultSlot?: string;
    isService?: boolean;
    isPageLevel?: boolean;
    configSource?: string[];
    pageLevelConfig?: Record<string, unknown>;
    specialConfig?: SpecialConfig;
    methods?: MethodDefinition[];
}
export interface CategoryItem {
    key: string;
    value: string;
    label: string;
}
export interface CategoryGrouped {
    regular: ComponentMeta[];
    child: ComponentMeta[];
}
export interface ParentGroup {
    parentType: string;
    parentName: string;
    components: ComponentMeta[];
}
export interface RemoteConfigStorage {
    globalUrl: string;
    components: Array<Record<string, unknown>>;
}
