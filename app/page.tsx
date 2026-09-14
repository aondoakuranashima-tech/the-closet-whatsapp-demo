'use client';

import { useMemo, useState } from 'react';

type Message = { from: 'bot' | 'user'; text: string };

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

const initialLead: Lead = {
  source: 'Instagram', intent: 'Browsing', category: '—', product: '—', size: '—',
  colour: '—', budget: '—', status: 'New lead', followUp: 'Not scheduled'
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Hi 👋 Welcome to The Closet! How can we help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [source, setSource] = useState('Instagram');
  const [lead, setLead] = useState(initialLead);

  const options = useMemo(() => {
    const last = messages[messages.length - 1]?.text ?? '';
    if (last.includes('Browse')) return ['Dresses', 'Tops', 'Blazers', 'Pants', 'Two-piece sets', 'New arrivals'];
    return replies;
  }, [messages]);

  function send(text: string) {
    if (!text.trim()) return;
    const value = text.trim();
    setMessages((m) => [...m, { from: 'user', text: value }]);
    setInput('');
    const lower = value.toLowerCase();
    let response = 'Perfect. Tell me what you are looking for and I’ll narrow it down without making you fill out a form.';
    let patch: Partial<Lead> = { status: 'Qualified', followUp: 'Ready' };

    if (lower.includes('browse') || ['dresses','tops','blazers','pants','two-piece sets','new arrivals'].includes(lower)) {
      response = lower === 'browse styles' ? 'Absolutely. What would you like to browse?' : `Great choice. I can help you find the best ${value.toLowerCase()} options. What size should I look for?`;
      patch = { intent: 'Browse', category: value === 'Browse styles' ? '—' : value, status: 'Qualifying' };
    } else if (lower.includes('find')) {
      response = 'Sure. Try something like “black dress”, “office outfit”, “birthday outfit”, or “two-piece set”.';
      patch = { intent: 'Product discovery', status: 'Qualifying' };
    } else if (lower.includes('order')) {
      response = 'I can help with an existing order or get you ready for checkout. What do you need help with?';
      patch = { intent: 'Order help', status: 'Human handoff' };
    } else if (lower.includes('talk')) {
      response = 'Got it. I’ll route this to a team member so the customer gets a human response.';
      patch = { intent: 'Human support', status: 'Human handoff' };
    } else if (lower.includes('black') || lower.includes('dress') || lower.includes('office') || lower.includes('birthday')) {
      response = 'I found a few relevant styles. In the full version, I would now show 3 products with price, image, View product, Buy now, Ask a question, and Save for later.';
      patch = { intent: 'Product discovery', product: '3 relevant styles', status: 'Recommendation ready', followUp: '2h recovery if no action' };
    }

    setLead((l) => ({ ...l, source, ...patch }));
    setTimeout(() => setMessages((m) => [...m, { from: 'bot', text: response }]), 250);
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
            {messages.map((message, i) => <div key={i} className={`bubble ${message.from}`}>{message.text}</div>)}
            <div className="quick">{options.map((option) => <button key={option} onClick={() => send(option)}>{option}</button>)}</div>
          </div>
          <form className="composer" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type what you’re looking for…" />
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
          <div className="note">Sales demo only. Product data, prices and automation states are illustrative and not affiliated with The Closet.</div>
        </aside>
      </section>
    </main>
  );
}
