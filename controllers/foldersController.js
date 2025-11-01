const { PrismaClient } = require("@prisma/client");
const uploadOnCloudinary = require("../services/cloudinary");
const makeDownloadUrl = require("../utils/download");
const prisma = new PrismaClient();

const createFolderPost = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  await prisma.folder.create({
    data: { name, userId },
  });

  res.redirect("/");
};

const viewFolder = async (req, res) => {
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
};

const updateFolderGet = async (req, res) => {
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
};

const updateFolderPost = async (req, res) => {
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
};

const deleteFolderPost = async (req, res) => {
  const { folderId } = req.params;

  await prisma.folder.delete({
    where: {
      id: Number(folderId),
    },
  });

  res.redirect("/");
};

const uploadFilePost = async (req, res) => {
  const { folderId } = req.params;
  const uploadResult = await uploadOnCloudinary(req.file.path);

  const downloadUrl = makeDownloadUrl(
    uploadResult.url,
    uploadResult.original_filename,
  );

  await prisma.post.create({
    data: {
      name: uploadResult.original_filename,
      size: uploadResult.bytes,
      view_url: uploadResult.url,
      download_url: downloadUrl,
      folderId: Number(folderId),
    },
  });

  res.redirect(`/folders/${folderId}`);
};

module.exports = {
  createFolderPost,
  viewFolder,
  updateFolderGet,
  updateFolderPost,
  deleteFolderPost,
  uploadFilePost,
};
