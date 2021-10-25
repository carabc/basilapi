const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    required: [true, 'Please add a restaurant name.'],
  },
  businessEmail: {
    type: String,
    required: [true, 'Please add a business email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be longer than 20 characters'],
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  menu: [
    {
      entrees: [
        {
          entreeName: String,
          price: Number,
          feedsHowMany: Number,
          calories: Number,
          isGlutenFree: Boolean,
          isVegetarian: Boolean,
        },
      ],
    },
    {
      appetizers: [
        {
          appetizerName: String,
          price: Number,
          feedsHowMany: Number,
          calories: Number,
          isGlutenFree: Boolean,
          isVegetarian: Boolean,
        },
      ],
    },
    {
      drinks: [
        {
          drinkName: String,
          price: Number,
          isAlcoholic: Boolean,
          calories: Number,
          isGlutenFree: Boolean,
          alcoholContent: Number,
        },
      ],
    },
  ],
  averageRating: {
    type: Number,
    min: [1, 'Rating must be atleast 1'],
    max: [5, 'Rating must not be more than 5'],
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Restaurant', Restaurant);
