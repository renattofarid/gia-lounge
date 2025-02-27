"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { type LucideIcon } from 'lucide-react';

interface IconWithTooltipProps {
  icon: LucideIcon; 
  label: string;
  className?: string;
}

export function IconWithTooltip({ icon: Icon, label, className = "min-h-5 min-w-5 flex items-center" }: IconWithTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Icon className={className} />
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
