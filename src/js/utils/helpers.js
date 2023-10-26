const concatNumbers = (pos) => {
  const { posA, posB } = pos;

  const str = "" + posA + posB;

  return Number(str);
};
