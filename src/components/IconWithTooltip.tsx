import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { LucideIcon } from "lucide-react";

interface IconWithTooltipProps {
  icon: LucideIcon; 
  label: string;
}

export function IconWithTooltip({ icon: Icon, label }: IconWithTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Icon className="h-5 w-5 cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
