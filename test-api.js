fetch('https://horeca-backend-six.vercel.app/api/products')
  .then(r => r.json())
  .then(j => {
    const products = j.data.items.map(p => ({ name: p.name, hasImage: 'image' in p, imageValue: p.image }));
    console.log(JSON.stringify(products, null, 2));
  })
  .catch(console.error);
