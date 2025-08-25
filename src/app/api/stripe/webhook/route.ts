import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/app/lib/prisma";

export async function GET() {
  console.log("Stripe webhook endpoint. Use POST.")
  return NextResponse.json(
    {
      status: 200,
      message:
        "Stripe webhook endpoint. Use POST.",
    },
    {
      status: 200,
    }
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  if (!sig) {

    return NextResponse.json(
      {
        status: 404,
        message:
          "Error no stripe signature",
      },
      {
        status: 404,
      }
    );
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET!, {
    apiVersion: '2022-11-15',
  });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new Response('Webhook signature verification failed', { status: 400 });
  }
  console.log(event)
  console.log(event.type)
  if (event.type === 'setup_intent.succeeded') {
    const setupIntent: any = event.data.object;
    const offreId = setupIntent.metadata?.offreId; // à ajouter lors de la création du setupIntent
    if (offreId) {
      await prisma.offre_test.update({
        where: { id: offreId },
        data: {
          hasCard: true,
          stripeIntentId: setupIntent.id,
        },
      });
    }
  }
  return NextResponse.json(
    {
      status: 200,
      message:
        "OK",
    },
    {
      status: 200,
    }
  );
}