"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageDropdown } from "@/components/ui/PageDropdown";
import { usePages } from "@/hooks/usePages";
import { cn } from "@/lib/utils";
import { CheckCircle, FileText, Info, Plus } from "lucide-react";
import { type DragEvent, Fragment, useState } from "react";

export default function PageNavigation() {
	const {
		pages,
		activePageId,
		renamingPageId,
		tempName,
		setActivePageId,
		setTempName,
		addNewPage,
		handlePageAction,
		handleRenameSubmit,
		handleRenameCancel,
		reorderPages,
	} = usePages();

	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

	const handleDragStart = (e: DragEvent, index: number) => {
		setDraggedIndex(index);
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/html", "");
	};

	const handleDragOver = (e: DragEvent, index: number) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		setDragOverIndex(index);
	};

	const handleDragEnd = () => {
		setDraggedIndex(null);
		setDragOverIndex(null);
	};

	const handleDrop = (e: DragEvent, dropIndex: number) => {
		e.preventDefault();
		if (draggedIndex !== null && draggedIndex !== dropIndex) {
			reorderPages(draggedIndex, dropIndex);
		}
		setDraggedIndex(null);
		setDragOverIndex(null);
	};

	return (
		<div className="bg-white px-4 py-2">
			<div
				className="flex items-center overflow-x-auto scrollbar-hide"
				style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
			>
				{pages.map((page, index) => {
					const iconClassName = cn(
						"w-5 h-5 flex-none transition-colors duration-300",
						activePageId === page.id
							? "text-page-icon-active"
							: "text-page-text-inactive",
					);
					return (
						<Fragment key={`page-group-${page.id}`}>
							<div
								className={cn(
									"page-button relative flex items-center z-10 transition-all duration-300 flex-shrink-0",
									draggedIndex === index && "opacity-50",
									dragOverIndex === index &&
										draggedIndex !== null &&
										draggedIndex !== index &&
										"bg-blue-50",
								)}
							>
								{/* White background that moves with the button */}
								<div className="absolute inset-0 bg-white z-0"></div>

								<div className="relative z-10">
									{renamingPageId === page.id ? (
										<div className="flex items-center gap-3 px-4 py-0 h-8 bg-white border-2 border-page-border-focus rounded-lg">
											{index === 0 ? (
												<Info className={iconClassName} />
											) : index === pages.length - 1 ? (
												<CheckCircle className={iconClassName} />
											) : (
												<FileText className={iconClassName} />
											)}
											<Input
												value={tempName}
												onChange={(e) => setTempName(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														handleRenameSubmit(page.id);
													} else if (e.key === "Escape") {
														e.preventDefault();
														handleRenameCancel();
													}
												}}
												onBlur={() => handleRenameSubmit(page.id)}
												className="text-sm font-medium leading-5 border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
												autoFocus
											/>
										</div>
									) : (
										<Button
											variant={
												activePageId === page.id
													? "page-active"
													: "page-inactive"
											}
											size={
												activePageId === page.id
													? "page-with-dots"
													: "page-without-dots"
											}
											onClick={() => setActivePageId(page.id)}
											className="relative transition-all duration-300 ease-in-out overflow-hidden cursor-move"
											draggable={true}
											onDragStart={(e) => handleDragStart(e, index)}
											onDragOver={(e) => handleDragOver(e, index)}
											onDragEnd={handleDragEnd}
											onDrop={(e) => handleDrop(e, index)}
										>
											{index === 0 ? (
												<Info className={iconClassName} />
											) : index === pages.length - 1 ? (
												<CheckCircle className={iconClassName} />
											) : (
												<FileText className={iconClassName} />
											)}
											<span className="transition-all duration-300">
												{page.name}
											</span>
											<div
												className={cn(
													"transition-all duration-300 ease-in-out flex items-center justify-center",
													activePageId === page.id
														? "opacity-100 scale-100 w-4 ml-1"
														: "opacity-0 scale-75 w-0 ml-0",
												)}
											>
												{activePageId === page.id && (
													<PageDropdown
														onAction={(action) =>
															handlePageAction(page.id, action)
														}
													/>
												)}
											</div>
										</Button>
									)}
								</div>
							</div>

							{index < pages.length - 1 && (
								<div className="group relative flex items-center justify-center py-4">
									{/* Single dashed line that splits into two on hover */}
									<div className="w-5 h-0.5 border-t-[1.5px] border-dashed border-gray-300 transition-all duration-300 group-hover:-translate-x-2.5"></div>
									<div className="w-0 h-0.5 border-t-[1.5px] border-dashed border-gray-300 transition-all duration-300 group-hover:w-5 group-hover:translate-x-2.5"></div>

									{/* Center + button */}
									<div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100 z-10" />
									<Button
										variant="ghost"
										size="icon"
										className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white rounded-full border border-gray-300 scale-0 group-hover:scale-100 z-20"
										onClick={() => addNewPage(index)}
									>
										<Plus className="w-3 h-3 text-gray-600" />
									</Button>
								</div>
							)}
						</Fragment>
					);
				})}

				<div className="page-button flex items-center h-8 transition-all duration-300">
					<div className="w-5 h-0.5 border-t-[1.5px] border-dashed border-gray-300"></div>
				</div>

				<div className="page-button transition-all duration-300">
					<Button
						variant="page-active"
						size="page"
						className="text-sm leading-5 font-medium z-10 relative"
						onClick={() => addNewPage(pages.length - 1)}
					>
						<Plus className="w-5 h-5" />
						Add page
					</Button>
				</div>
			</div>
		</div>
	);
}
