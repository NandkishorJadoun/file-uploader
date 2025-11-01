module.exports = function makeDownloadUrl(url, filename) {
  const uploadStr = "/upload/";
  const parts = url.split(uploadStr);
  if (parts.length !== 2) return url;

  const tranformation = `fl_attachment:${filename}/`;

  return parts[0] + uploadStr + tranformation + parts[1];
};
