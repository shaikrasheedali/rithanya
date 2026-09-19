import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import Modal from '../common/Modal';
import { apiRequest } from '../../utils/api';
import { useToast } from '../common/Toast';

export default function CameraConsentModal({ isOpen, onClose, patient, onConsentRecorded }) {
  const { addToast } = useToast();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Start webcam stream when modal opens
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedPhoto(null);
      setCameraError(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    setCapturedPhoto(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // default to back camera for staff pointing to patient
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.warn('Camera access failed, trying user camera fallback:', err.message);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          await videoRef.current.play();
        }
        setCameraActive(true);
      } catch (fallbackErr) {
        setCameraError('Unable to access device camera. Please check camera permissions in your browser.');
        setCameraActive(false);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);

    // Overlay DPDP Act digital watermark
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, height - 60, width, 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Manrope, sans-serif';
    ctx.fillText(`Rithanya Hospital · DPDP Digital Consent: ${patient?.name || 'Patient'} (${patient?.patientCode || 'EMR'})`, 20, height - 34);

    ctx.font = '13px DM Sans, sans-serif';
    ctx.fillStyle = '#df3850';
    ctx.fillText(`Captured: ${new Date().toISOString()} · Statutory DPDP Act Compliance`, 20, height - 14);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPhoto(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const handleSaveConsent = async () => {
    if (!capturedPhoto || !patient) return;
    setSubmitting(true);
    try {
      await apiRequest(`/patients/${patient.id}/consent-photo`, {
        method: 'POST',
        body: JSON.stringify({ photoDataUrl: capturedPhoto })
      });

      addToast('DPDP Patient Digital Consent Signature successfully registered in database!', 'success');
      if (onConsentRecorded) onConsentRecorded(capturedPhoto);
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to save consent signature', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Digital Consent Photo Capture (DPDP Act 2023)"
      size="lg"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          {capturedPhoto && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveConsent}
              disabled={submitting}
            >
              <CheckCircle size={16} />
              <span>{submitting ? 'Storing Signature...' : 'Confirm & Save Consent'}</span>
            </button>
          )}
        </>
      }
    >
      <div className="camera-consent-container">
        <div className="dpdp-legal-notice">
          <ShieldCheck size={18} style={{ color: 'var(--green)', display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
          <strong>DPDP Act Section 6 Compliance:</strong> Point device camera to patient to record verified digital biometric consent for diagnostic, EMR, and daycare transfusion care.
        </div>

        {cameraError ? (
          <div style={{ textAlign: 'center', padding: '30px 20px', background: 'var(--red-50)', borderRadius: 12 }}>
            <AlertTriangle size={36} style={{ color: 'var(--red-700)', marginBottom: 10 }} />
            <p style={{ color: 'var(--red-900)', fontWeight: 600 }}>{cameraError}</p>
            <button type="button" className="btn btn-outline btn-sm" onClick={startCamera} style={{ marginTop: 14 }}>
              <RefreshCw size={14} /> Retry Camera
            </button>
          </div>
        ) : (
          <div className="camera-preview-frame">
            {capturedPhoto ? (
              <img src={capturedPhoto} alt="Captured Patient Consent" />
            ) : (
              <video ref={videoRef} autoPlay playsInline muted />
            )}

            <div className="camera-watermark">
              <span>{patient?.name || 'Patient'} · {patient?.patientCode || ''}</span>
              <span>LIVE DPDP STREAM</span>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div className="camera-controls">
          {!capturedPhoto && cameraActive && (
            <button
              type="button"
              className="shutter-btn"
              onClick={capturePhoto}
              title="Click photo to record consent"
            >
              <Camera size={28} />
            </button>
          )}

          {capturedPhoto && (
            <button type="button" className="btn btn-secondary" onClick={handleRetake}>
              <RefreshCw size={16} />
              <span>Retake Photo</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
