const getTotalPageCount = (pageSize: number, total: number) => {
  return Math.floor(total / pageSize) - 1;
};
export default { getTotalPageCount };
