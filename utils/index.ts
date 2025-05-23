
export const formatToTwoSignificantDecimals = (value: number): number => {
  if (value === 0) return 0;

  const valueStr = value.toString();
  const decimalIndex = valueStr.indexOf('.');

  if (decimalIndex === -1) {
    // No decimal point, return the number as is
    return Number(valueStr);
  }

  // Extract the decimal part
  const decimalPart = valueStr.slice(decimalIndex + 1);

  let count = 0;
  let end = 0;

  for (let i = 0; i < decimalPart.length; i++) {
    if (decimalPart[i] !== '0') {
      count++
      if (i + 1 < decimalPart.length && decimalPart[i + 1] === '0') {
        end = i + 1;
        break;
      }
      end = i;
    }
    if (count === 2) {
      break;
    }
  }

  console.log({
    valueStr, decimalPart, decimalIndex, end, count, decimals: decimalPart.slice(0, end + 1)
  })
  // Combine the integer part with the significant decimals
  return Number(valueStr.slice(0, decimalIndex + 1) + decimalPart.slice(0, end + 1));
}
