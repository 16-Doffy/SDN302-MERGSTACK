import mongoose from 'mongoose';
import Brand from './src/models/Brand.js';
import Perfume from './src/models/Perfume.js';
import Member from './src/models/Member.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/perfume_db';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Brand.deleteMany({});
    await Perfume.deleteMany({});
    await Member.deleteMany({});

    // Create brands
    const chanel = await Brand.create({ brandName: "Chanel" });
    const dior = await Brand.create({ brandName: "Dior" });
    const tomFord = await Brand.create({ brandName: "Tom Ford" });

    // Create perfumes
    await Perfume.create({
      perfumeName: "Chanel No. 5",
      uri: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300",
      price: 150,
      concentration: "EDP",
      description: "Classic floral fragrance with rose and jasmine",
      ingredients: "Rose, Jasmine, Sandalwood, Vanilla",
      volume: 100,
      targetAudience: "female",
      brand: chanel._id
    });

    await Perfume.create({
      perfumeName: "Sauvage",
      uri: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300",
      price: 120,
      concentration: "EDT",
      description: "Fresh and woody fragrance for men",
      ingredients: "Bergamot, Pepper, Ambergris",
      volume: 100,
      targetAudience: "male",
      brand: dior._id
    });

    await Perfume.create({
      perfumeName: "Black Orchid",
      uri: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=300",
      price: 200,
      concentration: "Extrait",
      description: "Luxurious dark floral fragrance",
      ingredients: "Black Orchid, Dark Chocolate, Patchouli",
      volume: 50,
      targetAudience: "unisex",
      brand: tomFord._id
    });

    // Create admin user
    await Member.create({
      email: "admin@myteam.com",
      password: "admin123",
      name: "Do Nam Trung",
      YOB: 1990,
      gender: true,
      isAdmin: true
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
