import React from "react";
import { Draggable } from "react-beautiful-dnd";
import "../styles.css";

const Item = ({
  item,
  index,
  columnId,
  illegalMove,
  draggingItemId,
  selectedItems,
  onSelectItem,
}) => (
  <Draggable key={item.id} draggableId={item.id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`item 
          ${snapshot.isDragging ? "itemDragging" : ""} 
          ${selectedItems.some((selected) => selected.itemId === item.id) ? "itemSelected" : ""}
          ${illegalMove && draggingItemId === item.id ? "itemIllegalMove" : ""}
        `}
        onClick={(e) => handleItemClick(e, item.id, columnId, onSelectItem)}
      >
        {item.content}
      </div>
    )}
  </Draggable>
);

const handleItemClick = (e, itemId, columnId, onSelectItem) => {
  if (!e.shiftKey) {
    onSelectItem(itemId, columnId);
  }
};

export default Item;
