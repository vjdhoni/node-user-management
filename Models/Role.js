const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const data = {
    name: {
        type: String,
        required: [true, 'Name field is required'],
        trim: true,
    },
    permissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Permission'
        }
    ]
}

const roleSchema = mongoose.Schema(data, { timestamps: true })
roleSchema.plugin(AutoIncrement, { id: 'role_seq', inc_field: 'id' });

module.exports = mongoose.model('Role', roleSchema)