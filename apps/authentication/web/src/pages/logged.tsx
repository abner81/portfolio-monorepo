export default function Logged() {
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
      color: '#fff',
    },
    card: {
      background: '#fff',
      color: '#333',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
      //   textAlign: 'center',
    },
    title: {
      fontSize: '24px',
      margin: '0 0 1rem',
    },
    message: {
      fontSize: '16px',
      marginBottom: '1.5rem',
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#2575fc',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Bem-vindo, você está logado!</h1>
        <p style={styles.message}>
          Estamos felizes em tê-lo de volta. Explore o que há de novo em nosso
          sistema.
        </p>
      </div>
    </div>
  );
}
