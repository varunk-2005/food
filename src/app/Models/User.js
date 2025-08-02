import { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";

// Define user schema
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: false, // Set to false to allow Google accounts without passwords
      minlength: [6, "Password must be at least 6 characters"],
    },
    name: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    postalCode: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    admin: {
      type: Boolean,
      default: false, // manually set true for admin users
    },
  },
  { timestamps: true }
);

// Hash password before saving (only if password is modified and present)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Export model
export const User = models.User || model("User", UserSchema);
