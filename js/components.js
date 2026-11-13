import {
    copyToClipboard,
    generateHash,
    encodeBase64,
    decodeBase64,
    formatJSON,
    validators
} from './utils.js';

// Alpine.js components initialization
document.addEventListener('alpine:init', () => {
    // JSON Formatter Component
    Alpine.data('jsonFormatter', () => ({
        input: '',
        output: '',
        isValid: false,
        isLoading: false,

        validateInput() {
            this.isValid = validators.isValidJSON(this.input);
        },

        async format() {
            if (!this.isValid) return;
            
            this.isLoading = true;
            try {
                this.output = formatJSON(this.input);
                this.$dispatch('show-toast', {
                    message: 'JSON успешно отформатирован',
                    type: 'success'
                });
            } catch (e) {
                this.output = 'Ошибка: Неверный JSON формат';
                this.$dispatch('show-toast', {
                    message: e.message,
                    type: 'error'
                });
            } finally {
                this.isLoading = false;
            }
        },

        clear() {
            this.input = '';
            this.output = '';
            this.isValid = false;
        },

        async copyToClipboard(text) {
            await copyToClipboard(text);
        }
    }));

    // Base64 Converter Component
    Alpine.data('base64Converter', () => ({
        plainText: '',
        encodedText: '',
        isLoading: false,

        async encode() {
            if (!validators.isNonEmpty(this.plainText)) return;
            
            this.isLoading = true;
            try {
                this.encodedText = encodeBase64(this.plainText);
                this.$dispatch('show-toast', {
                    message: 'Текст успешно закодирован',
                    type: 'success'
                });
            } catch (e) {
                this.$dispatch('show-toast', {
                    message: e.message,
                    type: 'error'
                });
            } finally {
                this.isLoading = false;
            }
        },

        async decode() {
            if (!validators.isValidBase64(this.encodedText)) {
                this.$dispatch('show-toast', {
                    message: 'Неверный формат Base64',
                    type: 'error'
                });
                return;
            }
            
            this.isLoading = true;
            try {
                this.plainText = decodeBase64(this.encodedText);
                this.$dispatch('show-toast', {
                    message: 'Текст успешно декодирован',
                    type: 'success'
                });
            } catch (e) {
                this.$dispatch('show-toast', {
                    message: e.message,
                    type: 'error'
                });
            } finally {
                this.isLoading = false;
            }
        },

        clear() {
            this.plainText = '';
            this.encodedText = '';
        },

        async copyToClipboard(text) {
            await copyToClipboard(text);
        }
    }));

    // Hash Generator Component
    Alpine.data('hashGenerator', () => ({
        input: '',
        md5Hash: '',
        sha256Hash: '',
        isLoading: false,

        async generateHashes() {
            if (!validators.isNonEmpty(this.input)) {
                this.$dispatch('show-toast', {
                    message: 'Введите текст для хэширования',
                    type: 'error'
                });
                return;
            }

            this.isLoading = true;
            try {
                // Generate both hashes in parallel
                const [md5, sha256] = await Promise.all([
                    generateHash(this.input, 'MD5'),
                    generateHash(this.input, 'SHA-256')
                ]);

                this.md5Hash = md5;
                this.sha256Hash = sha256;

                this.$dispatch('show-toast', {
                    message: 'Хэши успешно сгенерированы',
                    type: 'success'
                });
            } catch (e) {
                this.$dispatch('show-toast', {
                    message: 'Ошибка при генерации хэшей',
                    type: 'error'
                });
            } finally {
                this.isLoading = false;
            }
        },

        clear() {
            this.input = '';
            this.md5Hash = '';
            this.sha256Hash = '';
        },

        async copyToClipboard(text) {
            await copyToClipboard(text);
        }
    }));

    // Toast Notification Component
    Alpine.data('toast', () => ({
        visible: false,
        message: '',
        type: 'success',
        timeout: null,

        get typeClasses() {
            return {
                'bg-green-500 text-white': this.type === 'success',
                'bg-red-500 text-white': this.type === 'error'
            };
        },

        show(message, type = 'success') {
            this.visible = true;
            this.message = message;
            this.type = type;

            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(() => {
                this.visible = false;
            }, 3000);
        }
    }));
});