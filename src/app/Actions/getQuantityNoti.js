export const addContract = (addCon) => {
  return {
    type: "ADD_CONTRACT",
    payload: addCon,
  };
};

export const editContract = (editCon) => {
  return {
    type: "EDIT_CONTRACT",
    payload: editCon,
  };
};
