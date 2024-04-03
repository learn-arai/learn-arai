import { customAlphabet } from 'nanoid';
import { v4 } from 'uuid';

export const fileExtension: { [key: string]: string } = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
};

export const fileType = {
    image: ['image/jpeg', 'image/png', 'image/webp'],
    pdf: ['application/pdf'],
    any: [],
};

export function uuidv4() {
    return v4();
}

export function generateSlug(size = 10) {
    const nanoid = customAlphabet(
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
        size,
    );
    return nanoid();
}
