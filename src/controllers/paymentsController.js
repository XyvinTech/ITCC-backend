require("dotenv").config();
const { getMessaging } = require("firebase-admin/messaging");
const responseHandler = require("../helpers/responseHandler");
const Payment = require("../models/paymentModel");
const User = require("../models/userModel");
const {
  PaymentSchema,
  UserPaymentSchema,
  createParentSubSchema,
  editParentSubSchema,
} = require("../validations/index");
const ParentSub = require("../models/parentSubModel");
const sendInAppNotification = require("../utils/sendInAppNotification");
const Razorpay = require("razorpay");
const Razorpayment = require("../models/razorpayModel");
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});
const crypto = require("crypto");

exports.updatePayment = async (req, res) => {
  try {
    const { error } = PaymentSchema.validate(req.body, { abortEarly: true });
    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }
    const { id } = req.params;

    await Payment.findByIdAndUpdate(id, { status: "expired" }, { new: true });

    const payment = await Payment.create(req.body);

    if (!payment) {
      return responseHandler(res, 500, "Error saving payment");
    } else {
      if (req.body.category === "app") {
        const user = await User.findOneAndUpdate(
          { _id: req.body.user },
          { subscription: "premium" },
          { new: true }
        );
        await sendInAppNotification(
          user.fcm,
          "Your subscription has been updated",
          "Your subscription for our app has been updated. Please explore the app for more features and benefits.",
          null,
          "my_subscriptions"
        );
      } else if (req.body.category === "membership") {
        const user = await User.findOneAndUpdate(
          { _id: req.body.user },
          { status: "active" },
          { new: true }
        );
        await sendInAppNotification(
          user.fcm,
          "Your membership has been updated",
          "Your membership for our app has been updated. Please explore the app",
          null,
          "my_subscriptions"
        );
      }
    }

    return responseHandler(res, 200, "Payment updated successfully!", payment);
  } catch (err) {
    return responseHandler(res, 500, `Error saving payment: ${err.message}`);
  }
};

exports.getUserPayments = async (req, res) => {
  const { userId } = req.params;

  try {
    const appPayment = await Razorpayment.findOne({
      user: userId,
      category: "app",
      status: "paid",
    })
      .sort({ createdAt: -1 })
      .lean();

    const membershipPayment = await Razorpayment.findOne({
      user: userId,
      category: "membership",
      status: "paid",
    })
      .sort({ createdAt: -1 })
      .lean();

    const payments = [];

    if (appPayment) {
      payments.push(appPayment);
    }

    if (membershipPayment) {
      payments.push(membershipPayment);
    }

    return responseHandler(
      res,
      200,
      "Successfully retrieved payments",
      payments,
      payments.length
    );
  } catch (error) {
    return responseHandler(res, 500, "Error retrieving payments", error);
  }
};

exports.createUserPayment = async (req, res) => {
  const userId = req.userId;
  const data = req.body;

  if (!userId) {
    return responseHandler(res, 400, "Invalid request");
  }

  const user = await User.findById(userId);
  if (!user) {
    return responseHandler(res, 404, "User not found");
  }

  const { error } = UserPaymentSchema.validate(data, {
    abortEarly: true,
  });

  const payment_exist = await Payment.findOne({
    category: data.category,
    member: userId,
    status: { $in: ["accepted", "expiring"] },
  });

  if (payment_exist) {
    payment_exist.status == "expired";
    await payment_exist.save();
  }

  if (error) {
    return responseHandler(res, 400, `Invalid input: ${error.message}`);
  }

  const newPayment = new Payment({
    ...data,
    user: userId,
  });

  try {
    await newPayment.save();
    return responseHandler(
      res,
      201,
      "Payment submitted successfully!",
      newPayment
    );
  } catch (err) {
    return responseHandler(res, 500, `Error saving payment: ${err.message}`);
  }
};

exports.createParentSubscription = async (req, res) => {
  try {
    const { error } = createParentSubSchema.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }
    const payment = await ParentSub.create(req.body);
    if (!payment) {
      return responseHandler(res, 500, "Error saving payment");
    } else {
      return responseHandler(res, 200, "Payment saved successfully", payment);
    }
  } catch (error) {
    return responseHandler(res, 500, "Internal Server Error", error.message);
  }
};

exports.getParentSubscription = async (req, res) => {
  try {
    const payment = await ParentSub.find();
    if (!payment) {
      return responseHandler(res, 500, "Error saving payment");
    } else {
      return responseHandler(res, 200, "Payment saved successfully", payment);
    }
  } catch (error) {
    return responseHandler(res, 500, "Internal Server Error", error.message);
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { error } = PaymentSchema.validate(req.body, { abortEarly: true });
    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }
    const newPayment = await Payment.create(req.body);

    if (!newPayment) {
      return responseHandler(res, 500, "Error saving payment");
    } else {
      if (req.body.category === "app") {
        await User.findOneAndUpdate(
          { _id: req.body.user },
          { subscription: "premium" },
          { new: true }
        );
      } else if (req.body.category === "membership") {
        await User.findOneAndUpdate(
          { _id: req.body.user },
          { status: "active" },
          { new: true }
        );
      }
    }

    return responseHandler(
      res,
      201,
      "Payment submitted successfully!",
      newPayment
    );
  } catch (error) {
    return responseHandler(res, 500, "Internal Server Error", error.message);
  }
};

