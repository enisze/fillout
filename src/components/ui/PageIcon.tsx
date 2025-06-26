import { cn } from "@/lib/utils";
import { CheckCircle, FileText, Info } from "lucide-react";

interface PageIconProps {
	index: number;
	totalPages: number;
	isActive: boolean;
	className?: string;
}

export function PageIcon({
	index,
	totalPages,
	isActive,
	className,
}: PageIconProps) {
	const iconClassName = cn(
		"w-5 h-5 flex-none transition-colors text-page-text-inactive duration-300",
		isActive && "text-page-icon-active",
		className,
	);

	if (index === 0) {
		return <Info className={iconClassName} />;
	}

	if (index === totalPages - 1) {
		return <CheckCircle className={iconClassName} />;
	}

	return <FileText className={iconClassName} />;
}
