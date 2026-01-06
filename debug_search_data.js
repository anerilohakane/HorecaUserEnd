
const API_BASE = "https://horeca-backend-six.vercel.app";

async function testFetch() {
  try {
    const url = `${API_BASE}/api/products?limit=1000`;
    console.log("Fetching: " + url);
    const res = await fetch(url);
    if (!res.ok) {
        console.log("Fetch failed: " + res.status);
        return;
    }
    const data = await res.json();
    
    // mimic logic in Header.tsx
    const products = data.products || data.data || [];
    
    console.log("Total items found: " + products.length);
    
    if (products.length > 0) {
        console.log("First Item Keys: ", Object.keys(products[0]));
        console.log("First Item Sample: ", JSON.stringify(products[0], null, 2));
    } else {
        console.log("No products found in response structure.");
        console.log("Root keys: ", Object.keys(data));
    }
    
  } catch (e) {
    console.error(e);
  }
}

testFetch();
