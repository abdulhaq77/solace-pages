import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";

dotenv.config();

// Helper function to generate slugs manually for bulk inserts
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");
};

const initialCategories = [
  {
    name: "Fantasy",
    description:
      "Immersive tales of magic, mythical beasts, epic quests, and wondrous alternate realms.",
    image: "",
  },
  {
    name: "Sci-Fi",
    description:
      "Futuristic explorations of space travel, advanced technologies, dystopian societies, and time loops.",
    image: "",
  },
  {
    name: "Romance",
    description:
      "Heartwarming and emotional journeys of passion, deep connection, relationships, and destiny.",
    image: "",
  },
  {
    name: "Mystery & Thriller",
    description:
      "Suspenseful page-turners filled with dark secrets, detective investigations, and unexpected twists.",
    image: "",
  },
  {
    name: "Historical Fiction",
    description:
      "Richly detailed narratives transporting readers back to defining epochs and historical eras.",
    image: "",
  },
  {
    name: "Literary Fiction",
    description:
      "Character-driven storytelling focusing on deep themes, introspection, and stylistic prose.",
    image: "",
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/solace-page";
    await mongoose.connect(mongoUri);
    console.log("📦 Connected to MongoDB for category seeding...");

    // Clear existing categories
    await Category.deleteMany({});
    console.log("🗑️ Cleared existing categories.");

    // Map categories to explicitly include generated slugs (since insertMany bypasses pre-save hooks)
    const categoriesWithSlugs = initialCategories.map((cat) => ({
      ...cat,
      slug: generateSlug(cat.name),
    }));

    // Insert seeded categories
    const createdCategories = await Category.insertMany(categoriesWithSlugs);
    console.log(
      `✨ Successfully seeded ${createdCategories.length} categories!`,
    );

    createdCategories.forEach((cat) => {
      console.log(`   - [${cat.name}] -> Slug: /${cat.slug}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  }
};

export { seedDatabase };
