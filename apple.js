// JSON object variables
var request = null;
var version = null;
var merchantId = null;
var shippingContactUpdate = null;
var paymentAuthorizationResult = null;
var settings = {};

// Local variables for this page
var onshippingcontactselectedCount = 1;
var onpaymentauthorizedCount = 1;

var shippingContactUpdate = null;

// Only show buttons if this browser/device can make Apple Pay payments
function checkApplePayCapability() {
  if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
    $(".unsupportedBrowserMessage").css("display", "none");
    $(".applePayButton").css("display", "block");
    console.log(
      "Startup Check: Device is capable of making Apple Pay payments"
    );
  }
}

function checkAugmentedRealityCapability() {
  const a = document.createElement("a");
  if (a.relList.supports("ar")) {
    console.log("Device supports AR Quick Look");
    return;
  } else {
    $(".image-model").css("opacity", "0.5");
    $(".image-model").css("cursor", "help");
    console.log("Startup Check: Device does not support AR Quick Look");
    $('a[rel="ar"]').click(function (e) {
      e.preventDefault();
      alert(
        "Your device doesn't support AR Quick Look.\nVisit this page from an iOS device to get the full experience."
      );
    });
  }
}

function checkFeatureSupport() {
  checkApplePayCapability();
  checkAugmentedRealityCapability();
}

var presetConfigs = {
  ApplePayPaymentRequest: {
    A: {
      countryCode: "US",
      currencyCode: "USD",
      merchantCapabilities: ["supports3DS"],
      supportedNetworks: ["visa", "masterCard", "amex", "discover"],
      total: {
        label: "Demo (Card is not charged)",
        type: "final",
        amount: "1.99"
      }
    },
    B: {
      countryCode: "US",
      currencyCode: "USD",
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
      supportedNetworks: ["visa", "masterCard", "amex", "discover"],
      requiredBillingContactFields: ["postalAddress", "name", "phoneticName"],
      requiredShippingContactFields: [
        "postalAddress",
        "name",
        "phone",
        "email"
      ],
      lineItems: [
        {
          label: "Sales Tax",
          amount: "0.00"
        },
        {
          label: "Shipping",
          amount: "0.00"
        }
      ],
      total: {
        label: "Demo (Card is not charged)",
        amount: "1.99",
        type: "final"
      }
    }
  },
  ApplePayShippingContactUpdate: {
    A: {},
    B: {
      newTotal: {
        label: "Demo",
        amount: "35.00"
      },
      newLineItems: [
        {
          label: "Subtotal",
          amount: "17.75"
        },
        {
          label: "Sales Tax",
          amount: "2.25"
        },
        {
          label: "Shipping",
          amount: "10.00"
        }
      ]
    },
    C: {
      errors: [
        {
          code: "shippingContactInvalid",
          contactField: "postalCode",
          message: "Invalid postal code"
        }
      ],
      newLineItems: [
        {
          label: "Subtotal",
          amount: "0.90"
        },
        {
          label: "Sales Tax",
          amount: "0.09"
        },
        {
          label: "Shipping",
          amount: "1.00"
        }
      ],
      newShippingMethods: [
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
        },
        {
          label: "Overnight Shipping",
          amount: "2.00",
          detail: "Arrives tomorrow",
          identifier: "overnightShipping"
        }
      ],
      newTotal: {
        label: "Demo (Card is not charged)",
        amount: "1.99"
      }
    }
  },
  ApplePayPaymentAuthorizationResult: {
    A: {
      status: 0
    },
    B: {
      status: 1,
      errors: [
        {
          code: "billingContactInvalid",
          contactField: "postalAddress",
          message: "Invalid name"
        },
        {
          code: "shippingContactInvalid",
          contactField: "emailAddress",
          message: "Invalid email"
        }
      ]
    }
  }
};

