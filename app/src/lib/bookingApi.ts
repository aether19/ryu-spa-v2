import { supabase, type Booking } from './supabase';

export async function createBooking(booking: Booking) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          service: booking.service,
          location: booking.location,
          date: booking.date,
          time: booking.time,
          first_name: booking.firstName,
          last_name: booking.lastName,
          phone: booking.phone,
          email: booking.email,
          notes: booking.notes || '',
          stripe_payment_id: booking.stripePaymentId || null,
          total_price: booking.totalPrice || 0,
          status: 'confirmed',
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false, error };
  }
}

export async function getBookingsByEmail(email: string) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('email', email);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return { success: false, error };
  }
}

export async function getAllBookings() {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return { success: false, error };
  }
}
