import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator } from 'class-validator';

@ValidatorConstraint({ name: "isNumberOrNumberString", async: false })
export class IsNumberOrStringNumberValidator implements ValidatorConstraintInterface {
  public validate(value: any, _args: ValidationArguments) {
    return typeof value === 'number' || (typeof value === 'string' && !Number.isNaN(Number.parseFloat(value)));
  }

  public defaultMessage(_args: ValidationArguments) {
    return "The value must be a valid number or number string.";
  }
}

export const isNumberOrStringNumber = () => {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: 'isNumberOrNumberString',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      validator: IsNumberOrStringNumberValidator
    });
  };
}
