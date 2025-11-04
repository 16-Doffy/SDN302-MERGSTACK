import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 3, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Members', required: true },
  },
  { timestamps: true }
);

const perfumeSchema = new mongoose.Schema(
  {
    perfumeName: { type: String, required: true },
    uri: { type: String, required: true },
    price: { type: Number, required: true },
    concentration: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: String, required: true },
    volume: { type: Number, required: true },
    targetAudience: { type: String, required: true },
    comments: [commentSchema],
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brands', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Perfumes', perfumeSchema);


