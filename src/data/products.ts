export const MOCK_PRODUCTS = [
  { sku: "SKU123", name: "Mechanical Keyboard", price: "$99", image: "/keyboard.jpg" },
  { sku: "SKU456", name: "Gaming Mouse", price: "$49", image: "/mouse.jpg" },
  { sku: "SKU789", name: "Monitor", price: "$199", image: "/monitor.jpg" },
];

export type Product = {
  sku: string;
  name: string;
  price: string;
  image: string;
};

export const getProductBySku = (sku: string): Product | undefined => {
  return MOCK_PRODUCTS.find(product => product.sku === sku);
}; 