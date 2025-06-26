"use client";

import { Button } from "@/components/ui/button";
import { DropZone } from "@/components/ui/DropZone";
import { Input } from "@/components/ui/input";
import { PageDropdown } from "@/components/ui/PageDropdown";
import { PageIcon } from "@/components/ui/PageIcon";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { usePages } from "@/hooks/usePages";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Fragment } from "react";

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

	const {
		dragState,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
		handleDrop,
		createDropZoneHandlers,
	} = useDragAndDrop(reorderPages);

	const { draggedIndex, dragOverIndex, dropPosition } = dragState;

	return (
		<div className="bg-white px-4 py-2">
			<div
				className="flex items-center overflow-x-auto scrollbar-hide pl-3"
				style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
			>
				{/* Drop zone at the very beginning */}
				<DropZone
					isVisible={draggedIndex !== null}
					showIndicator={
						dragOverIndex === 0 &&
						dropPosition === "before" &&
						draggedIndex !== 0
					}
					{...createDropZoneHandlers(0, "before")}
					onDrop={(e) => handleDrop(e, 0)}
				/>

				{pages.map((page, index) => (
					<Fragment key={`page-group-${page.id}`}>
						<div
							className={cn(
								"page-button relative flex items-center z-10 transition-all duration-300 flex-shrink-0",
								draggedIndex === index &&
									"opacity-30 scale-95 rotate-2 shadow-lg",
								draggedIndex !== null &&
									draggedIndex !== index &&
									"scale-95 opacity-75",
							)}
						>
							{/* White background that moves with the button */}
							<div className="absolute inset-0 bg-white z-0"></div>

							<div className="relative z-10">
								{renamingPageId === page.id ? (
									<div className="flex items-center gap-3 px-4 py-0 h-8 bg-white border-2 border-page-border-focus rounded-lg">
										<PageIcon
											index={index}
											totalPages={pages.length}
											isActive={activePageId === page.id}
										/>
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
											activePageId === page.id ? "page-active" : "page-inactive"
										}
										size={
											activePageId === page.id
												? "page-with-dots"
												: "page-without-dots"
										}
										onClick={() => setActivePageId(page.id)}
										className={cn(
											"relative transition-all duration-300 ease-in-out overflow-hidden",
											draggedIndex === index
												? "cursor-grabbing"
												: "cursor-grab",
											"hover:shadow-sm",
										)}
										draggable={true}
										onDragStart={(e) => handleDragStart(e, index)}
										onDragOver={(e) => handleDragOver(e, index)}
										onDragEnd={handleDragEnd}
										onDrop={(e) => handleDrop(e, index)}
									>
										<PageIcon
											index={index}
											totalPages={pages.length}
											isActive={activePageId === page.id}
										/>
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
								{/* Invisible drop zone for better drag targeting */}
								{draggedIndex !== null && (
									<button
										type="button"
										className="absolute inset-0 w-full h-full z-30 cursor-pointer bg-transparent border-none"
										{...createDropZoneHandlers(index, "after")}
										onDrop={(e) => handleDrop(e, index)}
									/>
								)}

								{/* Drop indicator for between items */}
								{draggedIndex !== null &&
									dragOverIndex === index &&
									dropPosition === "after" &&
									draggedIndex !== index + 1 && (
										<div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full shadow-lg animate-pulse transition-all duration-200 z-20" />
									)}

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
				))}

				{/* Drop zone at the very end */}
				<DropZone
					isVisible={draggedIndex !== null}
					showIndicator={
						dragOverIndex === pages.length - 1 && dropPosition === "after"
					}
					{...createDropZoneHandlers(pages.length - 1, "after")}
					onDrop={(e) => handleDrop(e, pages.length - 1)}
				/>

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
