const prisma = require('../config/db');
const { recordAuditLog } = require('../middlewares/auditMiddleware');

async function getExpenses(req, res, next) {
  try {
    const { category, status } = req.query;

    const expenses = await prisma.expense.findMany({
      where: {
        ...(category && { category }),
        ...(status && { status })
      },
      orderBy: { date: 'desc' }
    });

    const categorySummary = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    const totalExpense = expenses.reduce((sum, curr) => sum + curr.amount, 0);

    return res.json({
      success: true,
      data: {
        expenses,
        totalExpense,
        categorySummary
      }
    });
  } catch (err) {
    next(err);
  }
}

async function createExpense(req, res, next) {
  try {
    const { name, category, vendor, amount, date, status, notes } = req.body;

    if (!name || !category || !vendor || !amount) {
      return res.status(400).json({ success: false, message: 'Name, category, vendor, and amount are required' });
    }

    const count = await prisma.expense.count();
    const expenseCode = `EXP-${100 + count + 1}`;

    const expense = await prisma.expense.create({
      data: {
        expenseCode,
        name: name.trim(),
        category,
        vendor: vendor.trim(),
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date(),
        status: status || 'paid',
        notes: notes || null
      }
    });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Staff',
      actorRole: req.user ? req.user.role : 'STAFF',
      action: 'ADD_EXPENSE',
      module: 'FINANCE',
      recordId: expense.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { expenseCode, amount: expense.amount, category }
    });

    return res.status(201).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
}

async function updateExpense(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.id;

    if (updateData.amount !== undefined) updateData.amount = parseFloat(updateData.amount);
    if (updateData.date) updateData.date = new Date(updateData.date);

    const expense = await prisma.expense.update({
      where: { id },
      data: updateData
    });

    return res.json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
}

async function deleteExpense(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.expense.delete({ where: { id } });
    return res.json({ success: true, message: 'Expense record deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense
};
