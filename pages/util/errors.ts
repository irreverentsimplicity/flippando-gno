import { TM2Error } from '@gnolang/tm2-js-client';

import {
  FaucetError,
  InvalidTokenError,
  UserFundedError
} from '../types/errors';

// ErrorTransform takes in a TM2 error and converts it into
// a type of expected error if possible
export const ErrorTransform = (err: TM2Error): Error => {
  const parts = err.log?.match(/VM call panic: (.*)$/m);
  if (parts === null || typeof parts === 'undefined') {
    return err;
  }

  const panic = parts[1];

  for (const [k, v] of Object.entries(msgTypes)) {
    if (k.split(',').every((val) => panic.includes(val))) {
      return new v(panic, err);
    }
  }

  // No specific error found, panic with generic PanicError.
  return new PanicError(panic, err);
};

export class PanicError extends Error {
  public err: TM2Error;

  constructor(message: string, err: TM2Error) {
    super('VM call panic: ' + message);
    this.err = err;
  }
}

export class GameNotFoundError extends PanicError {
  constructor(msg: string, tm2: TM2Error) {
    super(msg, tm2);
  }
}

export class GameFinishedError extends PanicError {
  constructor(msg: string, tm2: TM2Error) {
    super(msg, tm2);
  }
}

export class PlayerNotFoundError extends PanicError {
  constructor(msg: string, tm2: TM2Error) {
    super(msg, tm2);
  }
}

export const constructFaucetError = (message: string): FaucetError => {
  switch (message.trim()) {
    case 'User is funded':
      return new UserFundedError();
    case 'Invalid faucet token':
      return new InvalidTokenError();
    default:
      return new FaucetError(message);
  }
};


const msgTypes: { [messageContains: string]: typeof PanicError } = {
  'game not found': GameNotFoundError,
  'game is already finished': GameFinishedError,
  'player not found': PlayerNotFoundError,
};