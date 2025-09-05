const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {

        const safeName = file.originalname
        .split(".")[0]
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .toLowerCase();

        return {
            folder: "lizzy-moda",
            allowed_formats: ["jpg", "png", "jpeg"],
            public_id: `${safeName}-${Date.now()}`,
        };
    },
});

const upload = multer({ storage: storage });

module.exports = upload;