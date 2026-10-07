'use client';

import { useMemo, useState } from 'react';
import { products } from '../../data/products';

type Step = 0 | 1 | 2 | 3 | 4 | 5;
type Choice = 'save' | 'buy' | 'ask';

const journey = [
  ['Traffic', 'Instagram'],
  ['Enquiry', 'Black dress for a birthday'],
  ['Qualify', 'Size M'],
  ['Recommend', '3 relevant products'],
  ['Capture', 'Lead saved'],
  ['Recover', '2h → 24h → 72h'],
] as const;

const demoLead = {
  name: 'Sara A.',
  phone: '+965 5XX XXX XX',
  source: 'Instagram',
  category: 'Dresses',
  product: 'Luna Satin Dress',
  size: 'M',
  colour: 'Black',
  budget: 'KWD 45–70',
};

function money(value: number) {
  return `KWD ${value}`;
}

export default function SalesDemo() {
  const [step, setStep] = useState<Step>(0);
  const [choice, setChoice] = useState<Choice | null>(null);

  const recommended = useMemo(() => {
    const scored = products.map((product) => {
      let score = 0;
      if (product.category === 'Dresses') score += 4;
      if (product.colours.includes('Black')) score += 3;
      if (product.tags.includes('birthday outfit')) score += 3;
      if (product.sizes.includes('M')) score += 2;
      return { product, score };
    });
    return scored.sort((a, b) => b.score - a.score).slice(0, 3).map(({ product }) => product);
  }, []);

  const canBack = step > 0;
  const canNext = step < 5;

  function next() {
    if (canNext) setStep((value) => (value + 1) as Step);
  }

  function reset() {
    setStep(0);
    setChoice(null);
  }

  function choose(value: Choice) {
    setChoice(value);
    setStep(4);
  }

  return (
    <main className="shell">
      <header className="header">
        <div>
          <div className="brand">THE CLOSET</div>
          <div style={{ color: 'var(--muted)', fontSize: 11, marginTop: 5 }}>OWNER SALES DEMO</div>
        </div>
        <div className="demo">DEMO MODE · ILLUSTRATIVE DATA</div>
      </header>

      <section style={{ maxWidth: 1180, margin: '0 auto 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16, marginBottom: 10 }}>
          <div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 32, margin: 0 }}>Turn an enquiry into a recoverable lead.</h1>
            <p style={{ color: 'var(--muted)', margin: '8px 0 0', maxWidth: 680, lineHeight: 1.5 }}>
              A 60–90 second walkthrough of the WhatsApp Revenue System: traffic → enquiry → qualification → recommendation → capture → recovery.
            </p>
          </div>
          <button onClick={reset} style={{ border: '1px solid var(--line)', background: 'var(--paper)', borderRadius: 999, padding: '9px 14px' }}>
            Reset demo
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 7 }}>
          {journey.map(([label, detail], index) => {
            const active = index === step;
            const done = index < step;
            return (
              <div key={label} style={{ padding: '10px 9px', border: '1px solid var(--line)', borderRadius: 13, background: active ? '#efe6d8' : 'var(--paper)', opacity: done || active ? 1 : .62 }}>
                <div style={{ fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>{index + 1} · {label}</div>
                <div style={{ fontSize: 11, fontWeight: 600, marginTop: 5 }}>{detail}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="layout">
        <div className="panel">
          <div className="chat-head">
            <div>
              <div className="chat-title">WhatsApp customer journey</div>
              <div className="online">● Live demo simulation</div>
            </div>
            <div className="badge">STEP {step + 1} / 6</div>
          </div>

          <div className="messages">
            {step >= 0 && (
              <>
                <div className="bubble bot">Hi 👋 Welcome to The Closet! How can we help you today?</div>
                <div className="quick">
                  <button onClick={() => setStep(1)}>🛍️ Browse styles</button>
                  <button onClick={() => setStep(1)}>🔎 Find something</button>
                  <button onClick={() => setStep(1)}>📦 Order help</button>
                </div>
              </>
            )}

            {step >= 1 && (
              <>
                <div className="bubble user">I need a black dress for a birthday.</div>
                <div className="bubble bot">Absolutely. What size do you need?</div>
              </>
            )}

            {step >= 2 && (
              <>
                <div className="bubble user">M</div>
                <div className="bubble bot">Perfect. I found a few options in black, suitable for a birthday.</div>
              </>
            )}

            {step >= 3 && (
              <>
                <div className="product-grid">
                  {recommended.map((product) => (
                    <div className="product-card" key={product.id}>
                      <div className="product-image"><span>{product.image}</span></div>
                      <div className="product-info">
                        <div className="product-name">{product.name}</div>
                        <div className="product-meta">{money(product.price)} · Black · M</div>
                        <div className="product-actions">
                          <button onClick={() => choose('save')}>Save</button>
                          <button onClick={() => choose('buy')}>Buy now</button>
                        </div>
                        <button onClick={() => choose('ask')} style={{ width: '100%', marginTop: 6, border: '1px solid var(--line)', background: 'white', borderRadius: 9, padding: 7, fontSize: 10 }}>Ask a question</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {step >= 4 && (
              <>
                <div className="bubble user">{choice === 'buy' ? 'I want to buy this.' : choice === 'ask' ? 'Can I ask a question about this?' : 'Save this for me.'}</div>
                <div className="bubble bot">
                  {choice === 'buy'
                    ? 'Great. Your enquiry is ready for checkout handoff.'
                    : choice === 'ask'
                      ? 'A team member can take over from here.'
                      : 'Done. I’ll keep the enquiry recoverable for follow-up.'}
                </div>
              </>
            )}

            {step >= 5 && (
              <div className="bubble bot">
                ✓ This enquiry is now captured and recoverable. The system can follow up at 2 hours, 24 hours, and 72 hours.
              </div>
            )}
          </div>

          <div className="composer">
            <button onClick={() => setStep((Math.max(0, step - 1)) as Step)} disabled={!canBack} style={{ border: '1px solid var(--line)', background: 'var(--paper)', borderRadius: 999, padding: '0 15px', opacity: canBack ? 1 : .45 }}>Back</button>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: 8, color: 'var(--muted)', fontSize: 12 }}>
              {step === 0 ? 'Start the customer journey' : step === 5 ? 'Demo complete' : 'Advance the owner demo'}
            </div>
            <button onClick={next} disabled={!canNext} style={{ border: 0, borderRadius: 999, padding: '0 18px', background: 'var(--ink)', color: 'white', opacity: canNext ? 1 : .45 }}>
              {step === 0 ? 'Start demo' : canNext ? 'Next' : 'Complete'}
            </button>
          </div>
        </div>

        <aside className="panel side">
          <h3>Lead Recovery</h3>
          <div className="status">
            <div className="row"><span>Status</span><span>{step >= 4 ? 'Lead captured' : 'In conversation'}</span></div>
            <div className="row"><span>Source</span><span>Instagram</span></div>
            <div className="row"><span>Intent</span><span>{choice === 'buy' ? 'Purchase' : choice === 'ask' ? 'Question' : step >= 4 ? 'Save / recovery' : 'Product enquiry'}</span></div>
            <div className="row"><span>Category</span><span>Dresses</span></div>
            <div className="row"><span>Size</span><span>M</span></div>
            <div className="row"><span>Colour</span><span>Black</span></div>
            <div className="row"><span>Customer</span><span>{step >= 4 ? demoLead.name : 'Pending'}</span></div>
          </div>

          <div className="followup" style={{ marginTop: 18, padding: 14, borderRadius: 14, background: step >= 5 ? '#edf1eb' : '#f5efe4', fontSize: 12, lineHeight: 1.7 }}>
            <strong>Recovery sequence</strong>
            <div>{step >= 3 ? '✓ Recommendation delivered' : '○ Recommendation pending'}</div>
            <div>{step >= 5 ? '✓ 2h product reminder' : '○ 2h product reminder'}</div>
            <div>{step >= 5 ? '✓ 24h follow-up' : '○ 24h follow-up'}</div>
            <div>{step >= 5 ? '✓ 72h final recommendation' : '○ 72h final recommendation'}</div>
          </div>

          {step >= 5 && (
            <div style={{ marginTop: 16, padding: 15, borderRadius: 14, border: '1px solid var(--line)', background: 'var(--paper)' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 17 }}>Proof of recovery</div>
              <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--muted)', marginBottom: 0 }}>
                One enquiry that might have disappeared is now a recoverable lead.
              </p>
            </div>
          )}

          <div className="note">
            Demo data only. No real customer information is stored or messaged. Product names, prices, and customer details are illustrative.
          </div>
        </aside>
      </section>
    </main>
  );
}
