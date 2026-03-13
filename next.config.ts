import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false, // 개발용 검사 모드
  images: {
    domains: ['peby.s3.ap-northeast-2.amazonaws.com'],
  },
  // webpack: (config) => {
  //   config.module.rules.push({
  //     test: /\.svg$/,
  //     use: ['@svgr/webpack'], // svg 리액트 컴포넌트로 사용 가능
  //   })
  //   return config
  // },

  // async rewrites() {
  //   // 프록시
  //   return [
  //     {
  //       source: `/api/:path*`,
  //       destination: `${process.env.NEXT_API_URL_FOR_PROXY}/:path*`,
  //     },
  //   ]
  // },
}

export default nextConfig
