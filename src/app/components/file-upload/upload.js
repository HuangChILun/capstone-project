import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function FileUpload({ onClose }) {
  const [step, setStep] = useState(1); // Step 1: contract info, Step 2: file upload
  const [contractStartDate, setContractStartDate] = useState('');
  const [contractEndDate, setContractEndDate] = useState('');
  const [serviceProviders, setServiceProviders] = useState([{ provider: '', hours: '' }]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const [fileId,setFileId] = useState(0);

  useEffect(() => {
    const storedToken = Cookies.get('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      setError('No authentication token found. Please log in again.');
    }
  }, []);

  const handleAddProvider = () => {
    setServiceProviders([...serviceProviders, { provider: '', hours: '' }]);
  };

  const handleProviderChange = (index, field, value) => {
    const updatedProviders = serviceProviders.map((provider, i) =>
      i === index ? { ...provider, [field]: value } : provider
    );
    setServiceProviders(updatedProviders);
  };

  const onSubmitContractInfo = async () => {
    const contractData = {
      clientId: 1, // Replace with dynamic clientId if needed
      fileId: fileId,
      contractStartDate,
      contractEndDate,
      serviceProviders,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/contracts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contractData),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Contract information submitted successfully.');
        setStep(2); // Move to step 2 (file upload)
      } else {
        const errorData = await response.json();
        alert(`Failed to submit contract information: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting contract information:', error);
      alert('Error submitting contract information.');
    }
  };

  const onFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('clientId', 1); // Replace with dynamic clientId if needed

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/files/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Send FormData directly
      });

      if (response.ok) {
        const data = await response.json();
        setFileId(data.fileId);
        alert('File uploaded successfully.');
      } else {
        const errorData = await response.json();
        alert(`File upload failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error during file upload:', error);
      alert('Error during file upload.');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.overlayContent}>
        <button style={styles.closeBtn} onClick={onClose}>Close</button>
        
        {step === 1 && (
          <div style={styles.formContainer}>
            <h3 style={styles.title}>Contract Information</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Contract Start Date</label>
              <input
                type="date"
                value={contractStartDate}
                onChange={(e) => setContractStartDate(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Contract End Date</label>
              <input
                type="date"
                value={contractEndDate}
                onChange={(e) => setContractEndDate(e.target.value)}
                style={styles.input}
              />
            </div>
            <h4 style={styles.subTitle}>Service Providers</h4>
            {serviceProviders.map((provider, index) => (
              <div key={index} style={styles.serviceProviderSection}>
                <label style={styles.label}>Service Provider</label>
                <select
                  value={provider.provider}
                  onChange={(e) => handleProviderChange(index, 'provider', e.target.value)}
                  style={styles.select}
                >
                  <option value="">Select Provider</option>
                  <option value="Coordinator">Coordinator</option>
                  <option value="Psychologist">Psychologist</option>
                  <option value="Behavioural Consultant">Behavioural Consultant</option>
                  <option value="SLP">SLP</option>
                  <option value="OT">OT</option>
                  <option value="PT">PT</option>
                  <option value="Aide">Aide</option>
                  <option value="Counselling">Counselling</option>
                  <option value="Community Aide Respite">Community Aide Respite</option>
                </select>

                <label style={styles.label}>Hours</label>
                <input
                  type="number"
                  value={provider.hours}
                  onChange={(e) => handleProviderChange(index, 'hours', e.target.value)}
                  style={styles.input}
                />

                {index === serviceProviders.length - 1 && (
                  <button type="button" onClick={handleAddProvider} style={styles.addButton}>
                    + Add Provider
                  </button>
                )}
              </div>
            ))}
            <button onClick={onSubmitContractInfo} style={styles.submitButton}>
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={styles.formContainer}>
            <h3 style={styles.title}>Contract Upload</h3>
            <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} style={styles.fileInput} />
            <button onClick={onFileUpload} style={styles.submitButton}>Upload</button>
            <button onClick={() => setStep(1)} style={styles.backButton}>Back</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles object
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark semi-transparent background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure it appears above other content
  },
  overlayContent: {
    backgroundColor: '#ffffff', // Light background
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)', // Subtle shadow effect
    width: '500px', // Adjust width as needed
    maxWidth: '90%',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: '#ff5a5a', // Red close button
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    fontSize: '14px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  formContainer: {
    marginTop: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  subTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '10px',
  },
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '10px',
  },
  serviceProviderSection: {
    marginBottom: '15px',
  },
  addButton: {
    padding: '8px 12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
    marginLeft: '10px',
  },
  fileInput: {
    marginTop: '10px',
    marginBottom: '20px',
  },
};
