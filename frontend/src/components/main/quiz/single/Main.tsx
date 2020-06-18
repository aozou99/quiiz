import React from "react";
import ItemList from "components/main/quiz/single/sub/ItemList";

const itemList = [
  {
    id: 1,
    imgPath: "/images/mock/animal/resize_harinezumi.jpg",
    title: "ハリネズミの棘は何本ある？",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    size: 10,
  },
  {
    id: 2,
    imgPath: "/images/mock/animal/risu.jpg",
    title: "リスはピンチになると何をする？",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    size: 10,
  },
  {
    id: 3,
    imgPath: "/images/mock/animal/cat.jpg",
    title: "ねこは1日にどのくらい寝る？",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    size: 10,
  },
  {
    id: 4,
    imgPath: "/images/mock/animal/elephant.jpg",
    title: "ゾウの耳はなんで大きいの？",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    size: 10,
  },
  {
    id: 5,
    imgPath: "/images/mock/animal/koara.jpg",
    title: "コアラが木に抱きつく理由ってなに？",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    size: 10,
  },
  {
    id: 6,
    imgPath: "/images/mock/animal/araiguma.jpg",
    title: "アライグマは何で食べ物を水で洗ってるの？",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    size: 10,
  },
  {
    id: 7,
    imgPath: "/images/mock/animal/hitsuji.jpg",
    title: "もともとヒツジ料理だったお菓子はどれ？",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    size: 10,
  },
  {
    id: 8,
    imgPath: "/images/mock/animal/kame.jpg",
    title: "カメは何で長生きできるの？",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    size: 10,
  },
];

const Main: React.FC = () => {
  return <ItemList itemList={itemList.concat(itemList)} />;
};

export default Main;
