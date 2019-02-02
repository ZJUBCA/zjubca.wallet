import * as ErrorTypes from './ErrorTypes';

export const ErrorCodes = {
  NO_SIGNATURE: 402,
  FORBIDDEN: 403,
  TIMED_OUT: 408,
  LOCKED: 423,
  UPGRADE_REQUIRED: 426,
  TOO_MANY_REQUESTS: 429
};

export default class Error {

  type: string;
  message: string;
  code: number;
  isError = true;

  constructor(_type: string, _message: string, _code: number = ErrorCodes.LOCKED) {
    this.type = _type;
    this.message = _message;
    this.code = _code;
  }

  static locked() {
    return new Error(ErrorTypes.LOCKED, 'The user\'s Scatter is locked. They have been notified and should unlock before continuing.');
  }

  static signatureError(_type: string, _message: string) {
    return new Error(_type, _message, ErrorCodes.NO_SIGNATURE);
  }

  static malicious(_message: string) {
    return new Error(ErrorTypes.MALICIOUS, _message, ErrorCodes.FORBIDDEN);
  }

  static rejected() {
    return new Error(ErrorTypes.REJECTED, 'The user rejected the request.', ErrorCodes.NO_SIGNATURE);
  }

  static identityMissing() {
    return this.signatureError('identity_missing', 'Identity no longer exists on the user\'s keychain');
  }

  static notKylinChain() {
    return this.signatureError('not_right_network', 'The zjubca.wallet only interacts with the kylin testnet, please check your `chainId`');
  }

  static badNetwork() {
    return this.signatureError('bad_network', 'The network you provided is malformed.');
  }

  static noKeypair() {
    return this.signatureError('no_keypair', 'The public key you provided does not exist on the user\'s keychain.');
  }

  static signatureAccountMissing() {
    return this.signatureError('account_missing', 'You are trying to sign a request with an account that isn\'t currently linked or doesn\'t exist in the user\'s Scatter');
  }

  static noNetwork() {
    return this.signatureError('no_network', 'This user does not have this network in their Scatter.');
  }

  static notSupportApi() {
    return this.signatureError('not_support_api', 'This api type is not supported by zjubca.wallet');
  }
}
