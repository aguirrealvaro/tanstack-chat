import { Check } from "lucide-react";

export const DoubleCheck = ({ seen }: { seen: boolean }) => {
  return (
    <div className="flex shrink-0 items-center">
      <Check size={13} />
      {seen && <Check size={13} className="-ml-2" />}
    </div>
  );
};