var paymentRequestSchema = {
  $id: "https://developer.apple.com/schemas/ApplePayPaymentRequest.json",
  type: "object",
  properties: {
    countryCode: {
      $id: "/properties/countryCode",
      type: "string",
      title: "The Country Code ",
      description: "The merchant’s two-letter ISO 3166 country code.",
      pattern: "^[A-Z]{2}$",
      default: "",
      examples: ["US"],
      enum: [
        "AE",
        "AT",
        "AU",
        "BE",
        "BG",
        "BR",
        "CA",
        "CH",
        "CN",
        "CY",
        "CZ",
        "DK",
        "EE",
        "ES",
        "FI",
        "FR",
        "GB",
        "GG",
        "GR",
        "HK",
        "HR",
        "HU",
        "IE",
        "IM",
        "IS",
        "IT",
        "JE",
        "JP",
        "KZ",
        "LI",
        "LT",
        "LU",
        "LV",
        "MC",
        "MT",
        "NL",
        "NO",
        "NZ",
        "PL",
        "PT",
        "RO",
        "RU",
        "SA",
        "SE",
        "SG",
        "SI",
        "SK",
        "SM",
        "TW",
        "UA",
        "US",
        "VA"
      ]
    },
    currencyCode: {
      $id: "/properties/currencyCode",
      type: "string",
      title: "The Currency Code",
      description: "The three-letter ISO 4217 currency code for the payment.",
      pattern: "^[A-Z]{3}$",
      default: "",
      examples: ["USD"],
      enum: [
        "AED",
        "AFN",
        "ALL",
        "AMD",
        "ANG",
        "AOA",
        "ARS",
        "AUD",
        "AWG",
        "AZN",
        "BAM",
        "BBD",
        "BDT",
        "BGN",
        "BHD",
        "BIF",
        "BMD",
        "BND",
        "BOB",
        "BRL",
        "BSD",
        "BTN",
        "BWP",
        "BYN",
        "BZD",
        "CAD",
        "CDF",
        "CHF",
        "CLP",
        "CNY",
        "COP",
        "CRC",
        "CUC",
        "CUP",
        "CVE",
        "CZK",
        "DJF",
        "DKK",
        "DOP",
        "DZD",
        "EGP",
        "ERN",
        "ETB",
        "EUR",
        "FJD",
        "FKP",
        "GBP",
        "GEL",
        "GGP",
        "GHS",
        "GIP",
        "GMD",
        "GNF",
        "GTQ",
        "GYD",
        "HKD",
        "HNL",
        "HRK",
        "HTG",
        "HUF",
        "IDR",
        "ILS",
        "IMP",
        "INR",
        "IQD",
        "IRR",
        "ISK",
        "JEP",
        "JMD",
        "JOD",
        "JPY",
        "KES",
        "KGS",
        "KHR",
        "KMF",
        "KPW",
        "KRW",
        "KWD",
        "KYD",
        "KZT",
        "LAK",
        "LBP",
        "LKR",
        "LRD",
        "LSL",
        "LYD",
        "MAD",
        "MDL",
        "MGA",
        "MKD",
        "MMK",
        "MNT",
        "MOP",
        "MRU",
        "MUR",
        "MVR",
        "MWK",
        "MXN",
        "MYR",
        "MZN",
        "NAD",
        "NGN",
        "NIO",
        "NOK",
        "NPR",
        "NZD",
        "OMR",
        "PAB",
        "PEN",
        "PGK",
        "PHP",
        "PKR",
        "PLN",
        "PYG",
        "QAR",
        "RON",
        "RSD",
        "RUB",
        "RWF",
        "SAR",
        "SBD",
        "SCR",
        "SDG",
        "SEK",
        "SGD",
        "SHP",
        "SLL",
        "SOS",
        "SRD",
        "STN",
        "SVC",
        "SYP",
        "SZL",
        "THB",
        "TJS",
        "TMT",
        "TND",
        "TOP",
        "TRY",
        "TTD",
        "TVD",
        "TWD",
        "TZS",
        "UAH",
        "UGX",
        "USD",
        "UYU",
        "UZS",
        "VEF",
        "VND",
        "VUV",
        "WST",
        "XAF",
        "XCD",
        "XDR",
        "XOF",
        "XPF",
        "YER",
        "ZAR",
        "ZMW",
        "ZWD"
      ]
    },
    supportedNetworks: {
      $id: "/properties/supportedNetworks",
      type: "array",
      title: "Payment Network",
      description: "The payment networks supported by the merchant.",
      uniqueItems: true,
      minItems: 1,
      items: {
        $id: "/properties/supportedNetworks/items",
        type: "string",
        default: "",
        examples: ["visa"],
        enum: [
          "amex",
          "cartesBancaires",
          "chinaUnionPay",
          "discover",
          "eftpos",
          "electron",
          "elo",
          "interac",
          "jcb",
          "mada",
          "maestro",
          "masterCard",
          "privateLabel",
          "visa",
          "vpay"
        ]
      }
    },
    merchantCapabilities: {
      $id: "/properties/merchantCapabilities",
      type: "array",
      title: "Capabilities",
      description: "The payment capabilities supported by the merchant.",
      uniqueItems: true,
      minItems: 1,
      items: {
        $id: "/properties/merchantCapabilities/items",
        type: "string",
        description:
          "supportsEMV only if you support China Union Pay transactions; supports3DS in all other cases.",

        title: "merchantCapabilities",
        default: "supports3DS",
        examples: ["supports3DS", "supportsCredit"],
        enum: ["supports3DS", "supportsCredit", "supportsDebit", "supportsEMV"]
      },
      oneOf: [
        {
          contains: {
            type: "string",
            pattern: "supports3DS"
          }
        },
        {
          contains: {
            type: "string",
            pattern: "supportsEMV"
          }
        }
      ]
    },
    requiredBillingContactFields: {
      $id: "/properties/requiredBillingContactFields",
      type: "array",
      title: "requiredBillingContactFields",
      description:
        "The fields of billing information that you require from the user to process the transaction.",
      items: {
        $id: "/properties/requiredBillingContactFields/items",
        type: "string",
        default: "",
        examples: ["postalAddress"],
        enum: ["postalAddress", "name", "phoneticName"]
      }
    },
    requiredShippingContactFields: {
      $id: "/properties/requiredShippingContactFields",
      type: "array",
      title: "requiredShippingContactFields",
      description:
        "The fields of shipping information that you require from the user to fulfill the order.",
      items: {
        $id: "/properties/requiredShippingContactFields/items",
        type: "string",
        default: "",
        uniqueItems: true,
        minItems: 1,
        examples: ["postalAddress"],
        enum: ["postalAddress", "name", "phoneticName", "phone", "email"]
      }
    },
    supportedCountries: {
      $id: "/properties/supportedCountries",
      type: "array",
      title: "supportedCountries",
      description:
        "A list of two-character country codes you provide, used to limit payments to cards from specific countries.",
      items: {
        $id: "/properties/supportedCountries/items",
        type: "string",
        default: "",
        examples: ["US"],
        enum: [
          "AE",
          "AT",
          "AU",
          "BE",
          "BR",
          "CA",
          "CH",
          "CN",
          "CZ",
          "DK",
          "ES",
          "FI",
          "FR",
          "GB",
          "GG",
          "GR",
          "HK",
          "HU",
          "IE",
          "IM",
          "IS",
          "IT",
          "JE",
          "JP",
          "KZ",
          "LU",
          "MC",
          "NL",
          "NO",
          "NZ",
          "PL",
          "RU",
          "SA",
          "SE",
          "SG",
          "SM",
          "TW",
          "UA",
          "US",
          "VA"
        ]
      }
    },
    shippingMethods: {
      $id: "/properties/shippingMethods",
      type: "array",
      title: "shippingMethods",
      description: "A list of available methods for shipping physical goods.",
      items: {
        $id: "/properties/shippingMethods/items",
        type: "object",
        properties: {
          label: {
            $id: "/properties/shippingMethods/items/properties/label",
            type: "string",
            title: "label",
            description: "A short description of the shipping method.",
            default: "",
            examples: ["Free Standard Shipping"]
          },
          amount: {
            $id: "/properties/shippingMethods/items/properties/amount",
            type: "string",
            title: "amount",
            description:
              "The nonnegative cost associated with this shipping method.",
            default: "",
            examples: ["0.00"],
            pattern: "[0-9]+(\\.[0-9][0-9])?"
          },
          detail: {
            $id: "/properties/shippingMethods/items/properties/detail",
            type: "string",
            title: "detail",
            description: "Additional description of the shipping method.",
            default: "",
            examples: ["Arrives in 5-7 days"]
          },
          identifier: {
            $id: "/properties/shippingMethods/items/properties/identifier",
            type: "string",
            title: "identifier",
            description:
              "A client-defined value used to identify this shipping method.",
            default: "",
            examples: ["standardShipping"]
          }
        },
        required: ["label", "amount", "detail", "identifier"]
      }
    },
    shippingType: {
      $id: "/properties/shippingType",
      type: "string",
      title: "shippingType",
      description:
        "An optional value that indicates how purchased items are to be delivered.",
      default: "",
      examples: ["delivery"],
      enum: ["shipping", "delivery", "storePickup", "servicePickup"]
    },
    lineItems: {
      $id: "/properties/lineItems",
      type: "array",
      items: {
        $id: "/properties/lineItems/items",
        type: "object",
        properties: {
          label: {
            $id: "/properties/lineItems/items/properties/label",
            type: "string",
            title: "Label",
            description: "A short, localized description of the line item.",
            default: "",
            examples: ["Sales Tax"]
          },
          amount: {
            $id: "/properties/lineItems/items/properties/amount",
            type: "string",
            title: "Amount",
            description: "The monetary amount of the line item.",
            default: "",
            examples: ["2.25"],
            pattern: "-?[0-9]+(\\.[0-9][0-9])?"
          },
          type: {
            $id: "/properties/lineItems/items/properties/type",
            type: "string",
            title: "type",
            description:
              "A value that indicates whether the line item is final or pending.",
            default: "final",
            examples: ["final"],
            enum: ["final", "pending"]
          }
        },
        required: ["label", "amount"]
      }
    },
    total: {
      $id: "/properties/total",
      type: "object",
      properties: {
        label: {
          $id: "/properties/total/properties/label",
          type: "string",
          title: "Label",
          description:
            "Provide a business name for the label field. Use the same business name people will see when they look for the charge on their bank or credit card statement. For example, COMPANY, INC.",
          default: "",
          examples: ["Demo (Card is not charged)"]
        },
        type: {
          $id: "/properties/total/properties/type",
          type: "string",
          title: "Type",
          description:
            "A value that indicates whether the line item is final or pending.",
          default: "final"
        },
        amount: {
          $id: "/properties/total/properties/amount",
          type: "string",
          title: "Amount",
          description: "The amount of the total must be greater than zero.",
          default: "",
          examples: ["20.00"],
          pattern: "[0-9]+(\\.[0-9][0-9])?"
        }
      },
      required: ["label", "amount"]
    }
  },
  required: [
    "countryCode",
    "currencyCode",
    "supportedNetworks",
    "merchantCapabilities",
    "total"
  ]
};

