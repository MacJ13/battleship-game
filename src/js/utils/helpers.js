const concatNumbers = (pos) => {
  const { posA, posB } = pos;

  const str = "" + posA + posB;

  return Number(str);
};

export const binarySearch = function (arr, index) {
  let left = 0;
  let right = arr.length - 1;
  let mid;

  const indexNumber = concatNumbers(index);

  while (right >= left) {
    mid = left + Math.floor((right - left) / 2);

    // if the element is present at the middle itsef

    const midNumber = concatNumbers(arr[mid]);
    if (midNumber === indexNumber) return mid;

    // if element is smalled then mid, then
    // it can only be present in the left subaaray
    if (midNumber > indexNumber) right = mid - 1;
    // otherwise the element can only be present
    // in the right subarray
    else left = mid + 1;
  }

  return -1;
};

export const getRandomNumber = (max) => {
  return Math.floor(Math.random() * max);
};
