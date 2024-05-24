const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const data = {
    username: {
        type: String,
        required: [true, 'Name field is required'],
        maxLength: [25, 'Name lenght should be below 25 charactor'],
        minLenght: [2, 'Name lenght should be above 2 charactor'],
        trim: true,
    },
    // phonenumber: {
    //     type: String,
    //     required: [true, 'Phonenumber field is required'],
    //     unique:[true,'{VALUE} is already exist'],
    //     trim: true,
    // validate: {
    //     validator: function(v) {
    //       return /\d{3}-\d{3}-\d{4}/.test(v);
    //     },
    //     message: props => `${props.value} is not a valid phone number!`
    //   },
    // },
    // email: {
    //     type: String,
    //     required: [true, 'Email field is required'],
    //     unique:[true,'{VALUE} is already exist'],
    //     trim: true,
    // },
    password: {
        type: String,
        required: [true, 'Password field is required'],
        required: true,
        trim: true,
    },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],

    tokens: {
        type: [String]
    }
}

const userSchema = mongoose.Schema(data, { timestamps: true })
userSchema.plugin(AutoIncrement, { id: 'user_seq', inc_field: 'id' });

module.exports = mongoose.model('User', userSchema);
