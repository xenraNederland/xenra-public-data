import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, inquiryType, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Naam, email en bericht zijn verplicht' });
    }

    // Log the contact submission (in production, this would save to database)
    console.log('Contact form submission:', {
      name,
      email,
      phone: phone || 'Niet opgegeven',
      inquiryType: inquiryType || 'Algemene informatie',
      message,
      timestamp: new Date().toISOString()
    });

    // For now, just return success (in production, implement email sending)
    // You can integrate with email services like SendGrid, Mailgun, or SMTP
    
    return res.status(200).json({ 
      message: 'Bericht succesvol ontvangen',
      success: true 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      message: 'Er is een fout opgetreden bij het versturen van uw bericht' 
    });
  }
}