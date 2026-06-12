fetch('https://res.cloudinary.com/dqfum2awz/image/upload/placeholder.png')
  .then(r => console.log('Status without version:', r.status))
  .catch(console.error);
