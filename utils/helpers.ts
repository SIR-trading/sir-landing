export default function () {
  const classLink = (classes: Array<string>) => {
    return classes.join(' ')
  }

  const formatToTwoSignificantDecimals = (value: number): number => {
    if (value === 0) return 0;

    const valueStr = value.toString();
    const decimalIndex = valueStr.indexOf('.');

    if (decimalIndex === -1) {
      // No decimal point, return the number as is
      return Number(valueStr);
    }

    // Extract the decimal part
    const decimalPart = valueStr.slice(decimalIndex + 1);

    // Find the first two non-zero digits in the decimal part
    let significantDecimals = '';
    let count = 0;

    for (const char of decimalPart) {
      if (char !== '0') {
        significantDecimals += char;
        count++;
      }
      if (count === 2) break;
    }

    // Combine the integer part with the significant decimals
    return Number(valueStr.slice(0, decimalIndex + 1) + significantDecimals);
  }

  return { classLink, formatToTwoSignificantDecimals }
}
