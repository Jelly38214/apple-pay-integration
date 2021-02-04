export const presetConfigs = {
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

export const paymentRequestSchema = {
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

export const shippingUpdateSchema = {
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

export const completePaymentSchema = {
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

export const editors = {};

export const editorSchemas = {
  ApplePayPaymentRequest: paymentRequestSchema,
  ApplePayShippingContactUpdate: shippingUpdateSchema,
  ApplePayPaymentAuthorizationResult: completePaymentSchema
};

export const defaultEditorOptions = {
  mode: "code",
  modes: []
};
