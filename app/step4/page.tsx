'use client';

import { useState } from 'react';

const demo = { source: 'Instagram', intent: 'Save / recovery', category: 'Dresses', product: 'Luna Satin Dress', size: 'M', colour: 'Black', budget: 'KWD 45–70' };

export default function Step4() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saved, setSaved] = useState(false);

  return <main className="shell"><header className="header"><div className="brand">THE CLOSET</div><div className="demo">STEP 4 · LEAD CAPTURE</div></header><section className="layout"><div className="panel" style={{padding:24}}><div className="chat-title">Revenue recovery</div><p className="online">Customer has shown purchase intent. Capture the contact before the enquiry disappears.</p><div className="status" style={{marginTop:24}}>{Object.entries(demo).map(([k,v])=><div className="row" key={k}><span>{k}</span><span>{v}</span></div>)}</div><div className="followup" style={{marginTop:20}}><strong>Recovery sequence</strong><div>✓ Recommendation delivered</div><div>→ 2h product reminder</div><div>→ 24h follow-up</div><div>→ 72h final recommendation</div></div></div><aside className="panel side"><h3>Capture contact</h3><div className="capture"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Customer name" /><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="WhatsApp / phone" /><button onClick={()=>{if(name.trim()&&phone.trim())setSaved(true)}}>Save lead & schedule follow-up</button></div>{saved&&<div className="followup"><strong>✓ Lead captured</strong><div>{name} · {phone}</div><div>2h → 24h → 72h recovery scheduled</div></div>}<div className="note">Demo data only. No real customer information is stored or messaged.</div></aside></section></main>;
}
