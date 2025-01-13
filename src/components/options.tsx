import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export interface OptionsProps {
  options: Option[];
}

export interface Option {
  name: string;
  link: string;
}

export default function Options({ options }: OptionsProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const handleNavigate = (link: string) => {
    navigate(link);
  };

  const [itemActive, setItemActive] = useState<string>("");

  useEffect(() => {
    const path = "/" + pathname.split("/").slice(1, 3).join("/");
    
    if (path === "/") {
      setItemActive("/home");
      return;
    } else {
      setItemActive(path);
    }
  }, [pathname]);

  return (
    <div className="flex justify-between">
      <div className="bg-white w-full flex-grow-0">
        <div className="bg-secondary w-full h-full rounded-t-3xl">&nbsp;</div>
      </div>
      <div className="bg-secondary w-full flex-grow flex justify-center max-w-max">
        <div className="bg-white p-2 px-4 flex justify-center w-full flex-wrap gap-2 rounded-b-3xl">
          <div className="bg-black rounded-full p-1 flex justify-center gap-2 items-center">
            {options.map((option, index) => (
              <Button
                key={index}
                variant={option.link === itemActive ? "secondary" : "ghost"}
                size="sm"
                className={`h-6 hover:text-black text-white font-normal rounded-full ${
                  option.link === itemActive ? "text-black" : ""
                }`}
                onClick={() => handleNavigate(option.link)}
              >
                {option.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white w-full flex-grow-0">
        <div className="bg-secondary w-full h-full rounded-t-3xl">&nbsp;</div>
      </div>
    </div>
  );
}
