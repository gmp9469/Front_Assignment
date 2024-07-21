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

      //Prohibiting items from column 1 noving to column 3
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

      const isEven = (item) => parseInt(item.id.split("-").pop()) % 2 === 0;

      //If last selected item is even, and the destination location is even set to illegal
      if (
        isEven(lastSelectedItem) &&
        selectedItems.length === 1 &&
        destination.droppableId !== source.droppableId
      ) {
        const destinationIndex = destination.index;
        const originalDestIndex =
          destinationIndex > lastSelectedIndex
            ? destinationIndex - movingItems.length
            : destinationIndex;
        let offset = 0;
        if (destinationIndex > lastSelectedIndex) {
          offset = 1;
        }
        const nextDestItem = destItems[originalDestIndex + offset];
        /*console.log(
          `New Check: Dragged item ${lastSelectedItem.id} over item ${nextDestItem ? nextDestItem.id : "none"} + ${destinationIndex} + ${lastSelectedIndex}`,
        );*/

        if (
          nextDestItem &&
          isEven(nextDestItem) &&
          originalDestIndex + 1 !== destItems.length
        ) {
          setIllegalMove(true);
          return;
        }
      } else if (isEven(lastSelectedItem)) {
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

  //If invalid destination or illegal move then it returns
  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;
      if (!destination) {
        setIllegalMove(false);
        return;
      }

      // Prohibiting items from column 1 moving to column 3
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
        (selected) => selected.itemId === result.draggableId,
      )
        ? selectedItems.map((selected) =>
            sourceItems.find((item) => item.id === selected.itemId),
          )
        : [sourceItems[source.index]];

      const lastSelectedItem = movingItems[movingItems.length - 1];
      const lastSelectedIndex = sourceItems.indexOf(lastSelectedItem);

      const isEven = (item) => parseInt(item.id.split("-").pop()) % 2 === 0;

      //doing even checks again to finalize moves
      if (
        isEven(lastSelectedItem) &&
        selectedItems.length === 1 &&
        destination.droppableId !== source.droppableId
      ) {
        const destinationIndex = destination.index;
        const originalDestIndex =
          destinationIndex > lastSelectedIndex
            ? destinationIndex - movingItems.length
            : destinationIndex;
        let offset = 0;
        if (destinationIndex > lastSelectedIndex) {
          offset = 1;
        }
        const nextDestItem = destItems[originalDestIndex + offset];

        if (
          nextDestItem &&
          isEven(nextDestItem) &&
          originalDestIndex + 1 !== destItems.length
        ) {
          setIllegalMove(true);
          return;
        }
      } else if (isEven(lastSelectedItem)) {
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

      // Perform the final update of the columns state
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

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

      setSelectedItems([]);
      setIllegalMove(false);
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
        //Cannot select items from multiple columns
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
