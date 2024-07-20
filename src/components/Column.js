import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Item from "./Item";
import "../styles.css";

const Column = ({
  columnId,
  column,
  illegalMove,
  draggingItemId,
  selectedItems,
  onSelectItem,
}) => (
  <Droppable key={columnId} droppableId={columnId}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className={`column ${snapshot.isDraggingOver ? "columnDraggingOver" : ""}`}
      >
        <div className="column-header">{column.name}</div>
        <div className="column-inner">
          {column.items.map((item, index) => (
            <Item
              key={item.id}
              item={item}
              index={index}
              columnId={columnId}
              illegalMove={illegalMove}
              draggingItemId={draggingItemId}
              selectedItems={selectedItems}
              onSelectItem={onSelectItem}
            />
          ))}
          {provided.placeholder}
        </div>
      </div>
    )}
  </Droppable>
);

export default Column;
