"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Journal() {
  const [history, setHistory] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD format
    goal: '',
    primary_obj: '',
    secondary_obj: '',
    tertiary_obj: '',
    networking: '',
    gratitude: ''
  });

  // Load history when the page opens
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('inserted_at', { ascending: false });
    
    if (!error) setHistory(data);
  };

  const saveEntry = async () => {
    const { error } = await supabase
      .from('entries')
      .upsert([formData], { onConflict: 'date' });
    
    if (error) {
      alert("Error saving!");
    } else {
      alert("Saved successfully!");
      fetchHistory(); // Refresh the list after saving
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <section style={{ marginBottom: '50px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '12px' }}>
        <h2 style={{ marginTop: 0 }}>📝 Tomorrow Planning</h2>
        <p><strong>Date:</strong> {formData.date}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input placeholder="The Goal (e.g. Build landing page)" onChange={(e) => setFormData({...formData, goal: e.target.value})} style={inputStyle} />
          <input placeholder="Primary Objective" onChange={(e) => setFormData({...formData, primary_obj: e.target.value})} style={inputStyle} />
          <input placeholder="Secondary Objective" onChange={(e) => setFormData({...formData, secondary_obj: e.target.value})} style={inputStyle} />
          <input placeholder="Tertiary Objective" onChange={(e) => setFormData({...formData, tertiary_obj: e.target.value})} style={inputStyle} />
          <input placeholder="Networking Goal" onChange={(e) => setFormData({...formData, networking: e.target.value})} style={inputStyle} />
          <textarea placeholder="One thing I'm grateful for..." onChange={(e) => setFormData({...formData, gratitude: e.target.value})} style={{...inputStyle, height: '80px'}} />
          
          <button onClick={saveEntry} style={{ padding: '12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Save Plan
          </button>
        </div>
      </section>

      <hr />

      <section style={{ marginTop: '40px' }}>
        <h3>History</h3>
        {history.length === 0 ? <p>No entries yet.</p> : history.map((item) => (
          <div key={item.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#0070f3' }}>{item.date}</h4>
            <p style={{ margin: '5px 0' }}><strong>Goal:</strong> {item.goal}</p>
            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#666' }}>{item.primary_obj} | {item.secondary_obj} | {item.tertiary_obj}</p>
            <p style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>🙏 {item.gratitude}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

const inputStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '16px'
};