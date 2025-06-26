import type { DragEvent } from "react";
import { useCallback, useState } from "react";

interface DragState {
	draggedIndex: number | null;
	dragOverIndex: number | null;
	dropPosition: "before" | "after" | null;
}

export function useDragAndDrop(
	onReorder: (fromIndex: number, toIndex: number) => void,
) {
	const [dragState, setDragState] = useState<DragState>({
		draggedIndex: null,
		dragOverIndex: null,
		dropPosition: null,
	});

	const resetDragState = useCallback(() => {
		setDragState({
			draggedIndex: null,
			dragOverIndex: null,
			dropPosition: null,
		});
	}, []);

	const handleDragStart = useCallback(
		(e: DragEvent<HTMLElement>, index: number) => {
			setDragState((prev) => ({ ...prev, draggedIndex: index }));
			if (e.dataTransfer) {
				e.dataTransfer.effectAllowed = "move";
			}
		},
		[],
	);

	const handleDragOver = useCallback(
		(e: DragEvent<HTMLElement>, index: number) => {
			e.preventDefault();
			if (e.dataTransfer) {
				e.dataTransfer.dropEffect = "move";
			}

			// Determine drop position based on mouse position
			const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
			const midPoint = rect.left + rect.width / 2;
			const position = e.clientX < midPoint ? "before" : "after";

			setDragState((prev) => ({
				...prev,
				dragOverIndex: index,
				dropPosition: position,
			}));
		},
		[],
	);

	const createDropZoneHandlers = useCallback(
		(index: number, position: "before" | "after") => ({
			onDragOver: (e: DragEvent<HTMLElement>) => {
				e.preventDefault();
				if (e.dataTransfer) {
					e.dataTransfer.dropEffect = "move";
				}
				setDragState((prev) => ({
					...prev,
					dragOverIndex: index,
					dropPosition: position,
				}));
			},
			onDragEnter: (e: DragEvent<HTMLElement>) => {
				e.preventDefault();
				setDragState((prev) => ({
					...prev,
					dragOverIndex: index,
					dropPosition: position,
				}));
			},
		}),
		[],
	);

	const handleDrop = useCallback(
		(e: DragEvent<HTMLElement>, dropIndex: number) => {
			e.preventDefault();
			const { draggedIndex, dropPosition } = dragState;

			if (draggedIndex !== null && draggedIndex !== dropIndex) {
				let targetIndex = dropIndex;
				if (dropPosition === "after") {
					targetIndex = dropIndex + 1;
				}
				// Adjust for the dragged item being removed
				if (draggedIndex < targetIndex) {
					targetIndex--;
				}

				onReorder(draggedIndex, targetIndex);
			}
			resetDragState();
		},
		[dragState, onReorder, resetDragState],
	);

	return {
		dragState,
		handleDragStart,
		handleDragOver,
		handleDragEnd: resetDragState,
		handleDrop,
		createDropZoneHandlers,
	};
}