var shippingUpdateSchema = {
  $id: "https://developer.apple.com/schemas/ApplePayPaymentRequest.json",
  type: "object",
  definitions: {},
  properties: {
    newShippingMethods: {
      $id: "/properties/newShippingMethods",
      type: "array",
      items: {
        $id: "/properties/newShippingMethods/items",
        type: "object",
        properties: {
          label: {
            $id: "/properties/newShippingMethods/items/properties/label",
            type: "string",
            title: "label",
            description: "A short description of the shipping method.",
            default: "",
            examples: ["Free Standard Shipping"]
          },
          amount: {
            $id: "/properties/newShippingMethods/items/properties/amount",
            type: "string",
            title: "amount",
            description:
              "The nonnegative cost associated with this shipping method.",
            default: "",
            examples: ["0.00"],
            pattern: "[0-9]+(\\.[0-9][0-9])?"
          },
          detail: {
            $id: "/properties/newShippingMethods/items/properties/detail",
            type: "string",
            title: "detail",
            description: "Additional description of the shipping method.",
            default: "",
            examples: ["Arrives in 5-7 days"]
          },
          identifier: {
            $id: "/properties/newShippingMethods/items/properties/identifier",
            type: "string",
            title: "identifier",
            description:
              "A client-defined value used to identify this shipping method.",
            default: "",
            examples: ["standardShipping"]
          }
        }
      }
    },
    newTotal: {
      $id: "/properties/newTotal",
      type: "object",
      properties: {
        label: {
          $id: "/properties/newTotal/properties/label",
          type: "string",
          title: "Label",
          description:
            "Provide a business name for the label field. Use the same business name people will see when they look for the charge on their bank or credit card statement. For example, COMPANY, INC.",
          default: "",
          examples: ["Demo (Card is not charged)"]
        },
        type: {
          $id: "/properties/newTotal/properties/type",
          type: "string",
          title: "Type",
          description:
            "A value that indicates whether the line item is final or pending.",
          default: "final"
        },
        amount: {
          $id: "/properties/newTotal/properties/amount",
          type: "string",
          title: "Amount",
          description: "The amount of the total must be greater than zero.",
          default: "",
          examples: ["20.00"],
          pattern: "[0-9]+(\\.[0-9][0-9])?"
        }
      }
    },
    newLineItems: {
      $id: "/properties/newLineItems",
      type: "array",
      items: {
        $id: "/properties/newLineItems/items",
        type: "object",
        properties: {
          label: {
            $id: "/properties/newLineItems/items/properties/label",
            type: "string",
            title: "Label",
            description: "A short, localized description of the line item.",
            default: "",
            examples: ["Sales Tax"]
          },
          amount: {
            $id: "/properties/newLineItems/items/properties/amount",
            type: "string",
            title: "Amount",
            description: "The monetary amount of the line item.",
            default: "",
            examples: ["2.25"],
            pattern: "-?[0-9]+(\\.[0-9][0-9])?"
          },
          type: {
            $id: "/properties/newLineItems/items/properties/type",
            type: "string",
            title: "type",
            description:
              "A value that indicates whether the line item is final or pending.",
            default: "final",
            examples: ["final"],
            enum: ["final", "pending"]
          }
        }
      }
    },
    errors: {
      $id: "/properties/errors",
      type: "array",
      items: {
        $id: "/properties/errors/items",
        type: "object",
        properties: {
          code: {
            $id: "/properties/errors/items/properties/code",
            type: "string",
            title: "Code",
            default: "",
            examples: [
              "shippingContactInvalid",
              "addressUnserviceable",
              "unknown"
            ]
          },
          message: {
            $id: "/properties/errors/items/properties/message",
            type: "string",
            title: "Custom Message",
            default: "",
            examples: ["9 digit zip code required"]
          },
          contactField: {
            $id: "/properties/errors/items/properties/contactField",
            type: "string",
            title: "Contactfield",
            default: "",
            examples: [
              "postalAddress",
              "locality",
              "subLocality",
              "postalCode",
              "administrativeArea",
              "subAdministrativeArea",
              "country",
              "countryCode"
            ]
          }
        }
      }
    }
  }
};

