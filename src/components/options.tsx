import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export interface OptionsProps {
  options: Option[];
}

export interface Option {
  name: string;
  link: string;
}

export default function Options({ options }: OptionsProps) {
  const navigate = useNavigate();
  const handleNavigate = (link: string) => {
    navigate(link);
  };

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
                variant="ghost"
                size="sm"
                className="h-6 hover:text-black text-white font-normal rounded-full"
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
