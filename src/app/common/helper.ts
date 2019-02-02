export function beautifyValue(value: string): string {
  const regex = /\d*\.?\d{0,4}/;
  const matches = value.match(regex);
  if (matches.length === 0) {
    return '0.0000';
  }
  value = matches[0];
  const dotInd = value.indexOf('.');
  if (dotInd < 0) {
    value += '.0000';
  } else if (dotInd < value.length - 1) {
    let remainingZeros = 4 - (value.length - dotInd - 1);
    while (remainingZeros > 0) {
      value += '0';
      remainingZeros--;
    }
    if (dotInd === 0) {
      value += '0' + value;
    }
  } else {
    value += '0000';
  }

  return value;
}
