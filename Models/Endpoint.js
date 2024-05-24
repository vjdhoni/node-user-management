const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const data = {
    path: {
        type: String,
        required: [true, 'Name field is required'],
        maxLength: [25, 'Name lenght should be below 25 charactor'],
        minLength: [2, 'Name lenght should be above 2 charactor'],
        trim: true,
        unique: [true, 'Path must be unique']
    },
    method: {
        type: String,
        required: [true, 'Type field is required'],
        enum: {
            values: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            message: '{VALUE} is not supported'
        },
        trim: true,
    },
    permissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Permission'
        }
    ]
}

const endpointSchema = mongoose.Schema(data, { timestamps: true })
endpointSchema.plugin(AutoIncrement, { id: 'endpoint_seq', inc_field: 'id' });

module.exports = mongoose.model('Endpoint', endpointSchema)