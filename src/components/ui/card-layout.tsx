import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CardLayoutProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

const CardLayout: React.FC<CardLayoutProps> = ({
  title,
  description,
  icon,
  children,
  className = "",
  headerClassName = "",
  contentClassName = "",
}) => {
  return (
    <Card className={`overflow-hidden transition-all duration-200 shadow-md ${className}`}>
      <div className={`p-2 ${headerClassName}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full">
              {icon}
            </div>
            <CardTitle className="text-xl">
              {title}
            </CardTitle>
          </div>
          <CardDescription className="mt-2">
            {description}
          </CardDescription>
        </CardHeader>
      </div>
      <CardContent className={`p-6 ${contentClassName}`}>
        {children}
      </CardContent>
    </Card>
  );
};

export default CardLayout;