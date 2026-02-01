import mongoose, {Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema(
    {
        userName: {
            typr: String,
            required: true,
            unique: true,
            lowerCase: true,
            trim: true,
            index: true

        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowerCase: true,
            trim: true
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        avatar: {
            type: String,   // cloudinary url ka use karenge
            required: true,
        },

        coverImage: {
            type: String,  // cloudinary URL
        },

        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",

            }
        ],

        password: {
            type: String,
            required: [true, "Password is required!"],
        },

        refreshToken: {
            type: String    
        },


    },
    {
        timestamps: true
    }
)


userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    else {
        this.password = bcrypt.hash(this.password, 10)
        next()
    }
    
})

userSchema.method.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function() {
    const ans = jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
    return ans
}

userSchema.methods.refreshToken = function() {
       const ans = jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    return ans
}

export const user = mongoose.model("User", userSchema)

