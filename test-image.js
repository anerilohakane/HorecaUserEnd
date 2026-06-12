const raw = {
  "images": [
    {
      "url": "https://res.cloudinary.com/dqfum2awz/image/upload/v1717900000/placeholder.png",
      "publicId": "placeholder",
      "isMain": true
    }
  ]
};

const image =
      typeof raw.image === 'string'
        ? raw.image
        : Array.isArray(raw.images) && raw.images.length
          ? (raw.images[0].url ?? raw.images[0])
          : '';

console.log(image);
