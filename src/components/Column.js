import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Item from "./Item";

const Column = ({
  columnId,
  column,
  illegalMove,
  draggingItemId,
  selectedItems,
  onSelectItem,
}) => {
  return (
    <Droppable key={columnId} droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            background: snapshot.isDraggingOver ? "lightblue" : "lightgrey",
            padding: 8,
            width: 250,
            margin: 8,
          }}
        >
          <h2>{column.name}</h2>
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
      )}
    </Droppable>
  );
};

export default Column;
