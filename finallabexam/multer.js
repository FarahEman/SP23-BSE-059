const multer = require("multer");
const storage = multer.memoryStorage(); // Or use diskStorage if you prefer

const upload = multer({ storage: storage });

module.exports = upload;
