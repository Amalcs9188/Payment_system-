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
    <div className={`${className} pt-4`}>
      <CardTitle className="text-center text-2xl w-full gap-1 flex flex-col items-start  font-bold">
        <Badge variant={"outline"} className={`text-2xl ${color}`}>
          {title}
        </Badge>
      </CardTitle>
      <CardDescription className="text-star pt-1 pb-6 text-b">
        {description}
      </CardDescription>
    </div>
  );
};

export default ComponentHeader;
