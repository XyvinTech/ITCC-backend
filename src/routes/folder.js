const express = require("express");
const authVerify = require("../middlewares/authVerify");
const folderController = require("../controllers/folderController");
const folderRoute = express.Router();

folderRoute.use(authVerify);

folderRoute.post("/", folderController.createFolder);
folderRoute.get("/list/:eventId", folderController.getFolderForUser);
folderRoute.get("/learning-corner", folderController.getLearningCorner);
folderRoute.get("/admin/list/:eventId", folderController.fetchEventFolders);
folderRoute
  .route("/single/:id")
  .get(folderController.getFolder)
  .put(folderController.updateFolder)
  .delete(folderController.deleteFolder);
folderRoute.route("/file/:id").post(folderController.addFilesToFolder);
folderRoute.post("/remove/:id", folderController.deleteFiles);
folderRoute.get("/files/:id", folderController.getFiles);
folderRoute.post("/user/file/add", folderController.addFileToPublicFolder);
folderRoute.post("/user/file/delete", folderController.deleteFilesFromPublicFolder);

module.exports = folderRoute;
