import { type ClassValue, clsx } from 'clsx';
import { customAlphabet } from 'nanoid';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
    return new Date(date).toLocaleString('en-TH', {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export function timeAgo(date: string | Date, simple: Boolean = false): string {
    let age = Date.now() - new Date(date).getTime();

    if (age / 1000 < 5) {
        return 'just now';
    }

    const out = [];

    const YEAR = 1000 * 60 * 60 * 24 * 365;
    const year = Math.floor(age / YEAR);
    age -= year * YEAR;

    if (year > 0) {
        out.push(`${year} year${year > 1 ? 's' : ''}`);
        if (simple) return out.join(' ');
    }

    const month = Math.floor(age / (YEAR / 12));
    age -= month * (YEAR / 12);

    if (month > 0) {
        out.push(`${month} month${month > 1 ? 's' : ''}`);
        if (simple) return out.join(' ');
    }

    const day = Math.floor(age / (YEAR / 365));
    age -= day * (YEAR / 365);

    if (day > 0) {
        out.push(`${day} day${day > 1 ? 's' : ''}`);
        if (simple) return out.join(' ');
    }

    if (month == 0) {
        const hour = Math.floor(age / (1000 * 60 * 60));
        age -= hour * (1000 * 60 * 60);

        if (hour > 0) {
            out.push(`${hour} hour${hour > 1 ? 's' : ''}`);
            if (simple) return out.join(' ');
        }

        const minute = Math.floor(age / (1000 * 60));
        age -= minute * (1000 * 60);

        if (minute > 0) {
            out.push(`${minute} minute${minute > 1 ? 's' : ''}`);
            if (simple) return out.join(' ');
        }

        const second = Math.floor(age / 1000);
        age -= second * 1000;

        if (second > 0) {
            out.push(`${second} second${second > 1 ? 's' : ''}`);
            if (simple) return out.join(' ');
        }
    }

    return out.join(' ');
}

export function generateNanoId(size = 10) {
    const nanoid = customAlphabet(
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
        size
    );
    return nanoid();
}

export function formatBytes(bytes: number, decimals: number = 2) {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [
        'Bytes',
        'KiB',
        'MiB',
        'GiB',
        'TiB',
        'PiB',
        'EiB',
        'ZiB',
        'YiB',
    ];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
