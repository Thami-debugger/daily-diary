"use client";
import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';

export default function Journal() {
  const { user, loading, signOut, supabase } = useAuth();
  const [history, setHistory] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD format
    goal: '',
    primary_obj: '',
    secondary_obj: '',
    tertiary_obj: '',
    networking: '',
    gratitude: ''
  });

  // Load history when the page opens and user is authenticated
  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('inserted_at', { ascending: false });
    
    if (!error) setHistory(data);
  };

  const saveEntry = async () => {
    const { error } = await supabase
      .from('entries')
      .upsert([{ ...formData, user_id: user.id }], { onConflict: 'date,user_id' });
    
    if (error) {
      alert(`Error saving: ${error.message}`);
      console.error('Full error:', error);
    } else {
      alert("Saved successfully!");
      fetchHistory(); // Refresh the list after saving
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        color: '#fff'
      }}>
        Loading...
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return <Auth />;
  }

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100vh',
      maxWidth: '100%',
      margin: 0, 
      padding: '20px', 
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      backgroundColor: '#000', 
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px'
      }}>
      {/* Header with sign out button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>📝 My Diary</h1>
        <button 
          onClick={signOut}
          style={{
            padding: '8px 16px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#555'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#333'}
        >
          Sign Out
        </button>
      </div>

      <section style={{ marginBottom: '50px', backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '12px' }}>
        <h2 style={{ marginTop: 0 }}>Tomorrow Planning</h2>
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
          <div key={item.id} style={{ borderBottom: '1px solid #333', padding: '15px 0' }}>
            <h4 
              onClick={() => toggleExpanded(item.id)}
              style={{ 
                margin: '0 0 5px 0', 
                color: '#0070f3',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              {item.date} {expandedItems[item.id] ? '▼' : '▶'}
            </h4>
            {expandedItems[item.id] && (
              <>
                <p style={{ margin: '5px 0' }}><strong>Goal:</strong> {item.goal}</p>
                <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#666' }}>{item.primary_obj} | {item.secondary_obj} | {item.tertiary_obj}</p>
                <p style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>🙏 {item.gratitude}</p>
              </>
            )}
          </div>
        ))}
      </section>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #444',
  fontSize: '16px',
  backgroundColor: '#222',
  color: '#fff'
};
