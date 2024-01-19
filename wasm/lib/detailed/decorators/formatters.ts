export interface IWaxFormatterDecoratorOptions {
  /**
   * Property to match. If not specified defaults to the formatter method name
   *
   * @type {?string}
   */
  matchProperty?: string;

  /**
   * Optional value to match on the property.
   * Note: uses strict equality for value checking (`===`)
   *
   * @type {?any}
   */
  matchValue?: any;
}

type TWaxFormatterDecorator = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;

/**
 * When used on method, marks that this method is intended to be used for wax formatting with given property matching.
 * When no options provided, method name is used for property matching
 *
 * @param {?(IWaxFormatterDecoratorOptions | string)} options property to match or decorator options
 * @returns {TWaxFormatterDecorator}
 *
 * @example Simple wax decorator usage
 * ```typescript
 * ;@WaxFormattable()
 * public prop(value: Date): string {
 *   return value.toString();
 * }
 * ```
 */
export const WaxFormattable = (options?: IWaxFormatterDecoratorOptions | string): TWaxFormatterDecorator => {
  if(typeof options === "string")
    options = {
      matchProperty: options
    };

  return (target: any, propertyKey: string, _descriptor: PropertyDescriptor): void => {
    const matchProperty = (options as IWaxFormatterDecoratorOptions | undefined)?.matchProperty ?? propertyKey;
    const matchValue = (options as IWaxFormatterDecoratorOptions | undefined)?.matchValue as any | undefined;

    Reflect.defineMetadata("wax:formatter:prop", matchProperty, target, propertyKey);

    if(typeof matchValue !== "undefined")
      Reflect.defineMetadata("wax:formatter:propvalue", matchValue, target, propertyKey);
  };
};
