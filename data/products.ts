export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  colours: string[];
  sizes: string[];
  tags: string[];
  image: string;
};

export const products: Product[] = [
  { id: 'dress-01', name: 'Satin Evening Dress', category: 'Dresses', price: 39, colours: ['Black', 'Champagne'], sizes: ['XS', 'S', 'M', 'L', 'XL'], tags: ['black dress', 'birthday outfit', 'evening', 'occasion'], image: 'SATIN' },
  { id: 'dress-02', name: 'Sculpted Midi Dress', category: 'Dresses', price: 32, colours: ['Black', 'Ivory'], sizes: ['S', 'M', 'L', 'XL'], tags: ['black dress', 'office outfit', 'midi', 'smart'], image: 'MIDI' },
  { id: 'set-01', name: 'Tailored Two-Piece Set', category: 'Two-piece sets', price: 45, colours: ['Black', 'Mocha'], sizes: ['S', 'M', 'L', 'XL'], tags: ['two-piece set', 'office outfit', 'smart', 'casual'], image: 'SET' },
  { id: 'blazer-01', name: 'Soft Structure Blazer', category: 'Blazers', price: 29, colours: ['Black', 'Stone'], sizes: ['S', 'M', 'L'], tags: ['office outfit', 'blazer', 'smart', 'black'], image: 'BLAZER' },
  { id: 'top-01', name: 'Silk Touch Blouse', category: 'Tops', price: 24, colours: ['Ivory', 'Black'], sizes: ['XS', 'S', 'M', 'L'], tags: ['office outfit', 'casual', 'top'], image: 'BLOUSE' },
  { id: 'pants-01', name: 'Wide-Leg Tailored Pants', category: 'Pants', price: 27, colours: ['Black', 'Mocha'], sizes: ['S', 'M', 'L', 'XL'], tags: ['office outfit', 'casual', 'pants'], image: 'PANTS' },
  { id: 'dress-03', name: 'Weekend Slip Dress', category: 'New arrivals', price: 34, colours: ['Champagne', 'Black'], sizes: ['S', 'M', 'L'], tags: ['casual', 'birthday outfit', 'new arrival'], image: 'SLIP' },
];
