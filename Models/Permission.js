const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const data = {
    name: {
        type: String,
        required: [true, 'Name field is required'],
        unique:[true,'{VALUE} is already exist'],
        trim: true,
    }
}

const permissionSchema = mongoose.Schema(data, { timestamps: true })
permissionSchema.plugin(AutoIncrement, { id: 'permission_seq', inc_field: 'id' });

module.exports = mongoose.model('Permission', permissionSchema)