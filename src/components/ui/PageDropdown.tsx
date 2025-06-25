"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, FileText, Flag, MoreVertical, Trash2 } from "lucide-react";

interface PageDropdownProps {
	onAction: (action: string) => void;
	children?: React.ReactNode;
}

export function PageDropdown({ onAction, children }: PageDropdownProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{children || (
					<Button
						variant="ghost"
						size="icon"
						className="w-4 h-4 hover:bg-page-icon-hover/25 rounded focus-visible:ring-2 focus-visible:ring-page-focus-ring"
					>
						<MoreVertical className="w-3 h-3 text-page-dots-color" />
					</Button>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				className="w-48 border-dropdown-border-color"
			>
				<div className="px-2 py-1.5 text-sm font-medium text-gray-900 border-b border-dropdown-border-color">
					Settings
				</div>
				<DropdownMenuItem onClick={() => onAction("set-first")}>
					<Flag className="w-4 h-4 mr-2 text-dropdown-flag-color fill-dropdown-flag-color" />
					Set as first page
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => onAction("rename")}>
					<Edit className="w-4 h-4 mr-2 text-dropdown-icon-color" />
					Rename
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => onAction("copy")}>
					<Copy className="w-4 h-4 mr-2 text-dropdown-icon-color" />
					Copy
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => onAction("duplicate")}>
					<FileText className="w-4 h-4 mr-2 text-dropdown-icon-color" />
					Duplicate
				</DropdownMenuItem>
				<DropdownMenuSeparator className="mx-3 bg-dropdown-border-color" />
				<DropdownMenuItem
					onClick={() => onAction("delete")}
					className="text-dropdown-delete-color focus:text-dropdown-delete-color"
				>
					<Trash2 className="w-4 h-4 mr-2 text-dropdown-delete-color" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
