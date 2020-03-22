import React from 'react';
import { Container } from '@material-ui/core';
import ItemListByCategory from 'components/main/quiz/index/ sub/ItemListByCategory';


const itemList = [
  {
    id: 1,
    imgPath: "/images/mock/animal/resize_harinezumi.jpg",
    title: "ハリネズミ雑学",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    size: 10,
  },
  {
    id: 2,
    imgPath: "/images/mock/animal/risu.jpg",
    title: "リス雑学",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    size: 10,
  },
  {
    id: 3,
    imgPath: "/images/mock/animal/cat.jpg",
    title: "ねこ雑学",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    size: 10,
  },
  {
    id: 4,
    imgPath: "/images/mock/animal/elephant.jpg",
    title: "ぞう雑学",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    size: 10,
  },
  {
    id: 5,
    imgPath: "/images/mock/animal/koara.jpg",
    title: "コアラ雑学",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    size: 10,
  },
  {
    id: 6,
    imgPath: "/images/mock/animal/araiguma.jpg",
    title: "アライグマ雑学",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    size: 10,
  },
  {
    id: 7,
    imgPath: "/images/mock/animal/hitsuji.jpg",
    title: "ヒツジ雑学",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    size: 10,
  },
  {
    id: 8,
    imgPath: "/images/mock/animal/kame.jpg",
    title: "カメ雑学",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    size: 10,
  },
]

const Main: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <ItemListByCategory 
        category="動物シリーズ"
        itemList={itemList}
      />
      <ItemListByCategory 
        category="動物シリーズ"
        itemList={itemList}
      />
    </Container>
  );
}

export default Main;