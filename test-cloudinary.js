fetch('https://res.cloudinary.com/dqfum2awz/image/upload/v1717900000/placeholder.png')
  .then(r => console.log('Status:', r.status))
  .catch(console.error);
