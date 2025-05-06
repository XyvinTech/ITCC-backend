const cron = require("node-cron");
const moment = require("moment-timezone");
const Promotion = require("../models/promotionModel");
require("dotenv").config();

cron.schedule("* * * * *", async () => {
  const now = moment().tz("Asia/Kolkata");

  try {
    const active = await Promotion.find({
      startDate: { $lte: now.toDate() },
      status: "inactive",
    });

    for (const act of active) {
      act.status = "active";
      await act.save();
    }
    console.log(`Activated ${active.length} promotions`);

    const expiring = await Promotion.find({
      endDate: { $lte: now.toDate() },
      status: "active",
    });

    for (const exp of expiring) {
      exp.status = "expired";
      await exp.save();
    }
    console.log(`Deactivated ${expiring.length} promotions`);
  } catch (err) {
    console.error("Error updating promotions:", err);
  }
});
