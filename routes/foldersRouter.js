const { Router } = require("express");
const upload = require("../middlewares/multer");
const foldersController = require("../controllers/foldersController");
const foldersRouter = new Router();

foldersRouter.post("/", foldersController.createFolderPost);

foldersRouter.get("/:folderId", foldersController.viewFolder);

foldersRouter.get("/:folderId/update", foldersController.updateFolderGet);

foldersRouter.post("/:folderId/update", foldersController.updateFolderPost);

foldersRouter.post("/:folderId/delete", foldersController.deleteFolderPost);

foldersRouter.post(
  "/:folderId/file",
  upload.single("file"),
  foldersController.uploadFilePost,
);

module.exports = foldersRouter;
