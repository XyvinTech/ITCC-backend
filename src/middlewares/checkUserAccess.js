const responseHandler = require("../helpers/responseHandler");
const UserAccess = require("../models/userAccessModel");

const checkUserAccess = (permissionName) => {
  return async (req, res, next) => {
    try {
      const access = await UserAccess.findOne();

      if (!access) {
        return responseHandler(res, 403, "Access settings not found");
      }

      if (permissionName === "user") {
        const { social = [], awards = [], certificates = [] } = req.body;

        if (social.length && !access.addSocialmedia) {
          return responseHandler(
            res,
            403,
            "Permission denied: Cannot update social media links"
          );
        }

        if (awards.length && !access.addReward) {
          return responseHandler(
            res,
            403,
            "Permission denied: Cannot update awards"
          );
        }

        if (certificates.length && !access.addCertificate) {
          return responseHandler(
            res,
            403,
            "Permission denied: Cannot update certificates"
          );
        }
      }
      if (permissionName === "feed") {
        if (!access.postRequirement) {
          return responseHandler(
            res,
            403,
            "Permission denied: Cannot create feeds"
          );
        }
      }
      if (permissionName === "notification") {
        if (!access.sendNotification) {
          return responseHandler(
            res,
            403,
            "Permission denied: Cannot send notifications"
          );
        }
      }

      next();
    } catch (error) {
      return responseHandler(
        res,
        500,
        `Internal server error: ${error.message}`
      );
    }
  };
};

module.exports = checkUserAccess;
