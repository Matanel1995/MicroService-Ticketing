import mongoose from "mongoose";

// Interface that describe the propeties
//that requierd for creating a new user
interface UserAttrs{
    email: string;
    password: string;
}

// Interface that describe the propeties
// that requierd for Yser Model 
interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs: UserAttrs): UserDoc;
}

// Interface that dsescribes the properrties 
// that User Document has
interface UserDoc extends mongoose.Document{
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        typr: String,
        required: true
    }
});
// with userSchema.statics.build i add function called build to the user schema
userSchema.statics.build = (attrs: UserAttrs) =>{
    return new User(attrs); 
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

const user = User.build({
    email: 'test@test.com',
    password: 'password'
});



export {User};