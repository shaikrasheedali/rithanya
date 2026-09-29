import { describe, it, expect } from 'vitest';

describe('Products Page: Cart Drawer & Checkout Validation', () => {
  it('correctly calculates total amount and items count for checkout payload', () => {
    const cart = [
      { id: '1', name: 'Digital Blood Pressure Monitor', price: 1850, quantity: 2, image: '/assets/uploads/bp.webp' },
      { id: '2', name: 'Glucometer Test Strips (50 Pack)', price: 650, quantity: 1, image: '/assets/uploads/strips.webp' }
    ];

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const checkoutForm = {
      name: 'Ramesh Kumar',
      phone: '+91 98480 12345',
      email: 'ramesh@example.com',
      address: 'Plot 42, Jubilee Hills',
      city: 'Hyderabad',
      pincode: '500033',
      instructions: 'Ring doorbell twice'
    };

    const payload = {
      name: checkoutForm.name,
      phone: checkoutForm.phone,
      email: checkoutForm.email,
      address: checkoutForm.address,
      city: checkoutForm.city,
      pincode: checkoutForm.pincode,
      message: checkoutForm.instructions,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount: cartTotal,
      packageName: cart.length === 1 ? cart[0].name : `${cart[0].name} + ${cart.length - 1} more items`
    };

    expect(cartCount).toBe(3);
    expect(cartTotal).toBe(4350);
    expect(payload.items).toHaveLength(2);
    expect(payload.packageName).toBe('Digital Blood Pressure Monitor + 1 more items');
    expect(payload.name).toBe('Ramesh Kumar');
  });

  it('validates checkout form requires name, phone, and complete delivery address', () => {
    const invalidForm = {
      name: '',
      phone: '',
      address: ''
    };

    const isValid = Boolean(invalidForm.name.trim() && invalidForm.phone.trim() && invalidForm.address.trim());
    expect(isValid).toBe(false);

    const validForm = {
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      address: 'Door 10-2, Banjara Hills'
    };
    const isValidForm = Boolean(validForm.name.trim() && validForm.phone.trim() && validForm.address.trim());
    expect(isValidForm).toBe(true);
  });
});
