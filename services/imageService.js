const multer = require("multer");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");
const path = require("path");
const fse = require("fs-extra");

const { HttpError } = require("../utils");

class ImageService {
  static initUpdateImageMiddleware(name) {
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, callback) => {
      if (file.mimetype.startsWith("image/")) {
        callback(null, true);
      } else {
        callback(new HttpError(400, "Please,upload images"), false);
      }
    };

    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single("avatar");
  }

  static async saveImage(file, options, ...pathSegments) {
    if (
      file.size >
      (options?.maxFileSize
        ? options.maxFileSize * 1024 * 1024
        : 1 * 1024 * 1024)
    ) {
      throw new HttpError(400, "File is too large!");
    }

    const fileName = `${nanoid()}.jpeg`;
    const fullFilePath = path.join(process.cwd(), "public", ...pathSegments);

    await fse.ensureDir(fullFilePath);

    Jimp.read(file.buffer)
      .then((image) => {
        return image
          .resize(250, 250)
          .quality(60)
          .write(path.join(fullFilePath, fileName));
      })
      .catch((err) => {
        console.log(err);
      });

    return path.join(...pathSegments, fileName);
  }
}

module.exports = ImageService;
