const { model, Schema } = require('mongoose');

const ProgramSchema = new Schema({
    id: Number,
    name: String,
    exercise: Array,
}, {
    timestamps: ['createdAt', 'updatedAt']
});

const Program = model("Program", ProgramSchema);

module.exports = Program;