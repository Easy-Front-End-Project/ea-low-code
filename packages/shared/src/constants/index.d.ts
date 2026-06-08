export declare const SCHEMA_VERSION = "1.0.0";
export declare const SCHEMA_VERSIONS: readonly ["1.0.0"];
export declare const DEFAULT_PAGE_CONFIG: {
    readonly width: "100%";
    readonly height: "100vh";
    readonly backgroundColor: "#ffffff";
};
export declare const CATEGORIES: {
    readonly BASIC: "basic";
    readonly LAYOUT: "layout";
    readonly FORM: "form";
    readonly DATA: "data";
    readonly NAVIGATION: "navigation";
    readonly FEEDBACK: "feedback";
    readonly REMOTE: "remote";
};
export declare const CATEGORY_LABELS: Record<string, string>;
export declare const PROP_TYPES: {
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
export declare const CONTAINER_TYPES: string[];
export declare const NON_CONTAINER_TYPES: string[];
export declare const INLINE_BLOCK_TYPES: string[];
export declare const NON_SELECTABLE_TYPES: string[];
export interface NonSelectableInParent {
    childType: string;
    parentType: string;
}
export declare const NON_SELECTABLE_IN_PARENT: NonSelectableInParent[];
