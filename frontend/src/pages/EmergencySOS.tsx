import { useState, useEffect } from 'react';
import { AlertTriangle, Phone, MapPin, Camera, Clock, Send, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmergencyReport {
  id: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  description: string;
  severity: 'critical' | 'urgent' | 'moderate';
  timestamp: Date;
  status: 'pending' | 'dispatched' | 'rescued' | 'cancelled';
  reporterName: string;
  reporterPhone: string;
  images: string[];
}

const EMERGENCY_HOTLINE = '1-800-DOG-HELP';

export default function EmergencySOS() {
  const [step, setStep] = useState<'alert' | 'form' | 'success'>('alert');
  const [isEmergency, setIsEmergency] = useState(false);
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'critical' | 'urgent' | 'moderate'>('urgent');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [recentReports, setRecentReports] = useState<EmergencyReport[]>([]);

  // Auto-countdown for emergency declaration
  useEffect(() => {
    if (isEmergency && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isEmergency && countdown === 0) {
      setStep('form');
    }
  }, [isEmergency, countdown]);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCoordinates(coords);
          // Reverse geocoding would go here in production
          setLocation(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingLocation(false);
          alert('Unable to get location. Please enter manually.');
        }
      );
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setImages([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newReport: EmergencyReport = {
      id: Date.now().toString(),
      location,
      coordinates: coordinates || undefined,
      description,
      severity,
      timestamp: new Date(),
      status: 'pending',
      reporterName,
      reporterPhone,
      images
    };

    setRecentReports([newReport, ...recentReports]);
    setStep('success');

    // Reset form
    setTimeout(() => {
      setIsEmergency(false);
      setStep('alert');
      setCountdown(5);
      setLocation('');
      setCoordinates(null);
      setDescription('');
      setSeverity('urgent');
      setReporterName('');
      setReporterPhone('');
      setImages([]);
    }, 5000);
  };

  const declareEmergency = () => {
    setIsEmergency(true);
  };

  const cancelEmergency = () => {
    setIsEmergency(false);
    setCountdown(5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-red-900/20 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'alert' && (
            <motion.div
              key="alert"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              {/* Header */}
              <div className="mb-8">
                <motion.div
                  animate={{ rotate: isEmergency ? [0, -10, 10, -10, 10, 0] : 0 }}
                  transition={{ duration: 0.5, repeat: isEmergency ? Infinity : 0, repeatDelay: 1 }}
                  className="inline-block"
                >
                  <AlertTriangle className={`w-24 h-24 mx-auto mb-4 ${isEmergency ? 'text-red-600' : 'text-orange-500'}`} />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Emergency SOS
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  For life-threatening situations requiring immediate rescue assistance
                </p>
              </div>

              {!isEmergency ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8"
                >
                  {/* Emergency Criteria */}
                  <div className="mb-8 text-left">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      When to Use Emergency SOS:
                    </h2>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Critical Injury:</strong> Dog with severe wounds, bleeding, or trauma</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Immediate Danger:</strong> Dog in traffic, drowning, or life-threatening situation</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Severe Illness:</strong> Unable to move, seizures, or unconscious</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Trapped:</strong> Dog stuck in dangerous location needing urgent extraction</span>
                      </li>
                    </ul>
                  </div>

                  {/* Emergency Hotline */}
                  <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Phone className="w-6 h-6 text-red-600 dark:text-red-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">24/7 Emergency Hotline</span>
                    </div>
                    <a href={`tel:${EMERGENCY_HOTLINE}`} className="text-3xl font-bold text-red-600 dark:text-red-400 hover:underline">
                      {EMERGENCY_HOTLINE}
                    </a>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <button
                      onClick={declareEmergency}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-lg text-xl font-bold transition-all transform hover:scale-105 shadow-lg"
                    >
                      <AlertTriangle className="w-6 h-6 inline-block mr-2" />
                      DECLARE EMERGENCY
                    </button>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      This will alert our nearest rescue team immediately
                    </p>
                  </div>

                  {/* Regular Report Link */}
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Not an emergency? Use regular reporting:
                    </p>
                    <button className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                      Go to Regular Dog Report →
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-600 text-white rounded-xl shadow-xl p-8"
                >
                  <AlertTriangle className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                  <h2 className="text-3xl font-bold mb-4">EMERGENCY DECLARED</h2>
                  <p className="text-xl mb-6">Preparing emergency report form...</p>
                  <div className="text-6xl font-bold mb-4">{countdown}</div>
                  <button
                    onClick={cancelEmergency}
                    className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Cancel Emergency
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
                {/* Form Header */}
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="bg-red-600 text-white p-3 rounded-full">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Emergency Report Form</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fill in details quickly for fastest response</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Severity Level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Severity Level *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['critical', 'urgent', 'moderate'] as const).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setSeverity(level)}
                          className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                            severity === level
                              ? level === 'critical'
                                ? 'bg-red-600 text-white'
                                : level === 'urgent'
                                ? 'bg-orange-600 text-white'
                                : 'bg-yellow-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Location *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter address or landmark"
                        required
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <MapPin className="w-5 h-5" />
                      </button>
                    </div>
                    {coordinates && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        ✓ GPS coordinates captured
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Emergency Description *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the emergency situation in detail..."
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Photos */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Photos (Optional but recommended)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <label className="cursor-pointer">
                        <span className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                          Upload photos
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      {images.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                          {images.map((img, idx) => (
                            <img key={idx} src={img} alt={`Upload ${idx + 1}`} className="w-20 h-20 object-cover rounded" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reporter Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Your Phone *
                      </label>
                      <input
                        type="tel"
                        value={reporterPhone}
                        onChange={(e) => setReporterPhone(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep('alert')}
                      className="flex-1 py-4 px-6 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                    >
                      <Send className="w-5 h-5 inline-block mr-2" />
                      SEND EMERGENCY ALERT
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                >
                  <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Emergency Alert Sent!
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Our nearest rescue team has been notified and will respond immediately.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Expected response time: <strong>15-30 minutes</strong>
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    You will receive a call at <strong>{reporterPhone}</strong>
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-600 dark:text-gray-400">
                    Please stay near the location if safe to do so.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Redirecting to dashboard in 5 seconds...
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Emergency Reports */}
        {recentReports.length > 0 && step === 'alert' && !isEmergency && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Emergency Reports</h3>
            <div className="space-y-3">
              {recentReports.slice(0, 3).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      report.severity === 'critical' ? 'bg-red-500' :
                      report.severity === 'urgent' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{report.location}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {report.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    report.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    report.status === 'dispatched' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    report.status === 'rescued' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {report.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
