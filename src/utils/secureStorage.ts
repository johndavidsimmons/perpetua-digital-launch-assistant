import { UserSettings } from '@/lib/types';

const STORAGE_KEY = 'cobramist_api_keys';
const isClient = typeof window !== 'undefined';
const isDev = process.env.NODE_ENV === 'development';

// Helper function to safely log errors without exposing sensitive data
const logError = (message: string, error?: unknown) => {
    if (isDev && error instanceof Error) {
        // In development, log the error message but not the full error object
        console.error(`${message}: ${error.message}`);
    } else {
        // In production, only log generic messages
        console.error(message);
    }
};

// Simple encryption/decryption using Base64
const encrypt = (text: string): string => {
    // Use Buffer for consistent Base64 encoding across client/server
    return Buffer.from(text).toString('base64');
};

const decrypt = (text: string): string => {
    // Decode Base64 using Buffer
    return Buffer.from(text, 'base64').toString();
};

export const saveApiKeys = (settings: UserSettings): void => {
    if (!isClient) return;
    try {
        const encryptedData = encrypt(JSON.stringify(settings));
        sessionStorage.setItem(STORAGE_KEY, encryptedData);
    } catch {
        logError('Failed to save API keys');
        throw new Error('Failed to save API keys');
    }
};

export const getApiKeys = (): UserSettings | null => {
    if (!isClient) return null;
    try {
        const encryptedData = sessionStorage.getItem(STORAGE_KEY);
        if (!encryptedData) return null;

        const decryptedData = decrypt(encryptedData);
        return JSON.parse(decryptedData);
    } catch {
        logError('Failed to retrieve API keys');
        return null;
    }
};

export const clearApiKeys = (): void => {
    if (!isClient) return;
    try {
        sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        logError('Failed to clear API keys');
        throw new Error('Failed to clear API keys');
    }
};

// Utility function to check if API keys are set
export const hasApiKeys = (): boolean => {
    const keys = getApiKeys();
    return !!(keys?.clientId && keys?.clientSecret && keys?.orgId);
};
