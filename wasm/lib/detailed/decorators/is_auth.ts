import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator } from 'class-validator';

@ValidatorConstraint({ name: "isAuth", async: false })
export class IsAuthValidator implements ValidatorConstraintInterface {
  public validate(value: any, _args: ValidationArguments) {
    const isAuth = (what: any) => {
      return typeof what === "object" && typeof what[0] === "string" && typeof what[1] === "number";
    };

    if (Array.isArray(value))
      return value.some(isAuth);

    return isAuth(value);
  }

  public defaultMessage(_args: ValidationArguments) {
    return "The value must be a valid authority object.";
  }
}

export const IsAuth = () => {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: 'isAuth',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      validator: IsAuthValidator
    });
  };
}
