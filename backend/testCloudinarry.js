require('dotenv').config();
const cloudinary = require('./config/cloudinary');

cloudinary.api.ping((error, result) => {
  if (error) console.error("Erro de conexão:", error);
  else console.log("Conexão OK:", result);
});