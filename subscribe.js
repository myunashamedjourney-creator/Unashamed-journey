import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Email service is not configured.' });
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!valid) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }

  try {
    const existing = await resend.contacts.get({ email });

    if (existing?.data && !existing?.error) {
      return res.status(200).json({ ok: true, alreadySubscribed: true });
    }

    const created = await resend.contacts.create({
      email,
      unsubscribed: false,
      segmentIds: ['380b148f-6aab-4919-a7f9-1abfb9d2463e'],
    });

    if (created?.error) {
      throw new Error(created.error.message || 'Unable to create contact.');
    }

    const started = await resend.events.send({
      event: 'uj.reset.started',
      email,
      payload: { source: 'website' },
    });

    if (started?.error) {
      throw new Error(started.error.message || 'Unable to start the Reset.');
    }

    return res.status(200).json({ ok: true, alreadySubscribed: false });
  } catch (error) {
    console.error('UJ reset signup error', error);
    return res.status(500).json({ error: 'Unable to start the Reset right now.' });
  }
}
