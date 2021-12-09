const mongoose = require("mongoose");
const validator = require("mongoose-validator");
const bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

const userSchema = new Schema(
  {
      profileImg:{type:String},
      password: {
          type: String,
          minlength: 8,
          required: true,
      },
      name: {
          type: String,
          required: true,
          trim: true,
      },
     email: {
       type: String,
       required: true,
       unique: true,
       validate: [
        validator({
          validator: "isEmail",
          message: "Oops..please enter valid email",
        }),
       ],
     },
     locations: {
       type: Schema.Types.ObjectId,
       ref: 'Address',
      
     }

   
  },
);
userSchema.statics.findAndValidate = async function (email, password) {
    const user = await this.findOne({email: email}).populate('locations')
    
    if(!user) {
        return null;
    }
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
}
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})
module.exports = mongoose.model("User", userSchema);
