import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator } from 'class-validator';

@ValidatorConstraint({ name: "isNaiString", async: false })
export class IsNaiStringValidator implements ValidatorConstraintInterface {
  public validate(value: any, _args: ValidationArguments) {
    if (typeof value !== "string")
      return false;

    return /@@\d{9}/.test(value);
  }

  public defaultMessage(_args: ValidationArguments) {
    return "The value must be a valid nai asset string - start with '@@' and ends with a number.";
  }
}

export const IsNaiString = () => {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: 'isNaiString',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      validator: IsNaiStringValidator
    });
  };
}
