import React from "react";
import { Description } from "components/common/content/Description";
import AirlineSeatFlatAngledIcon from "@material-ui/icons/AirlineSeatFlatAngled";

const ReadyDescription: React.FC = () => {
  return (
    <Description
      icon={
        <AirlineSeatFlatAngledIcon style={{ fontSize: 120 }} color="action" />
      }
      title="準備中です"
      caption="待つだけの忍耐さえあれば、結局はすべてうまく行くでしょう"
    />
  );
};

export default ReadyDescription;
