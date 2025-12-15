import express from 'express';

const router = express.Router();

// Menu data (same as frontend)
const menuItems = [
  {
    id: 'koshary',
    name: 'Koshary',
    description: 'Egypt\'s beloved national dish - layers of rice, macaroni, lentils, chickpeas, and crispy onions topped with spicy tomato sauce',
    price: 14.99,
    category: 'mains',
    image: '/images/koshary.jpg',
    popular: true,
    vegetarian: true
  },
  {
    id: 'fattah',
    name: 'Fattah',
    description: 'Traditional festive dish with crispy bread, rice, and tender meat in garlic vinegar sauce',
    price: 18.99,
    category: 'mains',
    image: '/images/fattah.jpg',
    popular: true
  },
  {
    id: 'fattah-kawarae',
    name: 'Fattah with Kawarae',
    description: 'Classic fattah topped with succulent lamb trotters, slow-cooked to perfection',
    price: 22.99,
    category: 'mains',
    image: '/images/fattah_w_kawaarea.jpg'
  },
  {
    id: 'macarona-bechamel',
    name: 'Macarona Bechamel',
    description: 'Egyptian-style baked pasta with creamy bechamel sauce and seasoned ground beef',
    price: 16.99,
    category: 'mains',
    image: '/images/macarona_bechamel.jpg',
    popular: true
  },
  {
    id: 'golden-crunch',
    name: 'Golden Crunch Platter',
    description: 'Crispy fried chicken pieces with Egyptian spices, served with tahini sauce',
    price: 15.99,
    category: 'mains',
    image: '/images/golden_crunch_.jpg'
  },
  {
    id: 'grilled-mix',
    name: 'Mixed Grill Platter',
    description: 'Assortment of grilled kebabs, kofta, and chicken with rice and grilled vegetables',
    price: 24.99,
    category: 'grills',
    image: '/images/grilled_section_part_1.jpg',
    popular: true
  },
  {
    id: 'mahshi-peppers',
    name: 'Mahshi Peppers',
    description: 'Bell peppers stuffed with seasoned rice, herbs, and tomato sauce',
    price: 13.99,
    category: 'vegetarian',
    image: '/images/stuffed_vegetables_part_1.jpg',
    vegetarian: true
  },
  {
    id: 'mahshi-zucchini',
    name: 'Mahshi Zucchini',
    description: 'Tender zucchini stuffed with herbed rice in tomato broth',
    price: 13.99,
    category: 'vegetarian',
    image: '/images/stuffed_vegetables_part_2.jpg',
    vegetarian: true
  },
  {
    id: 'mahshi-eggplant',
    name: 'Mahshi Eggplant',
    description: 'Baby eggplants stuffed with spiced rice and slow-cooked in tomato sauce',
    price: 14.99,
    category: 'vegetarian',
    image: '/images/stuffed_vegetables_part_3.jpg',
    vegetarian: true
  },
  {
    id: 'mahshi-grape-leaves',
    name: 'Stuffed Grape Leaves',
    description: 'Delicate grape leaves wrapped around herbed rice with lemon',
    price: 12.99,
    category: 'vegetarian',
    image: '/images/stuffed_vegetables_part_4___5.jpg',
    vegetarian: true
  },
  {
    id: 'mahshi-cabbage',
    name: 'Mahshi Cabbage Rolls',
    description: 'Cabbage leaves rolled with seasoned rice and cooked in tangy tomato broth',
    price: 12.99,
    category: 'vegetarian',
    image: '/images/stuffed_vegetables_part_4___5.jpg',
    vegetarian: true
  }
];

const categories = [
  { id: 'all', name: 'All Items' },
  { id: 'mains', name: 'Main Dishes' },
  { id: 'grills', name: 'Grills' },
  { id: 'vegetarian', name: 'Vegetarian' }
];

// @route   GET /api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', (req, res) => {
  const { category, popular } = req.query;
  
  let items = [...menuItems];
  
  if (category && category !== 'all') {
    items = items.filter(item => item.category === category);
  }
  
  if (popular === 'true') {
    items = items.filter(item => item.popular);
  }
  
  res.json({
    success: true,
    count: items.length,
    items
  });
});

// @route   GET /api/menu/categories
// @desc    Get menu categories
// @access  Public
router.get('/categories', (req, res) => {
  res.json({
    success: true,
    categories
  });
});

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get('/:id', (req, res) => {
  const item = menuItems.find(i => i.id === req.params.id);
  
  if (!item) {
    return res.status(404).json({ 
      success: false, 
      message: 'Menu item not found' 
    });
  }
  
  res.json({
    success: true,
    item
  });
});

export default router;
