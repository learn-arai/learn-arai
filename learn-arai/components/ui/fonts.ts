import { Open_Sans } from 'next/font/google';
import { Inter } from 'next/font/google';
import { Noto_Color_Emoji } from 'next/font/google';

export const openSans = Open_Sans({ subsets: ['latin'], preload: false });
export const inter = Inter({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    preload: false,
});
export const notoColorEmoji = Noto_Color_Emoji({
    subsets: ['emoji'],
    preload: false,
    weight: '400',
});
