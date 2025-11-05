module.exports = function makeDownloadUrl(url) {
  const uploadStr = "/upload/";
  const parts = url.split(uploadStr);
  if (parts.length !== 2) return url;

  const tranformation = `fl_attachment/`;

  return parts[0] + uploadStr + tranformation + parts[1];
};
