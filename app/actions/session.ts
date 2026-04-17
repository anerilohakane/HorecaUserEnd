'use server';

import { cookies } from 'next/headers';

// ---- AUTHENTICATION SESSION ----

export async function setAuthSession(token: string, user: any) {
  console.log("🔐 [Session] Setting Auth Session for User:", user?.id || user?._id || user?.phone);
  const cookieStore = await cookies();
  
  // Set Token Cookie
  cookieStore.set('unifoods_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });

  // Set User Cookie (can be read by client components for basic ID data if needed, but keeping HttpOnly is safer)
  cookieStore.set('unifoods_user', JSON.stringify(user), {
    httpOnly: false, // We often need to parse this quickly on client without calling context if doing initial hydration, though Context usually calls getAuthSession
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });
}

export async function getAuthSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('unifoods_token')?.value || null;
  const userStr = cookieStore.get('unifoods_user')?.value || null;
  
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error("Failed to parse user session", e);
    }
  }

  return { token, user };
}

export async function clearAuthSession() {
  console.log("🔓 [Session] Clearing Auth Session");
  const cookieStore = await cookies();
  cookieStore.delete('unifoods_token');
  cookieStore.delete('unifoods_user');
}

// ---- ORDER CHECKOUT SESSION ----

export async function setOrderSession(orderId: string, orderData: any) {
  const cookieStore = await cookies();
  
  // Storing lastOrderId
  cookieStore.set('lastOrderId', orderId, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 1 day
    path: '/',
  });

  // Optional: Storing full order data if the page heavily relies on it
  if (orderData) {
    cookieStore.set('lastOrder', JSON.stringify(orderData), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 1 day
        path: '/',
    });
  }
}

export async function getOrderSession() {
  const cookieStore = await cookies();
  const lastOrderId = cookieStore.get('lastOrderId')?.value || null;
  const lastOrderStr = cookieStore.get('lastOrder')?.value || null;

  let lastOrder = null;
  if (lastOrderStr) {
    try {
      lastOrder = JSON.parse(lastOrderStr);
    } catch (e) {
        console.error("Failed to parse order session", e);
    }
  }

  return { lastOrderId, lastOrder };
}

export async function clearOrderSession() {
  const cookieStore = await cookies();
  cookieStore.delete('lastOrderId');
  cookieStore.delete('lastOrder');
}
