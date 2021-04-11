export default function isValidI18N (data) {
    return typeof data === 'object' && data !== null && !Array.isArray(data)
};