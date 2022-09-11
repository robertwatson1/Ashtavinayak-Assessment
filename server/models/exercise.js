const { model, Schema } = require('mongoose');

const ExerciseSchema = new Schema({
    id: Number,
    name: String,
    length: Number,
    // photo: File
}, {
    timestamps: ['createdAt', 'updatedAt']
});

const Exercise = model("Exercise", ExerciseSchema);

module.exports = Exercise;