var completePaymentSchema = {
  $id: "https://developer.apple.com/schemas/ApplePayPaymentRequest.json",
  type: "object",
  properties: {
    status: {
      $id: "/properties/status",
      type: "integer",
      title: "status",
      description:
        "Responce Status IS FOR DEMO ONLY. YOUR CODE NEEDS TO RESPOND TO THE SESSION WITH APPROPRIATE STATUS AS PER DOCUMENTATION",
      default: 0,
      examples: [0, 1, 2, 3, 4, 5, 6, 7]
    },
    errors: {
      $id: "/properties/errors",
      type: "array",
      items: {
        $id: "/properties/errors/items",
        type: "object",
        properties: {
          code: {
            $id: "/properties/errors/items/properties/code",
            type: "string",
            title: "code",
            description:
              "The error code for this instance. Use shippingContactInvalid and billingContactInvalid with contactField.",
            default: "",
            examples: ["shippingContactInvalid", "billingContactInvalid"],
            enum: [
              "addressUnservicable",
              "billingContactInvalid",
              "shippingContactInvalid",
              "unknown"
            ]
          },
          message: {
            $id: "/properties/errors/items/properties/message",
            type: "string",
            title: "message",
            description:
              "A localized, user-facing string that describes the error.",
            default: "",
            examples: ["Invalid zip code"]
          },
          contactField: {
            $id: "/properties/errors/items/properties/contactField",
            type: "string",
            title: "contactField",
            description:
              "The field name that contains the error. Use with shippingContactInvalid or billingContactInvalid error code.",
            default: "",
            examples: [
              "phoneNumber",
              "emailAddress",
              "name",
              "addressLines",
              "postalAddress",
              "locality",
              "subLocality",
              "subAdministrativeArea",
              "postalCode",
              "administrativeArea",
              "country",
              "countryCode",
              "phoneticName"
            ],
            enum: [
              "phoneNumber",
              "emailAddress",
              "name",
              "addressLines",
              "postalAddress",
              "locality",
              "subLocality",
              "subAdministrativeArea",
              "postalCode",
              "administrativeArea",
              "country",
              "countryCode",
              "phoneticName"
            ]
          }
        }
      }
    }
  },
  required: ["status"]
};

