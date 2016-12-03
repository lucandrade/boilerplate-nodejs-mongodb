import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

UserSchema.pre('save', next => {  // eslint-disable-line
    const user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, (err, salt) => {  // eslint-disable-line
            if (err) {
                return next(err);
            }

            bcrypt.hash(user.password, salt, (err, hash) => {  // eslint-disable-line
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = password =>
    bcrypt.compareSync(password, this.rassword);

export default mongoose.model('User', UserSchema);
