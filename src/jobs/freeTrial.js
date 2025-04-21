const cron = require("node-cron");
const moment = require("moment-timezone");
const Notification = require("../models/notificationModel");
const sendInAppNotification = require("../utils/sendInAppNotification");
const User = require("../models/userModel");
require("dotenv").config();

cron.schedule("0 0 * * *", async () => {
  const now = moment().tz("Asia/Kolkata");

  try {
    const tenDaysFromNow = now.clone().add(10, "days").toDate();
    const expiring = await User.find({
      status: "trial",
      freeTrialEndDate: { $lte: tenDaysFromNow },
    })

    for (const exp of expiring) {
      const data = {
        user: exp.user._id,
        read: false,
      };
      await Notification.create({
        users: data,
        subject: `Your Free Trial is expiring soon!`,
        content: `Your free trial to our app is expiring soon. Please renew your subscription to continue using our app.`,
        type: "in-app",
        senderModel: "Cronjob",
      });

      await sendInAppNotification(
        [exp.user.fcmToken],
        "Subscription Expiring",
        `Your free trial to our app is expiring soon. Please renew your subscription to continue using our app.`,
        null,
        "my_subscriptions"
      );
    }

    const expiredSub = await User.find({
      status: "trial",
      freeTrialEndDate: { $lte: now.toDate() },
    });

    for (const exp of expiredSub) {
      exp.status = "awaiting_payment";
      exp.freeTrialEndDate = null;
      await exp.save();
      const data = {
        user: exp._id,
        read: false,
      };
      await Notification.create({
        users: data,
        subject: `Your free trial has expired!`,
        content: `Your free trial to our app has expired. Please renew your subscription to continue using our app.`,
        type: "in-app",
        senderModel: "Cronjob",
      });

      await sendInAppNotification(
        [exp.user.fcmToken],
        "Your free trial has expired",
        `Your free trial to our app has expired. Please renew your subscription to continue using our app.`,
        null,
        "my_subscriptions"
      );
    }
  } catch (err) {
    console.error("Error updating subscriptions:", err);
  }
});