var editors = {};

var editorSchemas = {
  ApplePayPaymentRequest: paymentRequestSchema,
  ApplePayShippingContactUpdate: shippingUpdateSchema,
  ApplePayPaymentAuthorizationResult: completePaymentSchema
};

var defaultEditorOptions = {
  mode: "code",
  modes: []
};

$(function () {
  $(".choosePreset").on("change", function (e) {
    var radio = $(this);
    var target = radio.attr("name");
    var preset = radio.val();

    editors[target].set(presetConfigs[target][preset]);
  });

  $(".jsoneditor").each(function (i, editor) {
    var id = editor.id;
    var editorConfig = $.extend(defaultEditorOptions, {
      schema: editorSchemas[id]
    });
    editors[id] = new JSONEditor(editor, editorConfig);
    editors[id].set(presetConfigs[id]["A"]);
  });
});

function callStartSession(session, url) {
  var text = "";
  text = "\nstartSession Results" + "\n";
  $.post(
    "/authorizemerchant",
    {
      merchantId: merchantId,
      url: url,
      displayName: "Apple Pay Demo"
    },
    function (data) {
      try {
        merchantSession = JSON.parse(data);
        merchantSession = merchantSession["statusMessage"];
      } catch (e) {
        //            this should never happen in our situation, unless a bad build
        appendFullLog(
          "startSession response is not valid JSON:\n" +
            data +
            "\nApplePaySession cancelled by Apple Pay Demo Site\n"
        );
        if (session !== null) {
          cancelPaymentSession(session);
        }
      }
      //cleaning the data
      var sanitize = JSON.parse(data);
      sanitize = sanitize["statusMessage"];
      sanitize["signature"] = "REDACTED";
      sanitize["merchantSessionIdentifier"] = "REDACTED";
      sanitize["merchantIdentifier"] = "REDACTED";

      text += JSON.stringify(sanitize, undefined, 4);
      // Stop the session if merchantSession is not valid
      if (
        typeof merchantSession === "string" ||
        "statusCode" in merchantSession
      ) {
        appendFullLog(
          "startSession failed:\n" +
            text +
            "\nApplePaySession cancelled by Apple Pay Demo Site\n"
        );
        cancelPaymentSession(session);
        return;
      }
      if (
        !(
          "merchantIdentifier" in merchantSession &&
          "merchantSessionIdentifier" in merchantSession &&
          ("nOnce" in merchantSession || "nonce" in merchantSession)
        )
      ) {
        var errorDescription =
          "merchantSession is invalid. Payment Session cancelled by Apple Pay Demo Site.\n";
        if (!("merchantIdentifier" in merchantSession)) {
          errorDescription +=
            "merchantIdentifier is not found in merchantSession.\n";
        }
        if (!("merchantSessionIdentifier" in merchantSession)) {
          errorDescription +=
            "merchantSessionIdentifier is not found in merchantSession.\n";
        }
        if (!("nOnce" in merchantSession)) {
          errorDescription += "nonce is not found in merchantSession\n";
        }
        errorDescription += text;
        appendFullLog(errorDescription);
        cancelPaymentSession(session);
        return;
      }

      appendFullLog(text);
      if (session !== null) {
        currentMerchantId = merchantId;
        var completeResult = completeMerchantValidation(
          session,
          merchantSession
        );
      }
    },
    "text"
  ).fail(function (xhr, textStatus, errorThrown) {
    appendFullLog(xhr.responseText);
    if (session !== null) {
      cancelPaymentSession(session);
    }
  });
}

