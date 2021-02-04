/**
 * https://developer.apple.com/documentation/apple_pay_on_the_web/applepaymerchantcapability
 */
export interface ApplePayPaymentRequest {
  merchantCapabilities: Array<ApplePayMerchantCapability>;
  supportedNetworks: Array<supportedNetworks>; // ["visa", "masterCard", "amex", "discover"]
  countryCode: string; // 'US'
  requiredBillingContactFields?: Array<ApplePayContactField>; // phoneticName available in v3
  billingContact?: ApplePayPaymentContact;
  requiredShippingContactFields?: Array<ApplePayContactField>;
  shippingContact?: ApplePayPaymentContact;
  applicationData?: string;
  supportedCountries?: string[];
  total: ApplePayLineItem;
  lineItems?: ApplePayLineItem[];
  currencyCode: string; // "USD"
  shippingType?: ApplePayShippingType;
  shippingmethods?: ApplePayShippingMethod;
}

// https://developer.apple.com/documentation/apple_pay_on_the_web/applepaypaymentrequest/1916122-supportednetworks
/**
 * https://developer.apple.com/documentation/apple_pay_on_the_web/applepaypaymentrequest/1916122-supportednetworks
 * cartesBancaires/v4, eftpos/v4, electron/v4, elo/v5, jcb/v2, mada/v5, maestro/v4, vPay/4
 */
type supportedNetworks =
  | "amex"
  | "cartesBancaires"
  | "chinaUnionPay"
  | "discover"
  | "eftpos"
  | "electron"
  | "elo"
  | "interac"
  | "jcb"
  | "mada"
  | "maestro"
  | "masterCard"
  | "privatedLabel"
  | "visa"
  | "vPay";

type ApplePayMerchantCapability =
  | "supports3DS"
  | "supportsEMV"
  | "supportsCredit"
  | "supportsDebit";

interface ApplePayShippingMethod {
  label: string;
  detail: string;
  amount: string;
  identifier: string;
}

// A type that indicates how purchased items are to be shipped.
type ApplePayShippingType =
  | "shipping"
  | "delivery"
  | "storePickup"
  | "servicePickup";

// indicates whether a line item is final or pending.
type ApplePayLineItemType = "final" | "pending";
interface ApplePayLineItem {
  type: ApplePayLineItemType;
  label: string; // example: "Free Shipping"
  amount: string; // example: "0.00"
}

type ApplePayContactField =
  | "email"
  | "name"
  | "phone"
  | "postalAddress"
  | "phoneticName";

export interface ApplePayPaymentContact {
  phoneNumber?: string;
  emailAddress?: string;
  givenName?: string;
  familyName?: string;
  phoneticGivenName?: string; // v3
  phoneticFamilyName?: string; // v3
  addressLines?: string[];
  subLocality?: string;
  locality?: string;
  postalCode?: string;
  subAdministrativeArea?: string;
  administrativeArea?: string;
  country?: string;
  countryCode?: string;
}

interface ApplePayPaymentMethod {
  displayName?: string;
  network?: string;
  type?: ApplePayPaymentMethodType;
  paymentPass: ApplePayPaymentPass;
  billingContact?: ApplePayPaymentContact;
}

interface ApplePayPaymentPass {
  primaryAccountIdentifier: string;
  primaryAccountNumberSuffix: string;
  deviceAccountIdentifier?: string;
  deviceAccountNumberSuffix?: string;
  activationState: ApplePayPaymentPassActivationState;
}

enum ApplePayPaymentPassActivationState {
  activated,
  requiresActivation,
  activating,
  suspended,
  deactivated
}

type ApplePayPaymentMethodType = "debit" | "credit" | "prepaid" | "store";

/**
 * interface of session
 */
export type begin = () => void;
export type onvalidatemerchant = (event: ApplePayValidateMerchantEvent) => void;
export type completeMerchantValidation = (merchantSession: any) => void;

export type onshippingcontactselected = (event: {
  shippingContact: ApplePayPaymentContact;
}) => void;

export type onshippingmethodselected = (event: {
  shippingMethod: ApplePayShippingMethod;
}) => void;

export type onpaymentmethodselected = (
  event: ApplePayMethodSelectedEvent
) => void;

export type completePaymentMethodSelection = (
  update: ApplePayPaymentMethodUpdate
) => void;

export type onpaymentauthorized = (event: { payment: ApplePayPayment }) => void;

// Apple Pay Status Codes, These value exists in ApplePaySession Class
// Example ApplePaySession.STATUS_SUCCESS
export type STATUS_FAILURE = number;
export type STATUS_SUCCESS = number; // When you call completePayment with STATUS_SUCCESS, the payment sheet shows that the transaction was successful, and the sheet is dismissed
export type STATUS_INVALID_BILLING_POSTAL_ADDRESS = number; // only v1&v2
export type STATUS_INVALID_SHIPPING_CONTACT = number; // only v1&v2
export type STATUS_INVALID_SHIPPING_POSTAL_ADDRESS = number; // only v1&v2
export type STATUS_PIN_INCORRECT = number; // Cards on the China Union Pay network may require a PIN.
export type STATUS_PIN_LOCKOUT = number; // like above
export type STATUS_PIN_REQUIRED = number; // The required PIN information was not provied.

/**
 * https://developer.apple.com/documentation/apple_pay_on_the_web/applepayerror
 * ApplePayError requires Apple Pay API version 3+, and is only supported in Apple Pay JS API
 * example: new ApplePayError("shippingContactInvalid", "postalCode", "ZIP Code is invalid")
 */
type ApplePayErrorCode =
  | "shippingContactInvalid"
  | "billingContactInvalid"
  | "addressUnserviceable"
  | "unknown";
interface ApplePayError {
  code: ApplePayErrorCode; // An error code that identifies the area of the error.
  contactField: string; // The specific field on the payment sheet with the error.
  message: string; // Your custom error message to display on the payment sheet.
}

/**
 * inherits from normal javascript event object.
 */
type ApplePayValidateMerchantEvent = {
  validationURL: string; // The URL your server must use to validate itself and obtain a merchant session object.
  isTrusted: boolean; // This field tested by myself.
};

type ApplePayMethodSelectedEvent = {
  paymentMethod: ApplePayPaymentPass;
};

interface ApplePayPayment {
  token: ApplePayPaymentToken;
  billingContact?: ApplePayPaymentContact;
  shippingContact?: ApplePayPaymentContact;
}

interface ApplePayPaymentToken {
  paymentMethod: ApplePayPaymentMethod;
  transactionIdentifier?: string;
  paymentData?: object; // Json
}

// For completePayment function
interface ApplePayPaymentAuthorizationResult {
  status: number;
  errors?: ApplePayError[];
}

interface ApplePayPaymentMethodUpdate {
  newTotal: ApplePayLineItem;
  newLineItems?: ApplePayLineItem[];
}

/**
 * interface of ApplePaySession Class
 * https://developer.apple.com/documentation/apple_pay_on_the_web/apple_pay_js_api
 */

// indicates whether the device supports Apple Pay.
export type canMakePayments = () => boolean;

// indicates whether the device supports Apple Pay and whether the user has an active card in Wallet
export type canMakePaymentsWithActiveCard = (
  merchantIdentifier: string
) => Promise<boolean>;
