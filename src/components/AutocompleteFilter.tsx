import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command.tsx";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ChevronsUpDown } from "lucide-react";

interface AutocompleteProps<T> {
  list: T[];
  label: string;
  handleSelect: (value: any) => void;
  id: string;
  condition: boolean;
  active: string;
  placeholder: string;
  disabled?: boolean;
  width?: string;
  widthPop?: string;
}

export const AutocompleteFilter = ({
  list,
  label,
  handleSelect,
  id,
  condition,
  active,
  placeholder,
  disabled = false,
  width = "w-[300px]",
  widthPop = "w-[300px]",
}: AutocompleteProps<any>) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="ghost"
          role="combobox"
          className={cn(
            `${width} justify-between rounded-lg border focus-visible:ring-0`,
            condition && "text-foreground"
          )}
        >
          <span className="overflow-hidden">{active} </span>
          <ChevronsUpDown  className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className={cn(widthPop, "p-0")}>
        <Command>
          <CommandInput
            placeholder={placeholder}
            className="w-full p-2 text-[13px] font-inter"
          />
          <CommandGroup>
            <CommandList>
              <CommandItem
                className="text-[13px] font-inter"
                onSelect={() => handleSelect("all")}
              >
                Todos
              </CommandItem>
              {list.map((option) => (
                <CommandItem
                  className="text-[13px] font-inter"
                  key={option[id]}
                  onSelect={() => handleSelect(option[id])}
                >
                  {option[label]}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
          <CommandEmpty />
        </Command>
      </PopoverContent>
    </Popover>
  );
};
