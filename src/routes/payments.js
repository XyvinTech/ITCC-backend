const express = require("express");
const paymentController = require("../controllers/paymentsController");
const authVerify = require("../middlewares/authVerify");

const paymentRoute = express.Router();


paymentRoute.post("/razorpay-callback", paymentController.razorpayCallback);

paymentRoute.use(authVerify);

paymentRoute
  .route("/")
  .post(paymentController.createPayment)
  .get(paymentController.getPayments);

paymentRoute.post("/user", paymentController.createUserPayment);
paymentRoute.post("/make-payment", paymentController.makePayment);
paymentRoute
  .route("/parent-subscription")
  .post(paymentController.createParentSubscription)
  .get(paymentController.getParentSubscription)
  

paymentRoute.put("/update/:id", paymentController.updatePayment);

paymentRoute.get("/user/:userId", paymentController.getUserPayments);

paymentRoute.patch("/status/:id", paymentController.updatePaymentStatus);

paymentRoute
  .route("/parent-subscription/:id")
  .put(paymentController.updateParentSubscription)
  .get(paymentController.getSingleParentSubscription)
  .delete(paymentController.deleteParentSubscription);

paymentRoute
  .route("/:id")
  .get(paymentController.getSinglePayment)
  .delete(paymentController.deletePayment);

module.exports = paymentRoute;
