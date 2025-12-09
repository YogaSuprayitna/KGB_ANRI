import React from 'react';
import { Button, Typography, Space } from 'antd';
import { Home, SearchX, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Gunakan ini untuk navigasi SPA

const { Title, Paragraph } = Typography;

export default function NotFound() {
  const navigate = useNavigate(); // Hook untuk navigasi

  return (
    <div style={styles.container}>
      {/* Inject Keyframes */}
      <style>{cssAnimations}</style>

      <div style={styles.innerWrapper}>
        
        {/* 404 Animation Section */}
        <div style={styles.animationContainer}>
          <Title level={1} style={styles.title404}>404</Title>
          <div style={styles.floatingIcons}>
            <SearchX size={80} color="#ffffff" style={styles.iconOne} />
            <MapPin size={80} color="#ffffff" style={styles.iconTwo} />
          </div>
        </div>

        {/* Content Card */}
        <div style={styles.card}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={2} style={styles.heading}>Halaman Tidak Ditemukan</Title>
            
            <Paragraph style={styles.description}>
              Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
            </Paragraph>

            <Button 
              type="primary" 
              size="large"
              icon={<Home size={20} />}
              onClick={() => navigate('/')} // Ganti window.location.href
              style={styles.button}
            >
              Kembali ke Beranda
            </Button>
          </Space>
        </div>

        {/* Decorative Dots */}
        <div style={styles.dotsContainer}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ ...styles.dot, animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>

      </div>
    </div>
  );
}

// --- Styles Object ---
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 50%, #8398f9 100%)',
    padding: '20px',
    overflow: 'hidden',
  },
  innerWrapper: {
    textAlign: 'center',
    maxWidth: '600px',
    width: '100%',
  },
  animationContainer: {
    position: 'relative',
    marginBottom: '40px',
  },
  title404: {
    fontSize: '180px',
    margin: 0,
    color: 'rgba(255, 255, 255, 0.1)',
    fontWeight: 'bold',
    lineHeight: 1,
    letterSpacing: '-10px',
    userSelect: 'none',
  },
  floatingIcons: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    gap: '40px',
    alignItems: 'center',
  },
  iconOne: {
    animation: 'float 3s ease-in-out infinite',
    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
  },
  iconTwo: {
    animation: 'float 3s ease-in-out infinite 1s',
    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(10px)',
  },
  heading: {
    margin: 0, 
    color: '#667eea' 
  },
  description: {
    fontSize: '16px', 
    color: '#666', 
    marginBottom: '20px'
  },
  button: {
    height: '50px',
    fontSize: '16px',
    borderRadius: '25px',
    background: 'linear-gradient(135deg, #667eea 0%, #748df9 100%)',
    border: 'none',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 40px',
  },
  dotsContainer: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.5)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
};

// --- Global CSS Animations ---
const cssAnimations = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
`;