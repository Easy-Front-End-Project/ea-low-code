export function validatePageSchema(schema) {
    const errors = [];
    if (!schema) {
        errors.push('Schema 不能为空');
        return { valid: false, errors };
    }
    const schemaObj = schema;
    if (!schemaObj.version) {
        errors.push('Schema 缺少版本号');
    }
    if (!Array.isArray(schemaObj.components)) {
        errors.push('Schema 组件列表必须是数组');
    }
    if (Array.isArray(schemaObj.components)) {
        const idSet = new Set();
        schemaObj.components.forEach((comp, index) => {
            const compErrors = validateComponent(comp, `components[${index}]`, idSet);
            errors.push(...compErrors);
        });
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
export function validateComponent(component, path, idSet) {
    const errors = [];
    if (!component) {
        errors.push(`${path}: 组件不能为空`);
        return errors;
    }
    if (!component.id) {
        errors.push(`${path}: 组件缺少 id`);
    }
    else if (idSet) {
        if (idSet.has(component.id)) {
            errors.push(`${path}: 组件 id 重复 (${component.id})`);
        }
        else {
            idSet.add(component.id);
        }
    }
    if (!component.type) {
        errors.push(`${path}: 组件缺少 type`);
    }
    if (!component.props || typeof component.props !== 'object') {
        errors.push(`${path}: 组件 props 必须是对象`);
    }
    if (component.children && Array.isArray(component.children)) {
        component.children.forEach((child, index) => {
            const childErrors = validateComponent(child, `${path}.children[${index}]`, idSet);
            errors.push(...childErrors);
        });
    }
    return errors;
}
//# sourceMappingURL=schemaValidator.js.map