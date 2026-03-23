This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Memo

그런데 NaverMap이 알아야 할 것이 페칭하는 api 맞을까?
api가 여러개일수도 있고 파람이 바뀔수도있는데 페칭한 결과값을 아는 곳이 page
마커 갯수가 달라도 순서가 달라지면? 관리되는지도 생각해봐야 할 것

[설계]

1. 지도 위에 마커 찍기
    1. 특정 좌표를 중심으로 (반경 몇 미터 혹은 화면 내)
        1. 내 위치 
        2. 화면센터값
    2. 좌표를 누르면 액션(윈도우가 뜨거나 바텀시트가 나오거나)
2. 클러스터 기능 추가




