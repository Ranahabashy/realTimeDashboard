import React from "react";
import { useDraggable, DragOverlay } from "@dnd-kit/core";

type Props = {
  id: string;
  data: {
    type: string;
    columnId: string;
    content?: string;
    stageId?: string;
  };
  children: React.ReactNode;
};

const KanbanItem: React.FC<Props> = ({ id, data, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    active,
  } = useDraggable({
    id,
    data,
  });

  const isActive = active?.id === id;

  return (
    <>
      {/* Only render the main item if not dragging */}
      {!isActive && (
        <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          style={{
            opacity: isDragging ? 0.5 : 1,
            borderRadius: "8px",
            cursor: "grab",
            position: "relative",
          }}
        >
          {children}
        </div>
      )}

      {/* Render floating copy while dragging */}
      {isActive && (
        <DragOverlay zIndex={1000}>
          <div
            style={{
              borderRadius: "8px",
              background: "#fff",
              padding: "12px",
              boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
              cursor: "grab",
            }}
          >
            {children}
          </div>
        </DragOverlay>
      )}
    </>
  );
};

export default KanbanItem;