function cancelPaymentSession(session) {
  if (session !== null) session.abort();
}

function buildApplePayRequest() {
  var req = {};

  req.merchantId = "merchant.com.apdemo";

  try {
    //        req.settings = JSON.parse($('#settings').val());
    req.ApplePayPaymentRequest = JSON.parse(
      editors["ApplePayPaymentRequest"].getText()
    );
    req.ApplePayShippingContactUpdate = JSON.parse(
      editors["ApplePayShippingContactUpdate"].getText()
    );
    req.ApplePayPaymentAuthorizationResult = JSON.parse(
      editors["ApplePayPaymentAuthorizationResult"].getText()
    );
  } catch (err) {
    alert("Your input does not seem to be a valid JSON object.");
    return;
  }

  // TODO: get all the pieces from the various inputs and glue them together into a single object for startApplePaySession() to use
  return req;
}

function startApplePaySession() {
  var o = buildApplePayRequest();
  _startApplePaySession(o);
}

// Used by ARQL
function startApplePaySessionWithDefaultParameters() {
  var req = {};

  req.merchantId = "merchant.com.apdemo";

  req.ApplePayPaymentRequest = presetConfigs["ApplePayPaymentRequest"]["A"];
  req.ApplePayShippingContactUpdate =
    presetConfigs["ApplePayShippingContactUpdate"]["A"];
  req.ApplePayPaymentAuthorizationResult =
    presetConfigs["ApplePayPaymentAuthorizationResult"]["A"];

  _startApplePaySession(req);
}

