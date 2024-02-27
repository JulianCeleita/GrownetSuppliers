import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const CircleProgressBar = ({ percentage }) => {
  const [color, setColor] = useState("#EE6055");

  useEffect(() => {
    if (percentage <= 49) {
      setColor("#EE6055");
    } else if (percentage <= 99) {
      setColor("#FF8A00");
    } else {
      setColor("#62C471");
    }
  }, [percentage]);

  return (
    <div className="flex items-center justify-center w-16 h-16">
      <CircularProgressbar
        value={percentage}
        text={`${Math.round(percentage)}%`}
        styles={buildStyles({
          textSize: "25px",
          pathColor: color,
          textColor: "#04444F",
          trailColor: "#d6d6d6",
          strokeWidth: 20,
        })}
      />
    </div>
  );
};
