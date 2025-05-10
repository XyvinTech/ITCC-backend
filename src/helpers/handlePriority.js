const Promotion = require("../models/promotionModel");
const handlePrioritySwap = async (
  newPriority,
  promotionType,
  currentPromotionId
) => {
  try {
    if (!promotionType || newPriority === undefined || newPriority === null) {
      throw new Error("Promotion type and priority are required");
    }
    if (!currentPromotionId) {
      const promotionsToShift = await Promotion.find({
        type: promotionType,
        priority: { $gte: newPriority },
      }).sort({ priority: 1 });

      for (const promotion of promotionsToShift) {
        promotion.priority += 1;
        await promotion.save();
      }
      return;
    }

    const currentPromotion = await Promotion.findById(currentPromotionId);
    if (!currentPromotion) {
      throw new Error(`Promotion with ID ${currentPromotionId} not found`);
    }

    if (currentPromotion.priority === newPriority) {
      return;
    }

    const existingPromotionWithTargetPriority = await Promotion.findOne({
      type: promotionType,
      priority: newPriority,
      _id: { $ne: currentPromotionId },
    });

    if (!existingPromotionWithTargetPriority) {
      currentPromotion.priority = newPriority;
      await currentPromotion.save();
      return;
    }

    const oldPriority = currentPromotion.priority;
    existingPromotionWithTargetPriority.priority = oldPriority;
    await existingPromotionWithTargetPriority.save();

    currentPromotion.priority = newPriority;
    await currentPromotion.save();
  } catch (error) {
    console.error("Error in priority swap:", error);
    throw new Error(
      `Failed to reassign promotion priorities: ${error.message}`
    );
  }
};

const handlePriorityReassignment = async (
  newPriority,
  promotionType,
  excludeId = null
) => {
  console.warn(
    "handlePriorityReassignment is deprecated. Use handlePrioritySwap instead."
  );
  return handlePrioritySwap(newPriority, promotionType, excludeId);
};

module.exports = {
  handlePrioritySwap,
  handlePriorityReassignment,
};
