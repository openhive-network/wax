import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator } from 'class-validator';

@ValidatorConstraint({ name: "isPublicKey", async: false })
export class IsPublicKeyValidator implements ValidatorConstraintInterface {
  public validate(value: any, _args: ValidationArguments) {
    if (typeof value !== "string")
      return false;

    if (!value.startsWith("STM") && !value.startsWith("TST"))
      return false;

    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;

    return base58Regex.test(value.slice(3));
  }

  public defaultMessage(_args: ValidationArguments) {
    return "The value must be a valid public key - start with 'STM' and be base58 encoded.";
  }
}

export const IsPublicKey = () => {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: 'isPublicKey',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      validator: IsPublicKeyValidator,
    });
  };
}
