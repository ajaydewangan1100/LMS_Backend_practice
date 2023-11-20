export const getRazorpayApiKey = async (req, res, next) => {
  // first we need to return razorpay key to client
  req.status(200).josn({
    success: true,
    message: "Razorpay API Key",
    key: process.env.RAZORPAY_KEY_ID,
  });
};

export const buySubscrition = async (req, res, next) => {};

export const verifySubscrition = async (req, res, next) => {};

export const cancelSubscrition = async (req, res, next) => {};

export const allPayments = async (req, res, next) => {};
