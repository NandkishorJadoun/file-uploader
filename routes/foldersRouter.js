const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const prisma = new PrismaClient(); // temporarily creating, later send it to controllers

const foldersRouter = new Router();

foldersRouter.post("/", async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  await prisma.folder.create({
    data: { name, userId },
  });

  res.redirect("/");
});


foldersRouter.get("/:folderId", async (req, res) => {
  const { folderId } = req.params;
  const folder = await prisma.folder.findUnique({
    where: {
      id: Number(folderId),
    },
    include: {
      posts: true,
    },
  });
  res.render("folder", { folder });
});

foldersRouter.get("/:folderId/update", async (req, res) => {
  const { folderId } = req.params;
  const folder = await prisma.folder.findUnique({
    where: {
      id: Number(folderId),
    },
    select: {
      id: true,
      name: true,
    },
  });

  res.render("update-folder", { folder });
});

foldersRouter.post("/:folderId/update", async (req, res) => {
  const { folderId } = req.params;
  const { folderName } = req.body;

  await prisma.folder.update({
    where: {
      id: Number(folderId),
    },
    data: {
      name: folderName,
    },
  });

  res.redirect("/");
});

foldersRouter.post("/:folderId/delete", async (req, res) => {
  const { folderId } = req.params;

  await prisma.folder.delete({
    where: {
      id: Number(folderId),
    },
  });

  res.redirect("/");
});

foldersRouter.post(
  "/:folderId/file",
  upload.single("file"),
  async (req, res) => {
    const { folderId } = req.params;
    await prisma.post.create({
      data: {
        name: req.file.filename,
        size: Number(req.file.size),
        fileType: req.file.mimetype,
        folderId: Number(folderId),
      },
    });
    res.redirect(`/folders/${folderId}`);
  },
);

module.exports = foldersRouter;
