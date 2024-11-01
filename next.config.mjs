/** @type {import('next').NextConfig} */
import * as dotenv from 'dotenv'

dotenv.config({path: './.env.'+ process.env.NODE_ENV})

const nextConfig = {
  // reactStrictMode must be false to fix a bug in react-big-calendar
  reactStrictMode: false,
  webpack: (config) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, topLevelAwait: true };
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true
    return config;
  },
};

export default nextConfig;
