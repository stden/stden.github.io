// Вспомогательные функции для работы с Alpine.js компонентов
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: {
                message: 'Скопировано в буфер обмена',
                type: 'success'
            }
        }));
        return true;
    } catch (e) {
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: {
                message: 'Ошибка при копировании',
                type: 'error'
            }
        }));
        return false;
    }
};

// Функции для работы с хэшами
export const generateHash = async (text, algorithm) => {
    const textEncoder = new TextEncoder();
    const data = textEncoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest(algorithm, data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

// Функции для работы с Base64
export const encodeBase64 = (text) => {
    try {
        return btoa(unescape(encodeURIComponent(text)));
    } catch (e) {
        throw new Error('Ошибка при кодировании в Base64');
    }
};

export const decodeBase64 = (text) => {
    try {
        return decodeURIComponent(escape(atob(text)));
    } catch (e) {
        throw new Error('Ошибка при декодировании из Base64');
    }
};

// Функции для работы с JSON
export const formatJSON = (jsonString) => {
    try {
        const parsed = JSON.parse(jsonString);
        return JSON.stringify(parsed, null, 2);
    } catch (e) {
        throw new Error('Неверный формат JSON');
    }
};

// Вспомогательные функции для валидации
export const validators = {
    isValidJSON: (text) => {
        try {
            JSON.parse(text);
            return true;
        } catch {
            return false;
        }
    },
    
    isValidBase64: (text) => {
        try {
            return btoa(atob(text)) === text;
        } catch {
            return false;
        }
    },
    
    isNonEmpty: (text) => {
        return text && text.trim().length > 0;
    }
};