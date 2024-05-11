const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = 3000;
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create Expense schema
const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  date: String,
});

const Expense = mongoose.model("Expense", expenseSchema);

app.use(bodyParser.json());

// API to get all expenses
app.get("/api/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API to create a new expense
app.post("/api/expenses", async (req, res) => {
  const expense = new Expense({
    title: req.body.title,
    amount: req.body.amount,
    date: req.body.date,
  });

  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API to update an expense
app.put("/api/expenses/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (expense == null) {
      return res.status(404).json({ message: "Expense not found" });
    }
    expense.title = req.body.title;
    expense.amount = req.body.amount;
    expense.date = req.body.date;
    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API to delete an expense
app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const deletedExpense = await Expense.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
