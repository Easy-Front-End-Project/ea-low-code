export function generateUniqueId(prefix = 'id') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    return `${prefix}_${timestamp}_${random}`;
}
export function generateComponentId() {
    return generateUniqueId('comp');
}
export function generateVariableId() {
    return generateUniqueId('var');
}
//# sourceMappingURL=idGenerator.js.map