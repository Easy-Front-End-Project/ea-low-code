export function findComponentById(components, id) {
    if (!Array.isArray(components) || !id)
        return null;
    for (const comp of components) {
        if (comp.id === id)
            return comp;
        if (comp.children?.length) {
            const found = findComponentById(comp.children, id);
            if (found)
                return found;
        }
    }
    return null;
}
export function findParentComponent(components, targetId, parent = null) {
    for (const comp of components) {
        if (comp.id === targetId)
            return parent;
        if (comp.children?.length) {
            const found = findParentComponent(comp.children, targetId, comp);
            if (found !== undefined)
                return found;
        }
    }
    return null;
}
export function traverseComponents(components, callback) {
    function walk(list, parent) {
        for (let i = 0; i < list.length; i++) {
            const comp = list[i];
            if (callback(comp, parent, i) === false)
                return false;
            if (comp.children?.length) {
                if (!walk(comp.children, comp))
                    return false;
            }
        }
        return true;
    }
    walk(components, null);
}
export function flattenComponents(components) {
    const result = [];
    traverseComponents(components, (comp) => {
        result.push(comp);
    });
    return result;
}
export function getComponentTreeDepth(components) {
    let maxDepth = 0;
    function getDepth(list, currentDepth) {
        maxDepth = Math.max(maxDepth, currentDepth);
        for (const comp of list) {
            if (comp.children?.length) {
                getDepth(comp.children, currentDepth + 1);
            }
        }
    }
    getDepth(components, 1);
    return maxDepth;
}
export function findComponentPath(components, targetId) {
    function findPath(list, path) {
        for (const comp of list) {
            const currentPath = [...path, comp.id];
            if (comp.id === targetId) {
                return currentPath;
            }
            if (comp.children?.length) {
                const result = findPath(comp.children, currentPath);
                if (result)
                    return result;
            }
        }
        return null;
    }
    return findPath(components, []);
}
export function insertComponent(components, component, parentId, index) {
    const newComponents = structuredClone(components);
    if (!parentId) {
        if (index !== undefined && index >= 0) {
            newComponents.splice(index, 0, component);
        }
        else {
            newComponents.push(component);
        }
        return newComponents;
    }
    traverseComponents(newComponents, (comp) => {
        if (comp.id === parentId) {
            comp.children ??= [];
            if (index !== undefined && index >= 0) {
                comp.children.splice(index, 0, component);
            }
            else {
                comp.children.push(component);
            }
            return false;
        }
    });
    return newComponents;
}
export function removeComponent(components, targetId) {
    const newComponents = structuredClone(components);
    function removeFromList(list) {
        const index = list.findIndex((comp) => comp.id === targetId);
        if (index > -1) {
            list.splice(index, 1);
            return true;
        }
        for (const comp of list) {
            if (comp.children?.length) {
                if (removeFromList(comp.children))
                    return true;
            }
        }
        return false;
    }
    removeFromList(newComponents);
    return newComponents;
}
export function moveComponent(components, sourceId, targetParentId, targetIndex) {
    const source = findComponentById(components, sourceId);
    if (!source)
        return components;
    if (targetParentId) {
        const sourcePath = findComponentPath(components, sourceId);
        const targetPath = findComponentPath(components, targetParentId);
        if (sourcePath && targetPath && targetPath.join(',').startsWith(sourcePath.join(','))) {
            return components;
        }
    }
    const afterRemove = removeComponent(components, sourceId);
    return insertComponent(afterRemove, source, targetParentId, targetIndex);
}
export function findComponentByAlias(components, alias) {
    let result = null;
    traverseComponents(components, (comp) => {
        if (comp.alias === alias) {
            result = comp;
            return false;
        }
    });
    return result;
}
//# sourceMappingURL=treeUtils.js.map