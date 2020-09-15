import React from "react";
import ListAndAnswer from "components/common/quiz/ListAndAnswer";
import { Description } from "components/common/content/Description";
import LocalHotelIcon from "@material-ui/icons/LocalHotel";

export const QuizTabPannel: React.FC<{ channelId: string }> = ({
  channelId,
}) => {
  return (
    <ListAndAnswer
      channelId={channelId}
      emptyResulDescription={
        <Description
          icon={<LocalHotelIcon style={{ fontSize: 120 }} color="action" />}
          title={"このチャンネルにはクイズがありません"}
          caption={"いつかクイズが生まれるかも"}
        />
      }
    />
  );
};
