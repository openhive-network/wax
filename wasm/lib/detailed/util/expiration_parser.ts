import { WaxError } from "../../errors.js";

export const calculateExpiration = (expirationTime?: number | string | Date): Date | void => {
  // Transaction directly initialized from protobuf JSON or API. No expiration time given, so do not apply expiration time
  if(typeof expirationTime === 'undefined')
    return;

  let expiration: Date;
  if(typeof expirationTime === 'string' && expirationTime[0] === '+') {
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

    expiration = new Date(Date.now() + (num * mul));
  } else {
    expiration = new Date(expirationTime);
  }

  return expiration;
};
