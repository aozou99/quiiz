import { Container, Typography } from "@material-ui/core";
import { GoBackQuiizButton } from "components/common/button/GoBackQuiizButton";
import { Description } from "components/common/content/Description";
import React from "react";

export default () => {
  return (
    <Container maxWidth="sm">
      <Description
        title={"ページが見つかりませんでした"}
        caption={"「迷わずいけよ」と言っても、俺にも迷う時もある"}
        button={<GoBackQuiizButton />}
        icon={
          <img
            width="100%"
            src="/images/errors/404.jpg"
            alt={"Page NotFound"}
          />
        }
      />
    </Container>
  );
};
