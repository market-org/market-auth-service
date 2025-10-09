import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, //damit das Passwort nicht standardmäßig zurückgegeben wird
    },
    city: {
      type: String,
      required: true,
    },
    birthday: {
  type: Date,
  required: true
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // يضيف createdAt و updatedAt تلقائيًا
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);



const User = mongoose.model("User", userSchema);
export default User;


