export async function sendBookingConfirmation(
  email: string,
  firstName: string,
  service: string,
  location: string,
  date: string,
  time: string
) {
  try {
    const response = await fetch('/api/send-booking-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        firstName,
        service,
        location,
        date,
        time,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send booking confirmation email');
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return { success: false, error };
  }
}

export async function sendAdminNotification(
  bookingData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    service: string;
    location: string;
    date: string;
    time: string;
    notes?: string;
  }
) {
  try {
    const response = await fetch('/api/send-admin-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error('Failed to send admin notification');
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error };
  }
}
