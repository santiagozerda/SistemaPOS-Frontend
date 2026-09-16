import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string;
  icon: LucideIcon;
}

export default function ReportKpiCard({
  title,
  value,
  icon: Icon,
}: Props) {
  return (
    <div
      className="
        bg-white
        rounded-xl
        border
        border-slate-200
        shadow-sm
        p-5
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h3 className="text-2xl font-bold mt-1">
            {value}
          </h3>
        </div>

        <div
          className="
            w-12
            h-12
            rounded-xl
            bg-blue-100
            flex
            items-center
            justify-center
          "
        >
          <Icon
            size={22}
            className="text-blue-600"
          />
        </div>
      </div>
    </div>
  );
}
