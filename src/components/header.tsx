import { Store, User } from "lucide-react";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="">
      <div className="flex justify-between p-4">
        <img src="/logo.svg" alt="" className="h-10"/>
        <div className="flex justify-between gap-2">
          <Button size="icon" className="rounded-full bg-pink-400 hover:bg-pink-400/80">
            <User className="min-w-5 min-h-5" />
          </Button>
          <Button
            size="icon"
            className="rounded-full bg-black hover:bg-black/80"
          >
            <Store className="min-w-5 min-h-5" />
          </Button>
          <Button size="icon" className="rounded-full">
            <User className="min-w-5 min-h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
