/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['localhost'],
    },
  webpack: (config) => {
    // react-beautiful-dnd のワーニングを抑制するための設定
    config.module.rules.push({
      test: /\.js$/,
      include: [
        /node_modules\/react-beautiful-dnd/,
        /node_modules\/gif\.js/
      ],
      use: ['worker-loader'],
    });
  
    return config;
    },
  };
  
  export default nextConfig;