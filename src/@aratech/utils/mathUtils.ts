export class MathUtils {
  static round2(value: number, digits?: number) {
    if (!digits || digits == 0) return Math.round(value);
    else return Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits);
  }

  static multiplicationArray(...value: number[]) {
    let result = 1;
    value.forEach(value => {
      result = MathUtils.multiplication(result, value);
    });
  }

  static multiplication(value1: number, value2: number) {
    const countDecimals1 = MathUtils.countDecimals(value1);
    const countDecimals2 = MathUtils.countDecimals(value2);
    const divNumber1 = Math.pow(10, countDecimals1);
    const divNumber2 = Math.pow(10, countDecimals2);
    return (
      (value1 * divNumber1 * (value2 * divNumber2)) / (divNumber1 * divNumber2)
    );
  }

  static countDecimals(value: number) {
    if (Math.floor(value) === value) return 0;
    return value.toString().split('.')[1].length || 0;
  }
}
