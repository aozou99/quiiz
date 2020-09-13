import React, { ReactNode } from "react";
import { SignInButton } from "components/common/button/SignInButton";
import { Description } from "components/common/content/Description";

export const GuestDescription: React.FC<{
  title: string;
  caption: string;
  icon: ReactNode;
}> = ({ icon, title, caption }) => {
  return (
    <Description
      title={title}
      icon={icon}
      caption={caption}
      button={<SignInButton />}
    />
  );
};
