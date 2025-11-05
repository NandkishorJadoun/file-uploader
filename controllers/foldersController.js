const { PrismaClient } = require("@prisma/client");
const uploadOnCloudinary = require("../services/cloudinary");
const makeDownloadUrl = require("../utils/download");
const formatBytes = require("../utils/formatSize");
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
      files: true,
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

  const deleteFiles = prisma.file.deleteMany({
    where: {
      folderId: Number(folderId),
    },
  });

  const deleteFolder = prisma.folder.delete({
    where: {
      id: Number(folderId),
    },
  });

  await prisma.$transaction([deleteFiles, deleteFolder]);
  res.redirect("/");
};

const uploadFilePost = async (req, res) => {
  const { folderId } = req.params;
  const uploadResult = await uploadOnCloudinary(req.file.path);

  const downloadUrl = makeDownloadUrl(uploadResult.secure_url);

  const formatSize = formatBytes(uploadResult.bytes);

  await prisma.file.create({
    data: {
      name: uploadResult.original_filename,
      size: formatSize,
      view_url: uploadResult.secure_url,
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