function _startApplePaySession(o) {
  if (typeof ApplePaySession === "undefined") {
    alert(
      "Your browser does not support Apple Pay. Please switch to a supported browser."
    );
  }

  if (o["ApplePayPaymentRequest"] == null) {
    alert(
      "Your input needs to include ApplePayPaymentRequest as a top level key."
    );
    return;
  }

  request = o["ApplePayPaymentRequest"];
  version = 3;

  merchantId = o["merchantId"];
  shippingContactUpdate = o["ApplePayShippingContactUpdate"];
  paymentAuthorizationResult = o["ApplePayPaymentAuthorizationResult"];
  settings = o["settings"];
  if (settings == null) settings = {};

  // Reset counters
  onshippingcontactselectedCount = 0;
  onpaymentauthorizedCount = 0;

  session = new ApplePaySession(version, request);
  window.session = session;

  session.onshippingcontactselected = function onshippingcontactselected(
    event
  ) {
    onshippingcontactselectedCount += 1;
    var shippingContact = event.shippingContact;
    appendFullLog(
      "Shipping contact was selected: \n" +
        JSON.stringify(shippingContact, undefined, 4) +
        "\n"
    );

    // make sure we use new items if it exists
    var update = {
      newTotal: request["total"],
      newLineItems: request["lineItems"]
    };
    if (o["ApplePayShippingContactUpdate"]["newTotal"] !== undefined) {
      update["newTotal"] = o["ApplePayShippingContactUpdate"]["newTotal"];
    }
    if (o["ApplePayShippingContactUpdate"]["newLineItems"] !== undefined) {
      update["newLineItems"] =
        o["ApplePayShippingContactUpdate"]["newLineItems"];
    }

    settings["failuresBeforeSuccess"] = 1;
    if (
      settings["failuresBeforeSuccess"] == null ||
      settings["failuresBeforeSuccess"] >= onshippingcontactselectedCount
    ) {
      if (shippingContactUpdate != null)
        update["errors"] = errorFromDict(shippingContactUpdate["errors"]);
    }

    session.completeShippingContactSelection(update);
  };

  session.onshippingmethodselected = function onshippingmethodselected(event) {
    var shippingMethod = event.shippingMethod;
    appendFullLog(
      "Shipping method was selected: " +
        JSON.stringify(shippingMethod, undefined, 4) +
        "\n"
    );
    selectedShippingMethod = event.shippingMethod;

    // make sure we use new items if it exists
    var update = {
      newTotal: request["total"],
      newLineItems: request["lineItems"]
    };
    if (o["ApplePayShippingContactUpdate"]["newTotal"] !== undefined) {
      update["newTotal"] = o["ApplePayShippingContactUpdate"]["newTotal"];
    }
    if (o["ApplePayShippingContactUpdate"]["newLineItems"] !== undefined) {
      update["newLineItems"] =
        o["ApplePayShippingContactUpdate"]["newLineItems"];
    }

    session.completeShippingMethodSelection(update);
  };

  session.onpaymentauthorized = function onpaymentauthorized(event) {
    onpaymentauthorizedCount += 1;
    var payment = event.payment;
    currentPaymentToken = payment.token.paymentData;
    appendFullLog(
      "Shipping Contact:\n" +
        JSON.stringify(payment.shippingContact, undefined, 4) +
        "\n"
    );
    appendFullLog(
      "Billing Contact:\n" +
        JSON.stringify(payment.billingContact, undefined, 4) +
        "\n"
    );
    appendFullLog(
      "Payment Token:\n" + JSON.stringify(payment.token, undefined, 4) + "\n"
    );
    window.setTimeout(function () {
      settings["failuresBeforeSuccess"] = 1;
      var update = {
        status: ApplePaySession.STATUS_SUCCESS
      };
      if (
        settings["failuresBeforeSuccess"] == null ||
        settings["failuresBeforeSuccess"] >= onpaymentauthorizedCount
      ) {
        if (paymentAuthorizationResult != null) {
          if (paymentAuthorizationResult["status"] != null)
            update["status"] = paymentAuthorizationResult["status"];
          if (paymentAuthorizationResult["errors"] != null)
            update["errors"] = errorFromDict(
              paymentAuthorizationResult["errors"]
            );
        }
      }

      session.completePayment(update);
      appendFullLog(
        "\n\ncompletePayment executed with the following parameters:\n" +
          JSON.stringify(
            {
              status: update["status"],
              errors: errorsToJSONObject(update["errors"])
            },
            undefined,
            4
          ) +
          "\n"
      );
    }, 2000);
  };

  session.onpaymentmethodselected = function onpaymentmethodselected(event) {
    var paymentMethod = event.paymentMethod;

    appendFullLog(
      "Payment method was selected: " +
        JSON.stringify(paymentMethod, undefined, 4) +
        "\n"
    );

    // make sure we use new items if it exists
    var update = {
      newTotal: request["total"],
      newLineItems: request["lineItems"]
    };
    if (o["ApplePayShippingContactUpdate"]["newTotal"] !== undefined) {
      update["newTotal"] = o["ApplePayShippingContactUpdate"]["newTotal"];
    }
    if (o["ApplePayShippingContactUpdate"]["newLineItems"] !== undefined) {
      update["newLineItems"] =
        o["ApplePayShippingContactUpdate"]["newLineItems"];
    }

    appendFullLog(
      "\n\ncompletePaymentMethodSelection:\n" +
        JSON.stringify(update, undefined, 4) +
        "\n"
    );
    session.completePaymentMethodSelection(update);
  };

  session.oncancel = function oncancel() {
    appendFullLog("\nPayment cancelled by WebKit:\n");
    appendFullLog("session.oncancel\n");
  };

  session.onvalidatemerchant = function onvalidatemerchant(event) {
    callStartSession(session, event.validationURL);
  };

  session.begin();
}

