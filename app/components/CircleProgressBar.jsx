import React, { useEffect, useState } from "react";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { buildStyles } from "react-circular-progressbar";

export const CircleProgressBar = ({ percentage }) => {
  const [color, setColor] = useState("#FFB7B7");

  useEffect(() => {
    if (percentage <= 49) {
      setColor("#EE6055");
    } else if (percentage <= 99) {
      setColor("#62C471");
    } else {
      setColor("#B7FFB7");
    }
  }, [percentage]);

  return (
    <div className="flex items-center justify-center w-16 h-16">
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          textSize: "25px",
          pathColor: color,
          textColor: "black",
          trailColor: "#d6d6d6",
          strokeWidth: 20,
        })}
      />
    </div>
  );
};
