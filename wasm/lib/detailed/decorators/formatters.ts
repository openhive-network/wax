export interface IWaxFormatterDecoratorOptions {
  matchProperty?: string;
}

type TWaxFormatterDecorator = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;

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
