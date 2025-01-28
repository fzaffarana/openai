import { BigNumber } from 'bignumber.js';
import { z } from 'zod';

type Options = {
  baseType?: z.ZodTypeAny;
  decimals?: number;
};

const defaults = {
  baseType: z.number(),
  decimals: 3,
};

/**
 * Set default rounding mode to round down. Examples:
 * BigNumber(0.999).toNumber() -> 0.999
 * BigNumber(-0.999).toNumber() -> -0.999
 */
const BIG_NUMBER_DEFAULT_CONFIG = {
  DECIMAL_PLACES: 3,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
};
BigNumber.config(BIG_NUMBER_DEFAULT_CONFIG);

/**
 * Initializes a number as a BigNumber, to operate with floating nums with precision,
 * with a default rounding mode, and a default number of decimals.
 *
 * @param {string | number | BigNumber} value The value to be parsed as a BigNumber
 * @param {Options} options The options to be used when parsing the value
 * @param {number} options.decimals Default: 3 - The number of decimals to be used when parsing the value
 * @returns {BigNumber} A BigNumber with the parsed value
 */
export const float = (value: string | number | BigNumber, options?: Options): BigNumber => {
  const { decimals } = { ...defaults, ...options };
  const BN = BigNumber.clone({
    ...BIG_NUMBER_DEFAULT_CONFIG,
    DECIMAL_PLACES: decimals,
  });

  // Override toNumber to use the default number of decimals
  const originalToNumber = BN.prototype.toNumber;
  BN.prototype.toNumber = function () {
    return originalToNumber.call(this.decimalPlaces(decimals));
  };

  return new BN(value, 10);
};
