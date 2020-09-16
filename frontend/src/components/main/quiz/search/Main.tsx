import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "utils/helper/queryParameter";
import ListAndAnswer from "components/common/quiz/ListAndAnswer";
import { Description } from "components/common/content/Description";
import FindInPageIcon from "@material-ui/icons/FindInPage";

const nGram = require("n-gram");

const Main: React.FC = () => {
  const queryKeyword = useQuery().get("keyword");
  const [keyword, setKeyword] = useState(queryKeyword);

  const where = useMemo(() => {
    const res: {
      [key: string]: any;
    } = {};
    nGram.bigram(keyword).forEach((word: string) => {
      res[`searchTokenMap.${word}`] = {
        operator: "==",
        value: true,
      };
    });
    return res;
  }, [keyword]);

  useEffect(() => {
    setKeyword(queryKeyword);
  }, [queryKeyword]);

  return (
    <ListAndAnswer
      where={where}
      order={{}}
      dummyOff={true}
      noExecute={Object.keys(where).length < 1}
      emptyResulDescription={
        <Description
          icon={<FindInPageIcon style={{ fontSize: 120 }} color="action" />}
          title={"クイズを探してみましょう"}
          caption={
            "好奇心というのは道草でもあるわけです。確かに時間の無駄ですが、必ず自分の糧になる。"
          }
        />
      }
    />
  );
};

export default Main;
