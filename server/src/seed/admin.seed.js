import User from "../models/User.js";

export const createAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@solacepage.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        name: "Solace Admin",
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || "AdminSecure123!",
        role: "admin",
      });
      console.log(`Default Admin account created: ${adminEmail}`);
    }
  } catch (error) {
    console.error("Error seeding admin account:", error.message);
  }
};
