'use client';

import { useMemo, useState } from 'react';
import { products, Product } from '../data/products';

type Message =
  | { from: 'bot' | 'user'; text: string }
  | { from: 'bot'; products: Product[] };

type Lead = {
  source: string;
  intent: string;
  category: string;
  product: string;
  size: string;
  colour: string;
  budget: string;
  status: string;
  followUp: string;
};

const replies = ['🛍️ Browse styles', '🔎 Find something', '📦 Order help', '👩‍💬 Talk to someone'];
const categories = ['Dresses', 'Tops', 'Blazers', 'Pants', 'Two-piece sets', 'New arrivals'];
const sizes = ['XS', 'S', 'M', 'L', 'XL'];
const colours = ['Black', 'Ivory', 'Champagne', 'Mocha', 'Stone'];

const initialLead: Lead = {
  source: 'Instagram', intent: 'Browsing', category: '—', product: '—', size: '—',
  colour: '—', budget: '—', status: 'New lead', followUp: 'Not scheduled'
};

function findProducts(query: string, lead: Lead) {
  const q = query.toLowerCase();
  let scored = products.map((p) => {
    let score = 0;
    if (p.tags.some((tag) => q.includes(tag) || tag.includes(q))) score += 5;
    if (lead.category !== '—' && p.category.toLowerCase() === lead.category.toLowerCase()) score += 4;
    if (lead.colour !== '—' && p.colours.some((c) => c.toLowerCase() === lead.colour.toLowerCase())) score += 3;
    if (lead.size !== '—' && p.sizes.includes(lead.size)) score += 2;
    return { p, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map(({ p }) => p);
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Hi 👋 Welcome to The Closet! How can we help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [source, setSource] = useState('Instagram');
  const [lead, setLead] = useState(initialLead);
  const [discoveryQuery, setDiscoveryQuery] = useState('');

  const lastBotText = [...messages].reverse().find((m) => m.from === 'bot' && 'text' in m) as Extract<Message, { text: string }> | undefined;
  const options = useMemo(() => {
    const last = lastBotText?.text ?? '';
    if (last.includes('browse')) return categories;
    if (last.includes('size')) return sizes;
    if (last.includes('colour')) return colours;
    return replies;
  }, [lastBotText?.text]);

  function pushBot(text: string) {
    setTimeout(() => setMessages((m) => [...m, { from: 'bot', text }]), 180);
  }

  function showRecommendations(query: string, nextLead: Lead) {
    const recs = findProducts(query, nextLead);
    setMessages((m) => [...m, { from: 'bot', products: recs }]);
    setLead((l) => ({ ...l, product: recs.map((p) => p.name).join(', '), status: 'Recommendation ready', followUp: '2h recovery if no action' }));
  }

  function send(text: string) {
    if (!text.trim()) return;
    const value = text.trim();
    setMessages((m) => [...m, { from: 'user', text: value }]);
    setInput('');
    const lower = value.toLowerCase();

    if (replies.includes(value)) {
      if (value.includes('Browse')) {
        setLead((l) => ({ ...l, intent: 'Browse', status: 'Qualifying' }));
        pushBot('Absolutely. What would you like to browse?');
      } else if (value.includes('Find')) {
        setLead((l) => ({ ...l, intent: 'Product discovery', status: 'Qualifying' }));
        pushBot('Sure. Tell me what you are looking for — for example “black dress”, “office outfit”, “birthday outfit”, or “two-piece set”.');
      } else if (value.includes('Order')) {
        setLead((l) => ({ ...l, intent: 'Order help', status: 'Human handoff' }));
        pushBot('I can help with an existing order or get you ready for checkout. What do you need help with?');
      } else {
        setLead((l) => ({ ...l, intent: 'Human support', status: 'Human handoff' }));
        pushBot('Got it. I’ll route this to a team member so the customer gets a human response.');
      }
      return;
    }

    if (categories.includes(value)) {
      const nextLead = { ...lead, intent: 'Browse', category: value, status: 'Qualifying' };
      setLead(nextLead);
      pushBot(`Great choice. What size should I look for?`);
      return;
    }

    if (sizes.includes(value)) {
      const nextLead = { ...lead, size: value, status: 'Qualifying' };
      setLead(nextLead);
      pushBot('Perfect. Any preferred colour?');
      return;
    }

    if (colours.includes(value)) {
      const nextLead = { ...lead, colour: value, status: 'Recommendation ready' };
      setLead(nextLead);
      const query = discoveryQuery || lead.category;
      showRecommendations(query, nextLead);
      return;
    }

    const recognised = lower.includes('black') || lower.includes('dress') || lower.includes('office') || lower.includes('birthday') || lower.includes('two-piece') || lower.includes('casual');
    if (recognised) {
      setDiscoveryQuery(value);
      const nextLead = { ...lead, intent: 'Product discovery', status: 'Qualifying' };
      setLead(nextLead);
      pushBot('Got it. What size should I look for?');
      return;
    }

    pushBot('I can narrow that down. Tell me the style, occasion, or product you want, plus your size if you know it.');
  }

  function productAction(action: string, product: Product) {
    if (action === 'Buy now') {
      setLead((l) => ({ ...l, product: product.name, intent: 'Purchase', status: 'Checkout handoff', followUp: 'Not needed' }));
      setMessages((m) => [...m, { from: 'bot', text: `Excellent choice. ${product.name} is ready for checkout. In the live version, this button would hand the customer to the store checkout or a sales rep.` }]);
    } else if (action === 'Save for later') {
      setLead((l) => ({ ...l, product: product.name, intent: 'Save / recovery', status: 'Lead captured', followUp: '2h product reminder' }));
      setMessages((m) => [...m, { from: 'bot', text: `Saved ${product.name}. We would capture the customer contact and send a relevant follow-up if they do not complete the purchase.` }]);
    } else {
      setLead((l) => ({ ...l, product: product.name, intent: 'Product question', status: 'Human handoff', followUp: 'Team response' }));
      setMessages((m) => [...m, { from: 'bot', text: `A team member can answer questions about ${product.name}, availability, fit, delivery, or checkout.` }]);
    }
  }

  return (
    <main className="shell">
      <header className="header">
        <div className="brand">THE CLOSET</div>
        <div className="demo">DEMO MODE · WHATSAPP REVENUE SYSTEM</div>
      </header>

      <section className="layout">
        <div className="panel">
          <div className="chat-head"><div><div className="chat-title">Customer concierge</div><div className="online">● Automated + human handoff</div></div><span>⌁</span></div>
          <div className="messages">
            {messages.map((message, i) => message.from === 'bot' && 'products' in message ? (
              <div key={i} className="product-grid">
                {message.products.map((product) => (
                  <article className="product-card" key={product.id}>
                    <div className="product-image"><span>{product.image}</span></div>
                    <div className="product-info"><div className="product-name">{product.name}</div><div className="product-meta">KWD {product.price} · {product.category}</div><div className="product-actions"><button onClick={() => productAction('View', product)}>View</button><button onClick={() => productAction('Buy now', product)}>Buy now</button><button onClick={() => productAction('Ask a question', product)}>Ask</button><button onClick={() => productAction('Save for later', product)}>Save</button></div></div>
                  </article>
                ))}
              </div>
            ) : (
              <div key={i} className={`bubble ${message.from}`}>{'text' in message ? message.text : ''}</div>
            ))}
            <div className="quick">{options.map((option) => <button key={option} onClick={() => send(option)}>{option}</button>)}</div>
          </div>
          <form className="composer" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Try “black dress”, “office outfit”…" />
            <button type="submit">Send</button>
          </form>
        </div>

        <aside className="panel side">
          <h3>Lead Status</h3>
          <div className="status">
            <div className="row"><span>Source</span><span>{lead.source}</span></div>
            <div className="row"><span>Intent</span><span>{lead.intent}</span></div>
            <div className="row"><span>Category</span><span>{lead.category}</span></div>
            <div className="row"><span>Product</span><span>{lead.product}</span></div>
            <div className="row"><span>Size</span><span>{lead.size}</span></div>
            <div className="row"><span>Colour</span><span>{lead.colour}</span></div>
            <div className="row"><span>Budget</span><span>{lead.budget}</span></div>
            <div className="row"><span>Status</span><span className="badge">{lead.status}</span></div>
            <div className="row"><span>Follow-up</span><span>{lead.followUp}</span></div>
          </div>
          <div className="source">
            <label>Traffic source</label>
            <select value={source} onChange={(e) => { setSource(e.target.value); setLead((l) => ({ ...l, source: e.target.value })); }}>
              <option>Instagram</option><option>Google</option><option>Website</option><option>Direct WhatsApp</option>
            </select>
          </div>
          <div className="note">Sales demo only. Product names, prices and automation states are illustrative and not affiliated with The Closet.</div>
        </aside>
      </section>
    </main>
  );
}
