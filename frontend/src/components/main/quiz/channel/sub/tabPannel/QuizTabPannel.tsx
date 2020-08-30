import React from "react";
import { ListAndAnswer } from "components/common/quiz/ListAndAnswer";

export const QuizTabPannel: React.FC<{ channelId: string }> = ({
  channelId,
}) => {
  return <ListAndAnswer channelId={channelId} />;
};
