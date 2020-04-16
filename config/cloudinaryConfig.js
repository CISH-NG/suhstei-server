const cloudinary = require('cloudinary');
require('dotenv').config();
cloudinary.config({
  cloud_name: 'ojay-dev',
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

exports.uploads = (file) => {
  return new Promise(resolve => {
    // cloudinary.image(file, {width: 150, crop: "scale"})
    cloudinary.uploader.upload(file,  (result) => {
      resolve({
        url: result.url,
        id: result.public_id,
      })
    }, {
      resource_type: "auto"
    })
  })
}



