import { withContentlayer } from 'next-contentlayer';

/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true, images: { domains: ['localhost'] } };

export default withContentlayer(nextConfig)
