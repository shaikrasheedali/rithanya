const prisma = require('../config/db');
const { recordAuditLog } = require('../middlewares/auditMiddleware');

// Get all orders / inquiries
async function getInquiries(req, res, next) {
  try {
    const { status, orderStatus } = req.query;
    const inquiries = await prisma.productInquiry.findMany({
      where: {
        ...(status && { status }),
        ...(orderStatus && { orderStatus })
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, data: inquiries });
  } catch (err) {
    next(err);
  }
}

// Public: Place e-commerce Product Order
async function createOrder(req, res, next) {
  try {
    const {
      name,
      phone,
      email,
      address,
      city,
      pincode,
      items,
      totalAmount,
      message,
      packageName,
      packageId
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required to place an order' });
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderCode = `ORD-${randomSuffix}`;

    const itemsList = Array.isArray(items) ? items : [];
    const calculatedTotal = totalAmount || itemsList.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const primaryName = packageName || (itemsList.length > 0 ? itemsList[0].name : 'Healthcare Product Order');

    const newOrder = await prisma.productInquiry.create({
      data: {
        orderCode,
        packageId: packageId || null,
        packageName: primaryName,
        items: itemsList,
        totalAmount: calculatedTotal,
        name: name.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        address: address ? address.trim() : null,
        city: city ? city.trim() : 'Khammam',
        pincode: pincode ? pincode.trim() : null,
        message: message ? message.trim() : null,
        status: 'new',
        orderStatus: 'PENDING'
      }
    });

    recordAuditLog({
      actorName: name,
      actorRole: 'PUBLIC',
      action: 'PLACE_PRODUCT_ORDER',
      module: 'ORDERS',
      recordId: newOrder.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { orderCode, totalAmount: calculatedTotal, itemCount: itemsList.length }
    });

    return res.status(201).json({
      success: true,
      data: newOrder,
      orderCode,
      message: `Order #${orderCode} placed successfully! Our coordinator will contact you to confirm delivery.`
    });
  } catch (err) {
    next(err);
  }
}

// Legacy inquiry support
async function createInquiry(req, res, next) {
  return createOrder(req, res, next);
}

// Update order status / inquiry status
async function updateInquiryStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, orderStatus, followUpNotes } = req.body;

    const inquiry = await prisma.productInquiry.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(orderStatus && { orderStatus }),
        ...(followUpNotes !== undefined && { followUpNotes })
      }
    });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Admin',
      actorRole: req.user ? req.user.role : 'ADMIN',
      action: 'UPDATE_ORDER_STATUS',
      module: 'ORDERS',
      recordId: id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { orderStatus: inquiry.orderStatus, status: inquiry.status }
    });

    return res.json({ success: true, data: inquiry, message: 'Order status updated successfully' });
  } catch (err) {
    next(err);
  }
}

// Delete order / inquiry
async function deleteInquiry(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.productInquiry.delete({ where: { id } });
    return res.json({ success: true, message: 'Order record deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getInquiries,
  createInquiry,
  createOrder,
  updateInquiryStatus,
  deleteInquiry
};
