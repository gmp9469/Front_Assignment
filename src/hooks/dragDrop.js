import { useState, useCallback, useMemo } from "react";
import { initialColumns, isEven } from "../utils/utils";

const COLUMN_1 = "column1";
const COLUMN_3 = "column3";

const dragDrop = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [selectedItems, setSelectedItems] = useState([]);
  const [draggingItemId, setDraggingItemId] = useState(null);
  const [illegalMove, setIllegalMove] = useState(false);

  const onDragStart = useCallback(
    (start) => {
      setDraggingItemId(start.draggableId);
      if (
        !selectedItems.some((selected) => selected.itemId === start.draggableId)
      ) {
        setSelectedItems([
          { itemId: start.draggableId, columnId: start.source.droppableId },
        ]);
      }
    },
    [selectedItems],
  );

  const onDragUpdate = useCallback(
    (update) => {
      const { source, destination } = update;
      if (!destination) {
        setIllegalMove(false);
        return;
      }

      if (
        source.droppableId === COLUMN_1 &&
        destination.droppableId === COLUMN_3
      ) {
        setIllegalMove(true);
        return;
      }

      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);

      const movingItems = selectedItems.some(
        (selected) => selected.itemId === update.draggableId,
      )
        ? selectedItems.map((selected) =>
            sourceItems.find((item) => item.id === selected.itemId),
          )
        : [sourceItems[source.index]];

      const lastSelectedItem = movingItems[movingItems.length - 1];
      const lastSelectedIndex = sourceItems.indexOf(lastSelectedItem);

      if (isEven(lastSelectedItem)) {
        const destinationIndex = destination.index;
        const originalDestIndex =
          destinationIndex > lastSelectedIndex
            ? destinationIndex - movingItems.length
            : destinationIndex;
        const destinationItem =
          destination.droppableId === source.droppableId
            ? sourceItems[originalDestIndex]
            : destItems[originalDestIndex];

        if (
          destinationItem &&
          isEven(destinationItem) &&
          originalDestIndex !== destItems.length - 1
        ) {
          setIllegalMove(true);
          return;
        }
      }

      setIllegalMove(false);
    },
    [columns, selectedItems],
  );

  const onDragEnd = useCallback(
    (result) => {
      setDraggingItemId(null);
      setIllegalMove(false);
      const { source, destination } = result;

      if (!destination) return;

      if (
        source.droppableId === COLUMN_1 &&
        destination.droppableId === COLUMN_3
      ) {
        return;
      }

      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);

      const movingItems = selectedItems.some(
        (selected) => selected.itemId === result.draggableId,
      )
        ? selectedItems.map((selected) =>
            sourceItems.find((item) => item.id === selected.itemId),
          )
        : [sourceItems[source.index]];

      if (movingItems.some((item) => !sourceItems.includes(item))) {
        setSelectedItems([]);
        return;
      }

      const lastSelectedItem = movingItems[movingItems.length - 1];
      const lastSelectedIndex = sourceItems.indexOf(lastSelectedItem);

      if (isEven(lastSelectedItem)) {
        const destinationIndex = destination.index;
        const originalDestIndex =
          destinationIndex > lastSelectedIndex
            ? destinationIndex - movingItems.length
            : destinationIndex;
        const destinationItem =
          destination.droppableId === source.droppableId
            ? sourceItems[originalDestIndex]
            : destItems[originalDestIndex];

        if (
          destinationItem &&
          isEven(destinationItem) &&
          originalDestIndex !== destItems.length - 1
        ) {
          setSelectedItems([]);
          return;
        }
      }

      movingItems.forEach((item) => {
        const index = sourceItems.indexOf(item);
        if (index > -1) {
          sourceItems.splice(index, 1);
        }
      });

      if (source.droppableId === destination.droppableId) {
        movingItems.forEach((item, i) => {
          sourceItems.splice(destination.index + i, 0, item);
        });
        setColumns({
          ...columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
        });
      } else {
        movingItems.forEach((item, i) => {
          destItems.splice(destination.index + i, 0, item);
        });
        setColumns({
          ...columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
          [destination.droppableId]: {
            ...destColumn,
            items: destItems,
          },
        });
      }
      setSelectedItems([]);
    },
    [columns, selectedItems],
  );

  const onSelectItem = useCallback((itemId, columnId) => {
    setSelectedItems((prevSelectedItems) => {
      const isSelected = prevSelectedItems.some(
        (selected) => selected.itemId === itemId,
      );
      if (isSelected) {
        return prevSelectedItems.filter(
          (selected) => selected.itemId !== itemId,
        );
      } else {
        if (
          prevSelectedItems.length > 0 &&
          prevSelectedItems[0].columnId !== columnId
        ) {
          return [{ itemId, columnId }];
        }
        return [...prevSelectedItems, { itemId, columnId }];
      }
    });
  }, []);

  return {
    columns,
    draggingItemId,
    illegalMove,
    selectedItems,
    onDragStart,
    onDragUpdate,
    onDragEnd,
    onSelectItem,
  };
};

export default dragDrop;
