import React from "react";
import ReactDOM from "react-dom";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./components/Column";
import dragDrop from "./hooks/dragDrop";
import "./styles.css";

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

  const renderGhostItems = () => {
    if (
      !draggingItemId ||
      !selectedItems.some((selected) => selected.itemId === draggingItemId)
    ) {
      return null;
    }

    const ghostItems = selectedItems.map((selected) => {
      const column = columns[selected.columnId];
      return column.items.find((item) => item.id === selected.itemId);
    });

    return (
      <div className="ghostContainer">
        {ghostItems.map((item) => (
          <div key={item.id} className="ghostItem">
            {item.content}
          </div>
        ))}
      </div>
    );
  };

  return (
    <DragDropContext
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
    >
      <div className="container">
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
      {renderGhostItems()}
    </DragDropContext>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);

export default App;
