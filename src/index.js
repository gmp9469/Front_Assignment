import React from "react";
import ReactDOM from "react-dom";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./components/Column";
import dragDrop from "./hooks/dragDrop";

function App() {
  const {
    columns,
    draggingItemId,
    illegalMove,
    selectedItems,
    onDragStart,
    onDragUpdate,
    onDragEnd,
    onSelectItem,
  } = dragDrop();

  return (
    <DragDropContext
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
    >
      <div style={{ display: "flex" }}>
        {Object.entries(columns).map(([columnId, column]) => (
          <Column
            key={columnId}
            columnId={columnId}
            column={column}
            illegalMove={illegalMove}
            draggingItemId={draggingItemId}
            selectedItems={selectedItems}
            onSelectItem={onSelectItem}
          />
        ))}
      </div>
    </DragDropContext>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
