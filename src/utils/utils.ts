const getTotalPageCount = (pageSize: number, total: number) => {
  return Math.floor(total / pageSize) - 1;
};
type ObjectType =
  | 'Object'
  | 'String'
  | 'Boolean'
  | 'Number'
  | 'Symbol'
  | 'Function'
  | 'Array'
  | 'RegExp'
  | 'Error'
  | 'Date'
  | string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isObjType = (obj: any, type: ObjectType) => {
  const objType = Object.prototype.toString.call(obj);
  return `[object ${type}]` === objType;
};
export default { getTotalPageCount, isObjType };