// selector substitute helper
$(document).ready(function () {
  $(".applePayButtonConfig").on("change", function () {
    var val = $(this).val();
    var id = $(this).attr("id");

    $(".applePayButton").each(function (i, el) {
      el.style.cssText += val;
      el.style.display = "none";
      el.offsetHeight;
      el.style.display = "block";
    });

    if (id == "applePayButtonType") {
      $("#applePayButtonTypeChange span").html(val);
    }
    if (id == "applePayButtonColor") {
      $("#applePayButtonColorChange span").html(val);
    }
  });

  $(".applePayLangConfig").on("change", function () {
    var val = $(this).val();
    var id = $(this).attr("id");

    $(".applePayButton").each(function (i, el) {
      $(el).attr("lang", val);
    });

    $("#applePayButtonLanguageChange span").html(val);
  });
});

$(document).ready(function () {
  // https://developer.apple.com/documentation/apple_pay_on_the_web/apple_pay_on_the_web_version_history
  if (typeof ApplePaySession === "undefined") {
    return;
  }
  let buttonTypeSelect = document.getElementById("applePayButtonType");
  if (!buttonTypeSelect) {
    return;
  }

  let options = [
    {
      type: "buy",
      text: "Buy"
    }
  ];
  if (ApplePaySession.supportsVersion(4)) {
    options = options.concat([
      {
        type: "book",
        text: "Book"
      },
      {
        type: "donate",
        text: "Donate"
      },
      {
        type: "check-out",
        text: "Check Out"
      },
      {
        type: "set-up",
        text: "Set Up"
      },
      {
        type: "subscribe",
        text: "Subscribe"
      }
    ]);
  }
  if (ApplePaySession.supportsVersion(10)) {
    options = options.concat([
      {
        type: "add-money",
        text: "Add Money"
      },
      {
        type: "contribute",
        text: "Contribute"
      },
      {
        type: "order",
        text: "Order"
      },
      {
        type: "reload",
        text: "Reload"
      },
      {
        type: "rent",
        text: "Rent"
      },
      {
        type: "support",
        text: "Support"
      },
      {
        type: "tip",
        text: "Tip"
      },
      {
        type: "top-up",
        text: "Top Up"
      }
    ]);
  }
  options.sort(function (a, b) {
    return a["text"].localeCompare(b["text"]);
  });
  for (const option of options) {
    let optEl = document.createElement("option");
    optEl.value = "-apple-pay-button-type: " + option["type"] + ";";
    optEl.text = option["text"];
    buttonTypeSelect.add(optEl, null);
  }
});

$(document).ready(function () {
  if (typeof ApplePaySession === "undefined") {
    $(".hideWhenBrowserUnsupported").css("display", "block");
  }
});

function heightChanged(event) {
  $(".applePayButton").css("height", event.target.value + "px");
  $("#height-label").text("Height: " + event.target.value + "px");
}

function widthChanged(event) {
  $(".applePayButton").css("width", event.target.value + "px");
  $("#width-label").text("Width: " + event.target.value + "px");
}

function radiusChanged(event) {
  $(".applePayButton").css("border-radius", event.target.value + "px");
  $("#radius-label").text("Corner Radius: " + event.target.value + "px");
}

// Helpers
function errorFromDict(dict) {
  if (dict == null) return dict;
  var re = [];
  for (var i = 0; i < dict.length; i++) {
    var e = dict[i];
    re.push(new ApplePayError(e["code"], e["contactField"], e["message"]));
  }
  return re;
}
