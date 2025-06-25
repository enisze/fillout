"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageDropdown } from "@/components/ui/PageDropdown";
import { CheckCircle, FileText, Info, Plus } from "lucide-react";
import React, { useState } from "react";

interface Page {
	id: string;
	name: string;
	isActive?: boolean;
}

export default function PageNavigation() {
	const [pages, setPages] = useState<Page[]>([
		{
			id: "info",
			name: "Info",
			isActive: true,
		},
		{ id: "details", name: "Details" },
		{ id: "other", name: "Other" },
		{ id: "ending", name: "Ending" },
	]);

	const [activePageId, setActivePageId] = useState("info");
	const [renamingPageId, setRenamingPageId] = useState<string | null>(null);
	const [tempName, setTempName] = useState("");

	const getPageIcon = (index: number) => {
		if (index === 0) {
			return <Info className="w-5 h-5" />;
		} else if (index === pages.length - 1) {
			return <CheckCircle className="w-5 h-5" />;
		} else {
			return <FileText className="w-5 h-5" />;
		}
	};

	const handleRenameSubmit = (pageId: string) => {
		if (tempName.trim()) {
			setPages(
				pages.map((p) =>
					p.id === pageId ? { ...p, name: tempName.trim() } : p,
				),
			);
		}
		setRenamingPageId(null);
		setTempName("");
	};

	const handleRenameCancel = () => {
		setRenamingPageId(null);
		setTempName("");
	};

	const addNewPage = (afterIndex: number) => {
		const newPage: Page = {
			id: `page-${Date.now()}`,
			name: "New Page",
		};
		const newPages = [...pages];
		newPages.splice(afterIndex + 1, 0, newPage);
		setPages(newPages);
	};

	const handlePageAction = (pageId: string, action: string) => {
		switch (action) {
			case "set-first": {
				const pageToMove = pages.find((p) => p.id === pageId);
				if (pageToMove) {
					const otherPages = pages.filter((p) => p.id !== pageId);
					setPages([pageToMove, ...otherPages]);
				}
				break;
			}
			case "rename": {
				const pageToRename = pages.find((p) => p.id === pageId);
				if (pageToRename) {
					setRenamingPageId(pageId);
					setTempName(pageToRename.name);
				}
				break;
			}
			case "copy": {
				const pageToCopy = pages.find((p) => p.id === pageId);
				if (pageToCopy) {
					const newPage = {
						...pageToCopy,
						id: `${pageId}-copy-${Date.now()}`,
						name: `${pageToCopy.name} Copy`,
					};
					const pageIndex = pages.findIndex((p) => p.id === pageId);
					const newPages = [...pages];
					newPages.splice(pageIndex + 1, 0, newPage);
					setPages(newPages);
				}
				break;
			}
			case "duplicate": {
				const pageToDuplicate = pages.find((p) => p.id === pageId);
				if (pageToDuplicate) {
					const newPage = {
						...pageToDuplicate,
						id: `${pageId}-duplicate-${Date.now()}`,
						name: `${pageToDuplicate.name} Duplicate`,
					};
					const pageIndex = pages.findIndex((p) => p.id === pageId);
					const newPages = [...pages];
					newPages.splice(pageIndex + 1, 0, newPage);
					setPages(newPages);
				}
				break;
			}
			case "delete":
				setPages(pages.filter((p) => p.id !== pageId));
				if (activePageId === pageId && pages.length > 1) {
					const remainingPages = pages.filter((p) => p.id !== pageId);
					setActivePageId(remainingPages[0].id);
				}
				break;
		}
	};

	return (
		<div className="bg-white px-4 py-2">
			<div className="flex items-center">
				{pages.map((page, index) => (
					<React.Fragment key={page.id}>
						<div className="group relative flex items-center">
							{renamingPageId === page.id ? (
								<div className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-page-border-focus rounded-lg text-sm font-medium leading-5">
									{React.cloneElement(
										getPageIcon(index) as React.ReactElement,
										{
											className: "w-5 h-5 text-page-icon-active",
										} as React.HTMLAttributes<SVGElement>,
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
										activePageId === page.id ? "page-active" : "page-inactive"
									}
									size="page"
									onClick={() => setActivePageId(page.id)}
									className={`relative text-sm leading-5 font-medium ${
										activePageId === page.id
											? "focus-visible:ring-page-focus-ring focus-visible:border-page-border-focus pr-2"
											: ""
									}`}
								>
									{React.cloneElement(
										getPageIcon(index) as React.ReactElement,
										{
											className: `w-5 h-5 ${
												activePageId === page.id
													? "text-page-icon-active"
													: "text-page-text-inactive"
											}`,
										} as React.HTMLAttributes<SVGElement>,
									)}
									{page.name}
									{activePageId === page.id && (
										<PageDropdown
											onAction={(action) => handlePageAction(page.id, action)}
										/>
									)}
								</Button>
							)}{" "}
						</div>

						{index < pages.length - 1 && (
							<div className="group relative flex items-center justify-center">
								{/* Single dashed line that splits into two on hover */}
								<div className="w-5 h-0.5 border-t-[1.5px] border-dashed border-gray-300 transition-all duration-300 group-hover:-translate-x-2.5"></div>
								<div className="w-0 h-0.5 border-t-[1.5px] border-dashed border-gray-300 transition-all duration-300 group-hover:w-5 group-hover:translate-x-2.5"></div>

								{/* Center + button */}
								<Button
									variant="ghost"
									size="icon"
									className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white rounded-full border border-gray-300 scale-0 group-hover:scale-100"
									onClick={() => addNewPage(index)}
								>
									<Plus className="w-3 h-3 text-gray-600" />
								</Button>
							</div>
						)}
					</React.Fragment>
				))}

				{/* Dashed line before Add page button */}
				<div className="flex items-center h-8">
					<div className="w-5 h-0.5 border-t-[1.5px] border-dashed border-gray-300"></div>
				</div>

				<Button
					variant="page-active"
					size="page"
					className="text-sm leading-5 font-medium"
					onClick={() => addNewPage(pages.length - 1)}
				>
					<Plus className="w-5 h-5" />
					Add page
				</Button>
			</div>
		</div>
	);
}
