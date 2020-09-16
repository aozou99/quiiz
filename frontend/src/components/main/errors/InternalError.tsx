import { Container } from "@material-ui/core";
import { GoBackQuiizButton } from "components/common/button/GoBackQuiizButton";
import { Description } from "components/common/content/Description";
import React from "react";

export default () => {
  return (
    <Container maxWidth="sm">
      <Description
        title={"思わぬエラーでページが表示できませんでした"}
        caption={"ご不便おかけして申し訳ありません。"}
        button={<GoBackQuiizButton />}
        icon={
          <img width="100%" src="/images/errors/500.jpg" alt={"Page Error"} />
        }
      />
    </Container>
  );
};
