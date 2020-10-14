import React from "react";
import { Helmet } from "react-helmet";

export const MetaTag: React.FC<{
  title: string;
  description?: string;
  sufix?: string;
  noindex?: boolean;
}> = ({ title, sufix, description, noindex }) => {
  return (
    <Helmet>
      <title>
        {title} | {sufix || "Quiiz"}
      </title>
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex" />}
    </Helmet>
  );
};
