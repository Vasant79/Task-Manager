const { mongo, default: mongoose } = require("mongoose");

async function dbConnection() {
  try {
    await mongoose.connect(
      "mongodb+srv://vasantnegi7:projectX@cluster0.oqfgkwq.mongodb.net/Task-Manager"
    );
    console.log(`db connected`);
  } catch (err) {
    console.log(`Error at db connection `, err);
  }
}

module.exports = {
  dbConnection,
};
