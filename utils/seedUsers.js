const path = require("path"); 
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const MONGODB_URI = process.env.MONGODB_URI;

// Check if MongoDB URI exists
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in .env file!");
  process.exit(1);
}

const skillCategories = {
  frontend: ["React", "Vue", "Angular", "HTML", "CSS", "Next.js", "Tailwind"],
  backend: ["Node.js", "Express", "Django", "Spring", "Laravel", "FastAPI"],
  database: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase"],
  devops: ["Docker", "Kubernetes", "AWS", "CI/CD", "Jenkins", "Terraform"],
  ai: ["TensorFlow", "PyTorch", "Machine Learning", "Data Science", "OpenAI"],
  mobile: ["React Native", "Flutter", "Swift", "Kotlin", "Android", "iOS"],
  languages: ["JavaScript", "Python", "Java", "TypeScript", "Go", "Rust"]
};

const firstNames = ["Aman", "Rahul", "Priya", "Sneha", "Arjun", "Neha", "Karan", "Simran", "Rohan", "Aisha", "Vikram", "Divya"];
const lastNames = ["Sharma", "Verma", "Patel", "Singh", "Gupta", "Reddy", "Kumar", "Joshi", "Nair"];

const aboutTemplates = [
  "Full-stack developer passionate about building scalable applications",
  "Frontend enthusiast specializing in modern web technologies",
  "Backend wizard working with microservices and cloud solutions",
  "Mobile app developer creating amazing user experiences",
  "DevOps engineer automating everything possible",
  "Data scientist turning data into actionable insights",
  "AI/ML engineer building intelligent systems",
  "Cybersecurity expert keeping systems safe",
  "Product designer creating user-centered experiences",
  "Game developer crafting immersive experiences"
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSkills() {
  const categories = Object.values(skillCategories);
  const randomSkills = new Set();

  const numberOfSkills = Math.floor(Math.random() * 4) + 3; // 3-6 skills

  while (randomSkills.size < numberOfSkills) {
    const category = getRandomItem(categories);
    randomSkills.add(getRandomItem(category));
  }

  return Array.from(randomSkills);
}

async function seedUsers() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    console.log(`📍 URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***@')}`); // Hide password in log
    
    await mongoose.connect(MONGODB_URI);

    console.log("✅ Connected to MongoDB successfully!");

    // Delete existing users
    const deletedCount = await User.deleteMany({});
    console.log(`🗑️  Deleted ${deletedCount.deletedCount} old users`);

    console.log("👥 Creating 500 users...");
    
    const users = [];

    for (let i = 0; i < 500; i++) {
      const firstName = getRandomItem(firstNames);
      const lastName = getRandomItem(lastNames);
      const gender = getRandomItem(["male", "female", "other"]);

      const hashedPassword = await bcrypt.hash("password123", 10);

      users.push({
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@devsphere.com`,
        password: hashedPassword,
        age: Math.floor(Math.random() * 13) + 22, // 22-34 years
        gender,
        photoUrl: `https://randomuser.me/api/portraits/${gender === 'female' ? 'women' : 'men'}/${(i % 99) + 1}.jpg`,
        about: getRandomItem(aboutTemplates),
        skills: getRandomSkills(),
        isPremium: Math.random() < 0.2 // 20% premium users
      });

      // Show progress
      if ((i + 1) % 100 === 0) {
        console.log(`   Created ${i + 1}/500 users...`);
      }
    }

    await User.insertMany(users);

    console.log("✨ 500 users inserted successfully! 🚀");
    console.log("\n📊 Summary:");
    console.log(`   Total Users: 500`);
    console.log(`   Premium Users: ~${Math.floor(500 * 0.2)}`);
    console.log(`   Password for all: password123`);
    console.log(`   Email format: firstname.lastname{number}@devsphere.com`);

    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
    process.exit(0);

  } catch (error) {
    console.error("\n❌ Error seeding database:");
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error("   MongoDB is not running or unreachable!");
      console.error("   Solutions:");
      console.error("   1. Start MongoDB service: net start MongoDB");
      console.error("   2. Or use MongoDB Atlas (cloud)");
    } else {
      console.error(error);
    }
    
    process.exit(1);
  }
}

seedUsers();