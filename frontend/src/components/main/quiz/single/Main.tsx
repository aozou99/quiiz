import React from "react";
import ItemList from "components/main/quiz/single/sub/ItemList";

type quiz = {
  id: number;
  imgPath: string;
  title: string;
  author: string;
  authorImgPath: string;
  selectA: string;
  selectB: string;
  selectC: string;
  selectD: string;
  answer: 0 | 1 | 2 | 3;
  description: string;
};

const itemList: quiz[] = [
  {
    id: 1,
    imgPath: "/images/mock/animal/resize_harinezumi.jpg",
    title: "ハリネズミの針は何本ある？",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    selectA: "2000~4000本",
    selectB: "5000~7000本",
    selectC: "7000~9000本",
    selectD: "10000本以上",
    answer: 1,
    description: "",
  },
  {
    id: 2,
    imgPath: "/images/mock/animal/risu.jpg",
    title: "リスはピンチになると何をする？",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    selectA: "仁王立ちをする",
    selectB: "死んだふりをする",
    selectC: "しっぽを切る",
    selectD: "うんちする",
    answer: 2,
    description:
      "フクロウなどの天敵に襲われた時に、わざとシッポをちぎってオトリにして逃げるそうです。\n構造がトカゲのシッポ切りと同じですが、ただトカゲと違うのはリスにはシッポの再生機能がありません。\nこのようにリスのしっぽは非常に取れやすいので、気軽に触らないであげてくださいね。",
  },
  {
    id: 3,
    imgPath: "/images/mock/animal/cat.jpg",
    title: "子ねこは1日にどのくらい寝る？",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    selectA: "7~10時間",
    selectB: "11~14時間",
    selectC: "14~17時間",
    selectD: "18~20時間",
    answer: 3,
    description: "",
  },
  {
    id: 4,
    imgPath: "/images/mock/animal/elephant.jpg",
    title: "ゾウの耳はなんで大きいの？",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    selectA: "体温調節のため",
    selectB: "敵が近くにいるか音で気づくため",
    selectC: "鼻とのバランスを取るため",
    selectD: "強さを示すため",
    answer: 0,
    description: "",
  },
  {
    id: 5,
    imgPath: "/images/mock/animal/koara.jpg",
    title: "コアラが木に抱きつく理由ってなに？",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    selectA: "天敵から身を守るため",
    selectB: "ごはんが近くにあるから",
    selectC: "仲間が近くにいるから",
    selectD: "体温調節するため",
    answer: 3,
    description: "",
  },
  {
    id: 6,
    imgPath: "/images/mock/animal/araiguma.jpg",
    title: "アライグマは何で食べ物を水で洗ってるの？",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    selectA: "魚とかを捕まえようとしているから",
    selectB: "食べ物をきれいにしたいから",
    selectC: "濡れている状態が好きだから",
    selectD: "実は理由はない",
    answer: 0,
    description: "",
  },
  {
    id: 7,
    imgPath: "/images/mock/animal/hitsuji.jpg",
    title: "もともとヒツジ料理だったお菓子はどれ？",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    selectA: "ようかん",
    selectB: "にくまん",
    selectC: "わたあめ",
    selectD: "ましょまろ",
    answer: 0,
    description: "",
  },
  {
    id: 8,
    imgPath: "/images/mock/animal/kame.jpg",
    title: "カメは何で長生きできるの？",
    author: "ataoki",
    authorImgPath: "/images/mock/avator/favicon512.png",
    selectA: "野菜しか食べないから",
    selectB: "変温動物だから",
    selectC: "脱皮をするから",
    selectD: "心拍数が少ないから",
    answer: 0,
    description: "",
  },
];

const Main: React.FC = () => {
  return <ItemList itemList={itemList.concat(itemList)} />;
};

export default Main;
