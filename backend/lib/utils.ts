import { v4 } from 'uuid';

export const fileExtension: { [key: string]: string } = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};

export function uuidv4() {
    return v4();
}
