export const menuItems = [
  {
    id: 1,
    name: "Koshary",
    nameAr: "كشري",
    description: "Our signature dish - A hearty mix of rice, pasta, lentils, chickpeas, topped with crispy onions and tangy tomato sauce",
    price: 18.99,
    category: "signature",
    image: "/images/koshary.jpg",
    popular: true
  },
  {
    id: 2,
    name: "Fattah with Lamb",
    nameAr: "فته باللحم الضاني",
    description: "Traditional Egyptian celebration dish with tender lamb, crispy bread, rice, and garlic vinegar sauce",
    price: 32.99,
    category: "fattah",
    image: "/images/fattah.jpg",
    popular: true,
    isNew: true
  },
  {
    id: 3,
    name: "Fattah with Kawarea",
    nameAr: "فته بالكوارع",
    description: "Authentic Egyptian fattah with tender trotters, crispy bread, rice, and traditional tomato garlic sauce",
    price: 29.99,
    category: "fattah",
    image: "/images/fattah_w_kawaarea.jpg",
    isNew: true
  },
  {
    id: 4,
    name: "Macarona Béchamel",
    nameAr: "مكرونة بالبشاميل",
    description: "Creamy baked pasta with rich béchamel sauce, seasoned ground beef - Egyptian comfort food",
    price: 24.99,
    category: "main",
    image: "/images/macarona_bechamel.jpg",
    popular: true
  },
  {
    id: 5,
    name: "Breaded Beef Cutlet",
    nameAr: "بفتيك",
    description: "Golden crispy breaded beef cutlets served on a bed of fresh greens - The Golden Crunch of Egypt",
    price: 26.99,
    category: "golden",
    image: "/images/golden_crunch_.jpg"
  },
  {
    id: 6,
    name: "Kofta",
    nameAr: "كفتة مشوية",
    description: "Perfectly grilled Egyptian kofta kebabs made with seasoned ground beef and aromatic spices",
    price: 22.99,
    category: "grilled",
    image: "/images/grilled_section_part_1.jpg"
  },
  {
    id: 7,
    name: "Stuffed Vine Leaves",
    nameAr: "محشي ورق عنب",
    description: "Delicate vine leaves stuffed with aromatic rice, herbs, and spices - a Mediterranean classic",
    price: 19.99,
    category: "stuffed",
    image: "/images/stuffed_vegetables_part_1.jpg"
  },
  {
    id: 8,
    name: "Stuffed Squash",
    nameAr: "محشي كوسه",
    description: "Tender zucchini stuffed with seasoned rice and herbs, cooked in a savory tomato broth",
    price: 21.99,
    category: "stuffed",
    image: "/images/stuffed_vegetables_part_2.jpg"
  },
  {
    id: 9,
    name: "Stuffed Cabbage",
    nameAr: "محشي كرنب",
    description: "Cabbage rolls filled with spiced rice and herbs, slow-cooked to perfection",
    price: 20.99,
    category: "stuffed",
    image: "/images/stuffed_vegetables_part_3.jpg"
  },
  {
    id: 10,
    name: "Stuffed Eggplant",
    nameAr: "محشي باذنجان",
    description: "Baby eggplants filled with aromatic rice stuffing, cooked in rich tomato sauce",
    price: 21.99,
    category: "stuffed",
    image: "/images/stuffed_vegetables_part_4___5.jpg"
  },
  {
    id: 11,
    name: "Stuffed Peppers",
    nameAr: "محشي فلفل",
    description: "Bell peppers stuffed with seasoned rice and herbs, a colorful Egyptian favorite",
    price: 21.99,
    category: "stuffed",
    image: "/images/stuffed_vegetables_part_4___5.jpg"
  }
];

export const categories = [
  { id: 'all', label: 'All Items' },
  { id: 'signature', label: 'Signature' },
  { id: 'fattah', label: 'Fattah' },
  { id: 'stuffed', label: 'Stuffed Vegetables' },
  { id: 'grilled', label: 'Grilled' },
  { id: 'golden', label: 'Golden Crunch' },
  { id: 'main', label: 'Main Dishes' }
];

export const DELIVERY_FEE = 8.99;
export const TAX_RATE = 0.05; // 5% GST
