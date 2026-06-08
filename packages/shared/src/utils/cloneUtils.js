import { generateComponentId } from './idGenerator.js';
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export function cloneComponentSchema(schema) {
    const cloned = deepClone(schema);
    cloned.id = generateComponentId();
    updateComponentIds(cloned.children);
    return cloned;
}
function updateComponentIds(components) {
    if (!components?.length)
        return;
    for (const comp of components) {
        comp.id = generateComponentId();
        if (comp.children?.length) {
            updateComponentIds(comp.children);
        }
    }
}
export function clonePageSchema(schema) {
    const cloned = deepClone(schema);
    if (cloned.components?.length) {
        updateComponentIds(cloned.components);
    }
    return cloned;
}
//# sourceMappingURL=cloneUtils.js.map