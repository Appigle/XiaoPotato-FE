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

let currentCount = 0;
const untilExpected = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expected: any,
  cb: () => void | undefined,
  maxCount: number = 20,
) => {
  if (cb && isObjType(cb, 'Function')) {
    let newValue = value;
    if (!!value && isObjType(value, 'Function')) {
      newValue = value();
    }
    if (newValue === expected) {
      cb();
    } else {
      if (currentCount > maxCount) {
        return;
      }
      setTimeout(() => {
        currentCount += 1;
        untilExpected(value, expected, cb, maxCount);
      }, 1100);
    }
  } else {
    throw new Error('Callback function is not a function');
  }
};
export default { getTotalPageCount, isObjType, untilExpected };
