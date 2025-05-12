const checkAccess = require("../helpers/checkAccess");
const responseHandler = require("../helpers/responseHandler");
const Event = require("../models/eventModel");
const Folder = require("../models/folderModel");
const logActivity = require("../models/logActivityModel");
const validations = require("../validations");

exports.createFolder = async (req, res) => {
  let status = "failure";
  let errorMessage = null;
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("eventManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }
    const createFolderValidator = validations.createFolderSchema.validate(
      req.body,
      {
        abortEarly: true,
      }
    );

    if (createFolderValidator.error) {
      return responseHandler(
        res,
        400,
        `Invalid input: ${createFolderValidator.error.message}`
      );
    }
    const existingFolder = await Folder.findOne({
      name: req.body.name,
    });
    if (existingFolder) {
      return responseHandler(res, 400, "Folder name already exists");
    }
    const newFolder = await Folder.create(req.body);
    if (!newFolder) {
      return responseHandler(res, 400, "Folder creation failed!");
    }
    status = "success";
    return responseHandler(
      res,
      201,
      "New Folder created successfully!",
      newFolder
    );
  } catch (error) {
    errorMessage = error.message;
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  } finally {
    await logActivity.create({
      admin: req.user,
      type: "folder",
      description: "Create Folder",
      apiEndpoint: req.originalUrl,
      httpMethod: req.method,
      host: req.headers["x-forwarded-for"] || req.ip,
      agent: req.headers["user-agent"],
      status,
      errorMessage,
    });
  }
};
exports.getFolder = async (req, res) => {
  let status = "failure";
  let errorMessage = null;
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("eventManagement_view")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Folder ID is required");
    }
    const folder = await Folder.findById(id);
    status = "success";
    if (folder) {
      return responseHandler(res, 200, "Folder found successfully!", folder);
    } else {
      return responseHandler(res, 404, "Folder not found");
    }
  } catch (error) {
    errorMessage = error.message;
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  } finally {
    await logActivity.create({
      admin: req.user,
      type: "folder",
      description: "Get Folder",
      apiEndpoint: req.originalUrl,
      httpMethod: req.method,
      host: req.headers["x-forwarded-for"] || req.ip,
      agent: req.headers["user-agent"],
      status,
      errorMessage,
    });
  }
};
exports.updateFolder = async (req, res) => {
  let status = "failure";
  let errorMessage = null;
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("eventManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Folder ID is required");
    }
    const { error } = validations.editFolderSchema.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }
    const updatedFolder = await Folder.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    status = "success";
    return responseHandler(
      res,
      200,
      "Folder updated successfully!",
      updatedFolder
    );
  } catch (error) {
    errorMessage = error.message;
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  } finally {
    await logActivity.create({
      admin: req.user,
      type: "folder",
      description: "Update Folder",
      apiEndpoint: req.originalUrl,
      httpMethod: req.method,
      host: req.headers["x-forwarded-for"] || req.ip,
      agent: req.headers["user-agent"],
      status,
      errorMessage,
    });
  }
};
exports.deleteFolder = async (req, res) => {
  let status = "failure";
  let errorMessage = null;
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("eventManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Folder ID is required");
    }
    const deleteFolder = await Folder.findByIdAndDelete(id);
    if (deleteFolder) {
      status = "success";
      return responseHandler(res, 200, `Folder deleted successfully..!`);
    }
  } catch (error) {
    errorMessage = error.message;
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  } finally {
    await logActivity.create({
      admin: req.user,
      type: "folder",
      description: "Delete Folder",
      apiEndpoint: req.originalUrl,
      httpMethod: req.method,
      host: req.headers["x-forwarded-for"] || req.ip,
      agent: req.headers["user-agent"],
      status,
      errorMessage,
    });
  }
};
exports.fetchEventFolders = async (req, res) => {
  try {
    const { pageNo = 1, limit = 10, search } = req.query;
    const skipCount = (pageNo - 1) * limit;
    const id = req.params.eventId;

    if (!id) {
      return responseHandler(res, 400, "Event ID is required");
    }

    const filter = { event: id };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
      ];
    }

    const totalCount = await Folder.countDocuments(filter);
    const folders = await Folder.find(filter)
      .skip(skipCount)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean();

    if (!folders.length) {
      return responseHandler(res, 404, "No folders found");
    }

    return responseHandler(
      res,
      200,
      "Folders fetched successfully!",
      folders,
      totalCount
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.getFolderForUser = async (req, res) => {
  try {
    const { pageNo = 1, limit = 10 } = req.query;
    const skipCount = 10 * (pageNo - 1);
    const { id } = req.params.eventId;
    if (!id) {
      return responseHandler(res, 400, "Folder ID is required");
    }
    const totalCount = await Folder.countDocuments({ event: id });
    const folder = await Folder.find(id)
      .skip(skipCount)
      .limit(limit)
      .lean();
    if (!folder) {
      return responseHandler(res, 404, "Folder not found");
    }
    return responseHandler(
      res,
      200,
      "Folder found successfully!",
      folder,
      totalCount
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};
exports.addFilesToFolder = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("eventManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Folder ID is required");
    }
    const updatedFiles = req.body.files.map((file) => ({
      ...file,
      user: req.user,
    }));

    const updatedFolder = await Folder.findByIdAndUpdate(
      id,
      { $push: { files: updatedFiles } },
      {
        new: true,
      }
    );
    return responseHandler(
      res,
      200,
      "Files added to folder successfully!",
      updatedFolder
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};
exports.deleteFiles = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("eventManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }
    const { id } = req.params;
    const { fileIds } = req.body;
    if (!id) {
      return responseHandler(res, 400, "Folder ID is required");
    }
    if (!fileIds || fileIds.length === 0) {
      return responseHandler(res, 400, "File IDs are required");
    }

    const updatedFolder = await Folder.findByIdAndUpdate(
      id,
      { $pull: { files: { _id: { $in: fileIds } } } },
      { new: true }
    );

    if (!updatedFolder) {
      return responseHandler(res, 404, "Folder not found");
    }

    return responseHandler(
      res,
      200,
      "Files deleted successfully from the folder!",
      updatedFolder
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.addFileToPublicFolder = async (req, res) => {
  try {
    const { files, eventId } = req.body;

    if (!eventId) {
      return responseHandler(res, 400, "Event ID is required");
    }

    if (!files || files.length === 0) {
      return responseHandler(res, 400, "Valid files array is required");
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return responseHandler(res, 404, "Event not found");
    }

    let folder = await Folder.findOne({ event: eventId, name: "public" });
    if (!folder) {
      folder = new Folder({
        name: "public",
        event: eventId,
        files: [],
      });
      await folder.save();
    }

    const filesWithUser = files.map((file) => ({
      ...file,
      user: req.userId,
    }));

    const updatedFolder = await Folder.findByIdAndUpdate(
      folder._id,
      { $push: { files: filesWithUser } },
      { new: true }
    );

    return responseHandler(
      res,
      200,
      "Files added to public folder successfully!",
      updatedFolder
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};
exports.deleteFilesFromPublicFolder = async (req, res) => {
  try {
    const { eventId, fileIds } = req.body;

    if (!eventId) {
      return responseHandler(res, 400, "Event ID is required");
    }

    if (!fileIds || fileIds.length === 0) {
      return responseHandler(res, 400, "Valid fileIds array is required");
    }

    const publicFolder = await Folder.findOne({
      event: eventId,
      name: "public",
    });

    if (!publicFolder) {
      return responseHandler(
        res,
        404,
        "Public folder not found for this event"
      );
    }

    const updatedFolder = await Folder.findByIdAndUpdate(
      publicFolder._id,
      { $pull: { files: { _id: { $in: fileIds } } } },
      { new: true }
    );

    return responseHandler(
      res,
      200,
      "Files deleted successfully from the public folder!",
      updatedFolder
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};
