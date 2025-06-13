import React from "react";
import { CardDescription, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const ComponentHeader = ({
  title,
  description,
  className,
  color
}: {
  title: string;
  description: string;
  className?: string;
  color?: string;
}) => {
  return (
    <div className={className}>
      <CardTitle className="text-center text-2xl  font-bold">
        <Badge variant={"outline"} className={`text-2xl ${color}`}>
          {title}
        </Badge>
      </CardTitle>
      <CardDescription className="text-center text-b">
        {description}
      </CardDescription>
    </div>
  );
};

export default ComponentHeader;
