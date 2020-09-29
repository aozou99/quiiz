import React from "react";
import ListAndAnswer from "components/common/quiz/ListAndAnswer";
import { Description } from "components/common/content/Description";
import LocalHotelIcon from "@material-ui/icons/LocalHotel";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import "firebase/auth";
import LaptopChromebookIcon from "@material-ui/icons/LaptopChromebook";
export const QuizTabPannel: React.FC<{ channelId: string }> = ({
  channelId,
}) => {
  const [user] = useAuthState(firebase.auth());

  return (
    <ListAndAnswer
      channelId={channelId}
      emptyResulDescription={
        user?.uid !== channelId ? (
          <Description
            icon={<LocalHotelIcon style={{ fontSize: 120 }} color="action" />}
            title={"このチャンネルには\nクイズがありません"}
            caption={"いつかクイズが生まれるかも"}
            inTab={true}
          />
        ) : (
          <Description
            icon={
              <LaptopChromebookIcon style={{ fontSize: 120 }} color="action" />
            }
            title={"パソコンでQuiizにアクセスして\nクイズを作成しましょう！"}
            caption={"お手数おかけします"}
            inTab={true}
          />
        )
      }
    />
  );
};
