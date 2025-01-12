"use client";

import { User } from "lucide-react";
import { Button } from "./ui/button";

export function AppSidebar() {
  return (
    <div className="hidden sm:flex sm:flex-col min-w-24 p-4 justify-center items-center gap-4">
      <Button size="icon" className="bg-primary/60 rounded-full h-10 w-10"><User className="min-w-5 min-h-5"/></Button>
      <Button size="icon" className="bg-primary/60 rounded-full h-10 w-10"><User className="min-w-5 min-h-5"/></Button>
      <Button size="icon" className="rounded-full h-10 w-10"><User className="min-w-5 min-h-5"/></Button>
      <Button size="icon" className="bg-primary/60 rounded-full h-10 w-10"><User className="min-w-5 min-h-5"/></Button>
      <Button size="icon" className="bg-primary/60 rounded-full h-10 w-10"><User className="min-w-5 min-h-5"/></Button>
      <Button size="icon" className="bg-primary/60 rounded-full h-10 w-10"><User className="min-w-5 min-h-5"/></Button>
    </div>
  );
}
