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


우선 지금 있는 코드흐름 분석해보기
리팩토링 할게있나
응용해보기

—> 질문 만들기

주말까지 끌고가지 말고 오늘 끝내자?

- 지도를 이동하면서? 계속 센터값을 api에 던져서 리스트를 받아와야함
- 그러면 센터값을 알아야함

126.9115815, 37.5485241 잡았다가
126.91158152881074, 37.54852410061263

내 위치마커가 계속 따라다녀야하나?


그런데 NaverMap이 알아야할 것이 페칭하는 api 맞을까?
api를 아직 확실히 모르지만 api가 여러개일수도 있고 파람이 바뀔수도있는데 페칭한 결과값을 아는 곳이 page야

마커 갯수가 달라도 순서가 달라지면? 관리되는지도 생각해봐야할것


[설계]

1. 지도 위에 마커들을 찍는데
    1. 특정 좌표를 중심으로 (반경 몇 미터 혹은 화면 내)
        1. 내 위치 
        2. 화면센터값
    2. 좌표를 누르면 액션(윈도우가 뜨거나 바텀시트가 나오거나)
2. 클러스터 기능 추가



그러면 왜 오버레이를 깔지..? 어느 경우에 필요하지?
2. 그 다음에 이 오버레이를 여러 겹을 깔 수 있는지?


Window.naver 를 못찾는 문제 -> 두가지 답이 나와야함 -> 상태값으로 제어했음
클러스터링 -> 레이어 하나 더 만들기


Map
├ ClusterLayer
│ └ zoom 낮을 때
│
├ MarkerOverlay
│ └ zoom 높을 때 마커들   —> 여기까지(수/목)
│
├ SelectedOverlay
│ └ 선택된 마커 강조
│
└ InfoOverlay   —> 여기까지(금)
└ 업체 정보 카드






https://develop-obm.tistory.com/124
https://postforty.tistory.com/430

<마커 클러스터링>
https://github.com/navermaps/marker-tools.js/tree/master/marker-clustering


