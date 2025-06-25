import { CheckCircle, FileText, Info } from "lucide-react";
import { useState } from "react";

export interface Page {
	id: string;
	name: string;
	isActive?: boolean;
}

export function usePages(initialPages?: Page[]) {
	const [pages, setPages] = useState<Page[]>(
		initialPages || [
			{
				id: "info",
				name: "Info",
				isActive: true,
			},
			{ id: "details", name: "Details" },
			{ id: "other", name: "Other" },
			{ id: "ending", name: "Ending" },
		],
	);

	const [activePageId, setActivePageId] = useState("info");
	const [renamingPageId, setRenamingPageId] = useState<string | null>(null);
	const [tempName, setTempName] = useState("");

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

	const startRename = (pageId: string) => {
		const pageToRename = pages.find((p) => p.id === pageId);
		if (pageToRename) {
			setRenamingPageId(pageId);
			setTempName(pageToRename.name);
		}
	};

	const movePageToFirst = (pageId: string) => {
		const pageToMove = pages.find((p) => p.id === pageId);
		if (pageToMove) {
			const otherPages = pages.filter((p) => p.id !== pageId);
			setPages([pageToMove, ...otherPages]);
		}
	};

	const copyPage = (pageId: string) => {
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
	};

	const duplicatePage = (pageId: string) => {
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
	};

	const deletePage = (pageId: string) => {
		setPages(pages.filter((p) => p.id !== pageId));
		if (activePageId === pageId && pages.length > 1) {
			const remainingPages = pages.filter((p) => p.id !== pageId);
			setActivePageId(remainingPages[0].id);
		}
	};

	const handlePageAction = (pageId: string, action: string) => {
		switch (action) {
			case "set-first":
				movePageToFirst(pageId);
				break;
			case "rename":
				startRename(pageId);
				break;
			case "copy":
				copyPage(pageId);
				break;
			case "duplicate":
				duplicatePage(pageId);
				break;
			case "delete":
				deletePage(pageId);
				break;
		}
	};

	const getPageIcon = (index: number) => {
		if (index === 0) {
			return <Info className="w-5 h-5" />;
		} else if (index === pages.length - 1) {
			return <CheckCircle className="w-5 h-5" />;
		} else {
			return <FileText className="w-5 h-5" />;
		}
	};

	return {
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
		startRename,
		movePageToFirst,
		copyPage,
		duplicatePage,
		deletePage,
		getPageIcon,
	};
}
