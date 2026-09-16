import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  href?: string;
}

export default function KpiCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  href,
}: Props) {
  const content = (
    <div
      className={`
        bg-white rounded-2xl p-6 border border-slate-200 shadow-sm
        transition
        ${href ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : "hover:shadow-md"}
      `}
    >
      <div className="flex justify-between">
        <div>
          <p className="text-slate-500 text-sm">{title}</p>
          <h3 className="text-4xl font-bold mt-2">{value}</h3>
        </div>

        <div className="bg-slate-100 p-4 rounded-xl">
          <Icon size={26} />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}