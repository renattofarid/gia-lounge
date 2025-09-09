import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

export function DateTimePickerInlineLottery({
  value,
  onChange,
}: {
  value: Date;
  onChange: (date: Date) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  function handleTimeChange(type: "hour" | "minute", valueNum: number) {
    const newDate = new Date(value);
    if (type === "hour") newDate.setHours(valueNum);
    if (type === "minute") newDate.setMinutes(valueNum);
    onChange(newDate);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(!open)}
        className="w-full justify-start pl-3 text-left font-normal bg-secondary border-[#9A7FFF] focus:border-[#9A7FFF] focus:ring-[#9A7FFF] font-poopins"
      >
        {format(value, "dd/MM/yyyy HH:mm")}
      </Button>

      {open && (
        <div className="absolute top-full mt-2 z-50 bg-white shadow-md rounded-md p-0 flex w-fit">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              if (date) {
                onChange(date);
              }
            }}
          />

          <div className="flex max-h-[280px]">
            <div>
              <ScrollArea className="h-full w-fit rounded border-r">
                <div className="flex flex-col gap-1 p-2">
                  {Array.from({ length: 24 }, (_, i) => (
                    <Button
                      key={i}
                      variant={value.getHours() === i ? "default" : "ghost"}
                      size="default"
                      type="button"
                      className="w-fit p-0 aspect-square"
                      onClick={() => handleTimeChange("hour", i)}
                    >
                      {i.toString().padStart(2, "0")}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>

            <div>
              <ScrollArea className="h-full w-fit rounded">
                <div className="flex flex-col gap-1 p-2">
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
                    <Button
                      key={m}
                      variant={value.getMinutes() === m ? "default" : "ghost"}
                      size="default"
                      className="w-fit p-0 aspect-square"
                      type="button"
                      onClick={() => handleTimeChange("minute", m)}
                    >
                      {m.toString().padStart(2, "0")}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
