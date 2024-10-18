"use client"
import FileUpload from '@/app/components/file-upload/upload';
import { Button } from '@/app/components/HomeUi/button';
import React, { useState } from 'react';


export default function TestPage(){
  const [showOverlay, setShowOverlay] = useState(false);

  // Toggle overlay visibility
  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

 return (
    <div>
      <h1>Test Page</h1>
      <button onClick={toggleOverlay}>Open File Upload</button>

      {showOverlay && (
        <div >
          <div >
            <FileUpload />
            <Button onClick={toggleOverlay} style={style.closeBtn}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

const style = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000, // Ensure it appears above other content
    },
    overlayContent: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      minWidth: '300px',
    },
    closeBtn: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: 'red',
      color: 'white',
      cursor: 'pointer',
      padding: '5px 10px',
    }
  };

