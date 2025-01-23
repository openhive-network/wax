import { WaxError } from "../errors.js";

export const dateFromString = (dateTimeString: string): Date => {
  if (dateTimeString.endsWith('Z'))
    return new Date(dateTimeString);
  else
    return new Date(`${dateTimeString}Z`);
};

export const calculateExpiration = (expirationTime: number | string | Date, referenceTime?: Date): Date => {
  let expiration: Date;
  if(typeof expirationTime === 'string') {
    if (expirationTime[0] !== "+")
      return dateFromString(expirationTime);

    let mul = 1000;

    switch(expirationTime[expirationTime.length - 1])
    {
      case 'h':
        mul *= 60;
      case 'm':
        mul *= 60;
    }

    const num = Number.parseInt((/\d+/).exec(expirationTime)?.[0] as string);
    if(Number.isNaN(num))
      throw new WaxError("Invalid expiration time offset");

    if (referenceTime === undefined)
      referenceTime = new Date(Date.now());

    expiration = new Date(referenceTime.getTime() + (num * mul));
  } else {
    expiration = new Date(expirationTime);
  }

  return expiration;
};
