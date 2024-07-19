import React from "react";
import { Draggable } from "react-beautiful-dnd";

const Item = ({
  item,
  index,
  columnId,
  illegalMove,
  draggingItemId,
  selectedItems,
  onSelectItem,
}) => {
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={(e) => {
            if (!e.shiftKey) {
              onSelectItem(item.id, columnId);
            }
          }}
          style={{
            userSelect: "none",
            padding: 16,
            margin: "0 0 8px 0",
            minHeight: "50px",
            backgroundColor:
              illegalMove && draggingItemId === item.id
                ? "red"
                : selectedItems.some((selected) => selected.itemId === item.id)
                  ? "lightgreen"
                  : snapshot.isDragging
                    ? "#263B4A"
                    : "#456C86",
            color: "white",
            ...provided.draggableProps.style,
            opacity: selectedItems.some(
              (selected) => selected.itemId === item.id,
            )
              ? 0.5
              : 1,
          }}
        >
          {item.content}
        </div>
      )}
    </Draggable>
  );
};

export default Item;
