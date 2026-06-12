import Link from 'next/link';

export const metadata = { title: 'Checkout — Scopeify' };

export default function PaymentPage() {
  return (
    <section className="bg-[var(--nd)] text-[var(--wh)] min-h-[70vh]">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="text-xs uppercase tracking-widest text-[var(--sv)]">
          Checkout
        </div>
        <h1
          className="mt-4 text-5xl md:text-6xl"
          style={{ fontFamily: 'Bebas Neue, sans-serif' }}
        >
          Almost there
        </h1>
        <p className="mt-6 text-lg text-[var(--sl)]">
          Start with a 14-day free trial — no card required. Create your account
          and choose a plan from your dashboard any time.
        </p>
        <p className="mt-4 text-sm text-[var(--sv)]">
          Backed by our{' '}
          <span className="text-[var(--wh)] font-semibold">
            2-Month 100% Money-Back Guarantee
          </span>{' '}
          — cancel any time within 60 days for a full refund.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <Link
            href="/products"
            className="px-6 py-3 bg-[var(--sv)] text-[var(--nd)] font-semibold hover:bg-[var(--sl)] transition-colors"
          >
            See plans
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 border border-[var(--nm)] text-[var(--sl)] hover:bg-[var(--nm)] transition-colors"
          >
            Start free trial
          </Link>
        </div>
      </div>
    </section>
  );
}
