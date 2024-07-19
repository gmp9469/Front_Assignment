export const getItems = (count, columnId) =>
  Array.from({ length: count }, (v, k) => ({
    id: `${columnId}-item-${k}`,
    content: `item ${k}`,
  }));

export const initialColumns = {
  column1: {
    name: "Column 1",
    items: getItems(5, "column1"),
  },
  column2: {
    name: "Column 2",
    items: getItems(5, "column2"),
  },
  column3: {
    name: "Column 3",
    items: getItems(5, "column3"),
  },
  column4: {
    name: "Column 4",
    items: getItems(5, "column4"),
  },
};

export const isEven = (item) => parseInt(item.id.split("-").pop()) % 2 === 0;
