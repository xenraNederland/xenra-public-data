export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, inquiryType, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Naam, email en bericht zijn verplicht' });
    }

    // In een echte implementatie zou je hier een email service gebruiken
    // Voor nu loggen we de data en sturen een success response
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      inquiryType,
      message,
      timestamp: new Date().toISOString()
    });

    // Simulate email sending to info@xenra.nl
    // In productie zou je hier Sendgrid, Nodemailer of andere email service gebruiken

    return res.status(200).json({ 
      success: true, 
      message: 'Bedankt voor uw bericht. Wij zullen z.s.m. reageren op uw mail.' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden' });
  }
}