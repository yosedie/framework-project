/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '',
                pathname: '/**',
            },
        ],
        unoptimized: true, // Menonaktifkan optimasi gambar
    },
    // output: 'export', // Tetap menggunakan output statis
    // experimental: {
    //     appDir: true, // Menggunakan App Router
    // },
};

export default nextConfig;
