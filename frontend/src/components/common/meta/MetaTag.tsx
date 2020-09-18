import React from "react";
import { Helmet } from "react-helmet";

export const MetaTag: React.FC<{
  title: string;
  description?: string;
  sufix?: string;
}> = ({ title, sufix, description }) => {
  return (
    <Helmet>
      <title>
        {title} - {sufix || "Quiiz"}
      </title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
};
