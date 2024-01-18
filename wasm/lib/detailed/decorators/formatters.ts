export interface IWaxFormatterDecoratorOptions {
  matchProperty?: string;
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
 * ;@WaxFormatable()
 * public prop(value: Date): string {
 *   return value.toString();
 * }
 * ```
 */
export const WaxFormatable = (options?: IWaxFormatterDecoratorOptions | string): TWaxFormatterDecorator => {
  if(typeof options === "string")
    options = {
      matchProperty: options
    };

  return (target: any, propertyKey: string, _descriptor: PropertyDescriptor): void => {
    const matchProperty = (options as IWaxFormatterDecoratorOptions)?.matchProperty ?? propertyKey;

    Reflect.defineMetadata("wax:formatter:prop", matchProperty, target, propertyKey);
  };
};
