const express = require("express");
const bodyParser = require("body-parser");
const todoRouter = require("./routes/todos");
const authRouter = require("./routes/auth");
const app = express();
const port = process.env.PORT || 3000;
const sequelize = require('./models/sequelize');
const Task = require('./models/task');

app.use(bodyParser.json());
app.use("/auth", authRouter);
app.use("/todos", todoRouter);

// Sync Sequelize models with the database
sequelize.sync()
  .then(() => {
    console.log('Database synced');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

  sequelize.sync().then(() => {
    console.log('Database synced');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }).catch(err => {
    console.error('Error syncing database:', err);
  });


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
