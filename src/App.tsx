import "./styles.css";
import eruda from "eruda";

eruda.init();

/**
 * Apple Pay Session
 * https://developer.apple.com/documentation/apple_pay_on_the_web/applepaysession
 */

/**
 * Button Type: Plain/Buy/Book/Check Out/Donate/Set Up/Subscribe
 */
const checkApplyPayAvailable = () => {
  return window.ApplePaySession && window.ApplePaySession.canMakePayments();
};

function errorFromDict(dict) {
  if (dict == null) return dict;
  var re = [];
  for (var i = 0; i < dict.length; i++) {
    var e = dict[i];
    re.push(new ApplePayError(e["code"], e["contactField"], e["message"]));
  }
  return re;
}

const merchantId = "merchant.com.apdemo"; // hardCode from apple pay website
const version = 3;
let shippingContactUpdate = null;
let paymentAuthorizationResult: any = null;
let settings: any = {};

// Local variables for this page
let onshippingcontactselectedCount = 1;
let onpaymentauthorizedCount = 1;

export default function App() {
  const createApplyPaySession = () => {
    // Reset counters
    onshippingcontactselectedCount = 0;
    onpaymentauthorizedCount = 0;

    /**
     * Creating an Apply Pay Session
     */
    const ApplyPayPaymentRequest = {
      countryCode: "CN",
      currencyCode: "CNY",
      supportedNetworks: ["visa", "masterCard", "chinaUnionPay", "jcb"],
      merchantCapabilities: ["supports3DS", "supportsDebit", "supportsCredit"],
      shippingMethods: [
        {
          label: "Free Standard Shipping",
          amount: "0.00",
          detail: "Arrives in 5-7 days",
          identifier: "standardShipping"
        },
        {
          label: "Express Shipping",
          amount: "1.00",
          detail: "Arrives in 2-3 days",
          identifier: "expressShipping"
        }
      ],
      shippingType: "shipping",
      requiredBillingContactFields: ["postalAddress", "name", "phoneticName"],
      requiredShippingContactFields: [
        "postalAddress",
        "name",
        "phone",
        "email"
      ],
      lineItems: [
        {
          label: "SubTotal",
          amount: "0.01"
        },
        {
          label: "Shipping",
          amount: "0.01"
        }
      ],
      total: {
        label: "iHber LLC.",
        amount: "0.02",
        type: "final"
      }
    };
    const session: ApplePaySession = new (window as any).ApplePaySession(
      version,
      ApplyPayPaymentRequest
    );
    (window as any).applypaysession = session;

    /**
     * Getting Merchant Validation
     * begin: Beings the merchant validatoin process.
     * onvalidatemerchant: An event handler the system calls when it displays the payment sheet.
     * completeMerchantValidation: Completes the validation for a merchant session.
     * (event: ApplePayValidateMerchantEvent): An event object that contains the validation URL
     */
    session.onvalidatemerchant = (
      event: ApplePayJS.ApplePayValidateMerchantEvent
    ) => {
      // https://cn-apple-pay-gateway-sh-pod1.apple.com/paymentservices/startSession
      const validateURL = event.validationURL;
      setTimeout(() => {
        alert(validateURL);
        session.completeMerchantValidation({
          statusMessage: "Demo Session",
          statusCode: ApplePaySession.STATUS_SUCCESS
        });
      }, 1000);
    };

    /**
     * Handling Payment Method Updates
     * onpaymentmethodselected: An event handler that is called when a new payment method is selected.
     * completePaymentMethodSelection:
     */

    /**
     * Handling Shipping Contact Updates
     */
    session.onshippingcontactselected = function onshippingcontactselected(
      event: any
    ) {
      onshippingcontactselectedCount += 1;
      const shippingContact = event.shippingContact;
      alert(
        "Shipping contact was selected: \n" +
          JSON.stringify(shippingContact, null, 2) +
          "\n"
      );

      // make sure we use new items if it exists
      // const update = {
      //   newTotal: requ
      // }

      // update shippingContactSelection
      // session.completeShippingContactSelection(update)
    };

    /**
     * Handling Shipping Method Updates
     */

    // The onshippingmethodselected function must respond by calling completeShippingMethodSelection before the 30 second timeout,
    session.onshippingmethodselected = function onshippingmethodselected(
      event: any
    ) {
      const shippingMethod = event.shippingMethod;
      alert(
        "Shipping method was selected: " +
          JSON.stringify(shippingMethod, null, 2) +
          "\n"
      );

      // make sure we use new items if it exists
      // let update = {
      //   newTotal: {},
      //   newLineItems: {}
      // };

      //session.completeShippingMethodSelection(update)
    };

    /**
     * Handling Payment Authorization
     */
    // An event handler that is called when the user has authorized the Apple Pay payment with Touch ID, Face ID or passcode.
    // The onpaymentauthorized function must complete the payment and respond by calling completePayment before the 30 second timeout, after which a message appears stating that the payment could not be completed.
    session.onpaymentauthorized = function onpaymentauthorized(event: any) {
      onpaymentauthorizedCount += 1;
      const payment = event.payment;
      const currentPaymentToken = payment.token.paymentData; // JSON

      alert(
        "Shipping Contact:\n" +
          JSON.stringify(payment.shippingContact, null, 2) +
          "\n"
      );

      alert(
        "Billing Contact:\n" +
          JSON.stringify(payment.billingContact, null, 2) +
          "\n"
      );

      alert("Payment Token:\n" + JSON.stringify(payment.token, null, 2) + "\n");

      window.setTimeout(() => {
        settings["failuresBeforeSuccess"] = 1;
        let update = {
          status: (window as any).ApplePaySession.STATUS_SUCCESS,
          errors: null
        };
        if (
          settings["failuresBeforeSuccess"] == null ||
          settings["failuresBeforeSuccess"] >= onpaymentauthorizedCount
        ) {
          if (paymentAuthorizationResult != null) {
            if (paymentAuthorizationResult["status"] != null) {
              update["status"] = paymentAuthorizationResult["status"];
            }

            if (paymentAuthorizationResult["errros"] != null) {
              update["errors"] = errorFromDict(
                paymentAuthorizationResult["errors"]
              );
            }
          }
        }

        session.completePayment(update);
        alert(
          "completePayment executed:" + JSON.stringify(update, null, 2) + "\n"
        );
      }, 2000);
    };

    session.onpaymentmethodselected = function onpaymentmethodselected(
      event: any
    ) {
      const paymentMethod = event.paymentMethod;
      alert(
        "Payment method was selected: " +
          JSON.stringify(paymentMethod, null, 2) +
          "\n"
      );

      // make sure we use new items if it exists
      // let update = {
      //   newTotal: {},
      //   newLineItems:{}
      // }

      // session.completePaymentMethodSelection(update)
    };

    /**
     * Ending the Session
     */
    session.oncancel = function oncancel() {
      alert("Payment cancelled.");
    };

    /**
     * Start communicate with Apple Pay Server
     */
    console.log("Start");
    session.begin(); // calling begin method to show the payment sheet.
  };

  const isApplyPayAvailale = !!checkApplyPayAvailable();
  return (
    <div className="App">
      <h1>Hello Apple Pay</h1>
      {`Is Apply Pay available?: ${isApplyPayAvailale}`}
      <br />
      <br />
      {isApplyPayAvailale && (
        <div
          className="apple-pay-button apple-pay-button-black"
          onClick={createApplyPaySession}
        ></div>
      )}
    </div>
  );
}
