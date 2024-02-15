const { mongoose, Schema } = require("mongoose");

const taskSchema = new mongoose.Schema({
  person: {
    type: Schema.Types.ObjectId,
    ref: "Guest",
  },
  task: {
    type: [String],
  },
});

const Task = mongoose.model("Task", taskSchema);
module.exports = { Task };
