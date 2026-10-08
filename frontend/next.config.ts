import type { NextConfig } from 'next';
// externalDir lets the frontend import ../shared (types and constants only).
const config: NextConfig = { experimental: { externalDir: true } };
export default config;
