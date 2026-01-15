import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("relative", className)}>
      <Image
        src="/images/Logo-bannière-OphirEstate-Rogner.png"
        alt="Ophir Estate"
        width={180}
        height={60}
        className="h-16 w-auto object-contain"
        priority
      />
    </div>
  );
}
