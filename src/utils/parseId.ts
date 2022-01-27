export const parseId = (id: any) => {
  try {
    if (!Number.isNaN(id)) {
      return parseInt(id);
    }
    return false;
  } catch (error) {
    return false;
  }
};
