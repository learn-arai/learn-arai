/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '3000',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'learnarai.online',
            },
            {
                protocol: 'https',
                hostname: 'learnarai.athichal.com',
            },
        ],
    },
};

export default nextConfig;
