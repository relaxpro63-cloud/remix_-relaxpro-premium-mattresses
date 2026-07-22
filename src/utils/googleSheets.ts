import { submitLead as newSubmitLead } from '../services/leadService';

export async function submitLead(data: any): Promise<boolean> {
  try {
    const result = await newSubmitLead({
      name: data.name,
      phone: data.phone,
      city: data.city,
      source: data.source || 'Website',
      product: data.product,
      size: data.size,
      price: data.price,
      notes: data.notes,
      email: data.email,
      address: data.address,
      orderId: data.orderId,
      contactTime: data.contactTime,
      pincode: data.pincode,
    });
    return result.success;
  } catch {
    return false;
  }
}