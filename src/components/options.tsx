import { Button } from "./ui/button";

export default function Options() {
  return (
    <div className="flex justify-between">
      <div className="bg-white w-full flex-grow-0">
        <div className="bg-secondary w-full h-full rounded-t-3xl">&nbsp;</div>
      </div>
      <div className="bg-secondary w-full flex-grow flex justify-center max-w-max">
        <div className="bg-white p-2 px-4 flex justify-center w-full flex-wrap gap-2 rounded-b-3xl">
          <div className="bg-black rounded-full p-1 flex justify-center gap-2 items-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 hover:text-black text-white font-normal rounded-full"
            >
              Button
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 hover:text-black text-white font-normal rounded-full"
            >
              Button
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 hover:text-black text-white font-normal rounded-full"
            >
              Button
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 hover:text-black text-white font-normal rounded-full"
            >
              Button
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-white w-full flex-grow-0">
        <div className="bg-secondary w-full h-full rounded-t-3xl">&nbsp;</div>
      </div>
    </div>
  );
}
