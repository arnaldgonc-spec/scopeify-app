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
          Card payments are coming online shortly. In the meantime, pick a plan
          on the pricing page and we&apos;ll get you set up directly.
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
          <a
            href="mailto:info.scopeify@gmail.com?subject=Scopeify%20subscription"
            className="px-6 py-3 border border-[var(--nm)] text-[var(--sl)] hover:bg-[var(--nm)] transition-colors"
          >
            Email us to subscribe
          </a>
        </div>
      </div>
    </section>
  );
}
