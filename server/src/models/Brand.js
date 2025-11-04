import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    brandName: String,
  },
  { timestamps: true }
);

export default mongoose.model('Brands', brandSchema);


