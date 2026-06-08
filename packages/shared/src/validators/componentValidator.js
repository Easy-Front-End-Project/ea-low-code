import { PROP_TYPES } from '../constants/index.js';
const VALID_PROP_TYPES = new Set(Object.values(PROP_TYPES));
export function validateComponentMeta(meta) {
    const errors = [];
    if (!meta) {
        errors.push('组件元数据不能为空');
        return { valid: false, errors };
    }
    const metaObj = meta;
    if (!metaObj.type) {
        errors.push('组件元数据缺少 type');
    }
    if (!metaObj.name) {
        errors.push('组件元数据缺少 name');
    }
    if (!metaObj.category) {
        errors.push('组件元数据缺少 category');
    }
    if (!metaObj.icon) {
        errors.push('组件元数据缺少 icon');
    }
    if (Array.isArray(metaObj.props)) {
        metaObj.props.forEach((prop, index) => {
            const propErrors = validatePropDefinition(prop, `props[${index}]`);
            errors.push(...propErrors);
        });
    }
    if (Array.isArray(metaObj.slots)) {
        metaObj.slots.forEach((slot, index) => {
            if (!slot.name) {
                errors.push(`slots[${index}]: 缺少 name`);
            }
            if (!slot.label) {
                errors.push(`slots[${index}]: 缺少 label`);
            }
        });
    }
    if (Array.isArray(metaObj.events)) {
        metaObj.events.forEach((event, index) => {
            if (!event.name) {
                errors.push(`events[${index}]: 缺少 name`);
            }
            if (!event.label) {
                errors.push(`events[${index}]: 缺少 label`);
            }
        });
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
export function validatePropDefinition(prop, path) {
    const errors = [];
    if (!prop.name) {
        errors.push(`${path}: 缺少 name`);
    }
    if (!prop.label) {
        errors.push(`${path}: 缺少 label`);
    }
    if (!prop.type) {
        errors.push(`${path}: 缺少 type`);
    }
    else if (!VALID_PROP_TYPES.has(prop.type)) {
    }
    if ((prop.type === 'select' || prop.type === 'multi-select') && !prop.options?.length) {
        errors.push(`${path}: select/multi-select 类型必须有 options`);
    }
    return errors;
}
//# sourceMappingURL=componentValidator.js.map