import { NextResponse } from 'next/server';
import { isEmailConfigured } from '../../../lib/email/send';

export async function GET() {
  return NextResponse.json({
    resendConfigured: isEmailConfigured(),
    contactTo: process.env.CONTACT_TO_EMAIL?.trim() || 'info@ramondelpozorott.es',
    fromDomain: process.env.RESEND_FROM_DOMAIN?.trim() || null,
    fromEmail: process.env.CONTACT_FROM_EMAIL?.trim() || null,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://creauna.vercel.app',
  });
}
