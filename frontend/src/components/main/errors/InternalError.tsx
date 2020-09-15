import { Container, Typography } from "@material-ui/core";
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
          <>
            <a href="https://jp.freepik.com/vectors/web">
              <Typography variant="caption">
                <a href="https://jp.freepik.com/vectors/web">
                  Stories - jp.freepik.com によって作成された web ベクトル
                </a>{" "}
              </Typography>
            </a>
            <img width="100%" src="/images/errors/500.jpg" alt={"Page Error"} />
          </>
        }
      />
    </Container>
  );
};

// 404
// <a href='https://jp.freepik.com/vectors/business'>Pikisuperstar - jp.freepik.com によって作成された business ベクトル</a>

// 500
// <a href='https://jp.freepik.com/vectors/web'>Stories - jp.freepik.com によって作成された web ベクトル</a>