exports.getPayments = async (req, res) => {
  try {
    const { pageNo = 1, limit = 10, search, status } = req.query;
    const skipCount = (pageNo - 1) * limit;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [{ "user.name": { $regex: search, $options: "i" } }];
    }

    const payments = await Payment.find(filter)
      .populate("user", "name")
      .populate("parentSub", "expiryDate")
      .skip(skipCount)
      .limit(limit)
      .sort({ _id: -1 })
      .lean();

    const totalCount = await Payment.countDocuments(filter);

    const mappedData = payments.map((item) => {
      return {
        ...item,
        user: item.user.name,
        expiryDate: item.parentSub?.expiryDate,
      };
    });

    return responseHandler(
      res,
      200,
      "Successfully retrieved payments",
      mappedData,
      totalCount
    );
  } catch (error) {
    return responseHandler(res, 500, "Internal Server Error", error.message);
  }
};

exports.getSinglePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id).populate("user", "name");
    if (!payment) {
      return responseHandler(res, 404, "Payment not found");
    }

    return responseHandler(res, 200, "Successfully retrieved payment", payment);
  } catch (error) {
    return responseHandler(res, 500, "Internal Server Error", error.message);
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByIdAndDelete(id);

    if (!payment) {
      return responseHandler(res, 404, "Payment not found");
    }

    return responseHandler(res, 200, "Successfully deleted payment", payment);
  } catch (error) {
    return responseHandler(res, 500, "Internal Server Error", error.message);
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let payment = await Payment.findById(id);
    if (!payment) {
      return responseHandler(res, 404, "Payment details do not exist");
    }

    let user = await User.findById(payment.user);

    if (!user) {
      return responseHandler(res, 404, "User not found");
    }
    if (status == "cancelled" && payment.category == "app") {
      user.subscription = "free";
      payment.status = "cancelled";
    } else if (status == "cancelled" && payment.category == "membership") {
      user.status = "inactive";
      payment.status = "cancelled";
    } else if (status == "accepted" && payment.category == "app") {
      user.subscription = "premium";
      payment.status = "active";
    } else if (status == "accepted" && payment.category == "membership") {
      user.status = "active";
      payment.status = "active";
    }
    await user.save();
    await payment.save();

    const message = {
      notification: {
        title: `HEF Payment has been ${status}`,
        body: `HEF Payment for ${payment.category} has been ${status}, please check your account`,
      },
      token: user.fcm,
    };

    getMessaging()
      .send(message)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });

    return responseHandler(
      res,
      200,
      "Payment status updated successfully",
      payment
    );
  } catch (err) {
    return responseHandler(res, 500, `Error saving payment: ${err.message}`);
  }
};

exports.updateParentSubscription = async (req, res) => {
  try {
    const { error } = editParentSubSchema.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }
    const { id } = req.params;
    const payment = await ParentSub.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!payment) {
      return responseHandler(res, 500, "Error saving payment");
    } else {
      return responseHandler(res, 200, "Payment saved successfully", payment);
    }
  } catch (error) {
    return responseHandler(res, 500, "Internal Server Error", error.message);
  }
};

exports.getSingleParentSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await ParentSub.findById(id);
    if (!payment) {
      return responseHandler(res, 500, "Error saving payment");
    } else {
      return responseHandler(res, 200, "Payment saved successfully", payment);
    }
  } catch (error) {
    return responseHandler(res, 500, "Internal Server Error", error.message);
  }
};

exports.makePayment = async (req, res) => {
  try {
    const { userId } = req;
    const dateRandom = new Date().getTime();
    const { amount, category } = req.body;

    const appName = "ITCC";

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `${appName}_order_${dateRandom}`,
      notes: {
        appName: appName,
      },
    };

    instance.orders.create(options, async function (err, order) {
      if (order) {
        const paymentData = {
          user: userId,
          gatewayId: order.id,
          entity: order.entity,
          amount: order.amount / 100,
          amountDue: order.amount_due / 100,
          amountPaid: order.amount_paid,
          currency: order.currency,
          status: order.status,
          receipt: order.receipt,
          attempts: order.attempts,
          category: category,
        };
        const newPayment = await Razorpayment.create(paymentData);
        return responseHandler(
          res,
          200,
          "Payment created successfully",
          newPayment
        );
      } else if (err) {
        return responseHandler(
          res,
          500,
          `Payment creation failed: ${err.message}`
        );
      }
    });
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.razorpayCallback = async (req, res) => {
  try {
    const { paymentId } = req.query;
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    const getDoc = await Razorpayment.findOne({
      gatewayId: razorpayOrderId,
    });

    if (getDoc) {
      const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY);
      const data = hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const generatedSignature = data.digest("hex");
      if (generatedSignature === razorpaySignature) {
        let expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 365);
        const fetchOrderData = await instance.orders.fetch(razorpayOrderId);
        if (fetchOrderData.status) {
          delete fetchOrderData.id;
          const updatePayment = await Razorpayment.findOneAndUpdate(
            { _id: paymentId },
            {
              amount: fetchOrderData.amount / 100,
              amountPaid: fetchOrderData.amount_paid / 100,
              amountDue: fetchOrderData.amount_due,
              status: fetchOrderData.status,
              attempts: fetchOrderData.attempts,
              expiryDate: expiryDate,
            },
            { new: true }
          );
          if (updatePayment.category === "membership") {
            await User.findByIdAndUpdate(
              updatePayment.user,
              { status: "active", freeTrialEndDate: null },
              { new: true }
            );
          } else if (updatePayment.category === "app") {
            await User.findByIdAndUpdate(
              updatePayment.user,
              { subscription: "premium" },
              { new: true }
            );
          }
          return responseHandler(
            res,
            200,
            "Payment updated successfully",
            updatePayment
          );
        } else {
          return responseHandler(
            res,
            500,
            `Payment failed: ${fetchOrderData.message}`
          );
        }
      } else {
        return responseHandler(
          res,
          400,
          "Unable to verify the signature ! Contact Team now"
        );
      }
    } else {
      return responseHandler(res, 500, "Payment not found");
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};
