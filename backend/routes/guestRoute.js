const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { Guest } = require("../models/Guest");
const { Task } = require("../models/Task");
const jwtSecret = "projectX";

const guestRoute = express.Router();

/**
 * problem statement - make signup for guest user
 *
 * core steps :
 * get username & password
 * store it in db
 * generate token
 *
 * additional :
 * validate data
 * check if already exist in db or not
 */

//data validation
const dataSchema = zod.object({
  username: zod.string().min(6),
  password: zod.string().min(3),
});
guestRoute.post("/singup", async function (req, res) {
  //validating date
  const validate = dataSchema.safeParse(req.body);
  console.log(validate);

  if (validate.success == false) {
    return res.status(400).json({ msg: "Invalid data" });
  }

  //getting dat from body
  const { username, password } = req.body;
  console.log("username & password ", username, password);

  //checking & storing it in db

  const check = await Guest.findOne({ username: username, password: password });
  if (check) {
    return res.status(400).json({ msg: "Already a user" });
  }
  const guestObj = await Guest.create({
    username: username,
    password: password,
  });

  const taskObj = await Task.create({
    person: guestObj._id,
    task: [],
  });

  console.log(guestObj);
  const id = guestObj._id;
  const token = jwt.sign({ id }, jwtSecret);

  res.json({ msg: "guest added to db", token });
});

/**
 * problem statement - create a login end point
 * after user sign up he needs to login & get token
 *
 *  core :
 * get data
 * check in db
 *
 * additional :
 * validate
 */

guestRoute.post("/login", async function (req, res) {
  //get data
  const { username, password } = req.body;

  //check with db
  const dbRes = await Guest.findOne({ username: username, password: password });

  if (!dbRes) {
    return res.status(400).json({ msg: "invalid username or password" });
  }

  res.status(200).json({ msg: "Logged in" });
});

/**
 * api end point for that stores data
 *
 * core :
 * body - get a task
 * get that data and push it in task
 *
 */

guestRoute.put("/addtask", async function (req, res) {
  //getting data
  const taskData = req.body.task;
  const token = req.headers.authorization;

  console.log("taskData & token ", taskData, token);

  const userData = jwt.verify(token, jwtSecret);

  //push it to task
  const id = userData.id;
  console.log("userData id ---- ", id);

  /**
   * issue - was updating record that was never created
   * sol - create task record for a user when sign up
   */
  const taskObj = await Task.updateOne(
    { person: id },
    {
      $push: {
        task: taskData,
      },
    }
  );
  console.log("task obj --> ", taskObj);

  res.status(200).json({ msg: " task Updated " });
});

/**
 * problem statement -- make a end point for deleted task
 *
 * core :
 * get todos of the person
 * find which todo to be removed
 */

guestRoute.delete("/delete/todo", async function (req, res) {
  //getting the task of person
  const user = req.headers.authorization;
  console.log("user === ", user);

  //task to delete
  let deleteTask = req.body.task;
  deleteTask = deleteTask.trim();

  console.log("Task to be deleted ", deleteTask);

  const token = jwt.verify(user, jwtSecret);
  console.log("token ----> ", token);

  const id = token.id;
  console.log(id);

  //get all the task of current person
  const allTask = await Task.findOne({ person: id });
  console.log("allTask -- >", allTask.task);

  const updatedTask = allTask.task.filter((eachTask) => {
    return eachTask != deleteTask;
  });

  console.log("updatetd task ---- ", updatedTask);

  await Task.updateOne(
    { person: id },
    {
      $set: { task: updatedTask },
    }
  );

  res.status(200).json({ msg: "deleating task" });
});

module.exports = { guestRoute };
