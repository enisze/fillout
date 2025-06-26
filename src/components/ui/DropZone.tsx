import type { DragEvent } from "react";

interface DropZoneProps {
	isVisible: boolean;
	showIndicator: boolean;
	onDrop: (e: DragEvent<HTMLElement>) => void;
	onDragOver: (e: DragEvent<HTMLElement>) => void;
	onDragEnter: (e: DragEvent<HTMLElement>) => void;
	className?: string;
}

export function DropZone({
	isVisible,
	showIndicator,
	onDrop,
	onDragOver,
	onDragEnter,
	className = "w-4 h-8 flex items-center justify-center cursor-pointer relative z-30 bg-transparent border-none p-0",
}: DropZoneProps) {
	if (!isVisible) return null;

	return (
		<button
			type="button"
			className={className}
			onDragOver={onDragOver}
			onDragEnter={onDragEnter}
			onDrop={onDrop}
		>
			{showIndicator && (
				<div className="w-1 h-8 bg-blue-500 rounded-full shadow-lg animate-pulse" />
			)}
		</button>
	);
}
