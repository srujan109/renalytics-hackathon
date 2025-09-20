import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Upload, 
  FileImage, 
  Brain, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  MapPin, 
  Ruler, 
  Download,
  RefreshCw,
  Eye,
  Zap,
  Menu,
  X
} from 'lucide-react';

import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { ScanTypeSelector } from './components/Dashboard/ScanTypeSelector';
import { ScanHistory } from './components/Dashboard/ScanHistory';
import { UserProfile } from './components/Dashboard/UserProfile';
import { User, ScanType, DetectionResult, ScanHistory as ScanHistoryType } from './types';

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'history' | 'profile'>('scan');

  // Scan state
  const [selectedScanType, setSelectedScanType] = useState<ScanType | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanHistoryType[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Available scan types
  const scanTypes: ScanType[] = [
    {
      id: 'kidney-stone',
      name: 'Kidney Stone Detection',
      description: 'Detect and analyze kidney stones in CT scans and ultrasound images',
      icon: '🫘',
      supportedFormats: ['JPG', 'PNG', 'DICOM'],
      processingTime: 3,
      color: 'blue'
    },
    {
      id: 'lung-nodule',
      name: 'Lung Nodule Detection',
      description: 'Identify pulmonary nodules and assess malignancy risk',
      icon: '🫁',
      supportedFormats: ['JPG', 'PNG', 'DICOM'],
      processingTime: 4,
      color: 'green'
    },
    {
      id: 'brain-tumor',
      name: 'Brain Tumor Detection',
      description: 'Detect and classify brain tumors in MRI scans',
      icon: '🧠',
      supportedFormats: ['JPG', 'PNG', 'DICOM', 'NII'],
      processingTime: 5,
      color: 'purple'
    },
    {
      id: 'bone-fracture',
      name: 'Bone Fracture Analysis',
      description: 'Identify fractures and assess bone integrity',
      icon: '🦴',
      supportedFormats: ['JPG', 'PNG', 'DICOM'],
      processingTime: 2,
      color: 'orange'
    },
    {
      id: 'cardiac',
      name: 'Cardiac Assessment',
      description: 'Analyze heart structure and function',
      icon: '❤️',
      supportedFormats: ['JPG', 'PNG', 'DICOM'],
      processingTime: 4,
      color: 'red'
    },
    {
      id: 'retinal',
      name: 'Retinal Screening',
      description: 'Detect diabetic retinopathy and other eye conditions',
      icon: '👁️',
      supportedFormats: ['JPG', 'PNG'],
      processingTime: 2,
      color: 'indigo'
    }
  ];

  // Load user data and scan history on authentication
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Load mock scan history
      const mockHistory: ScanHistoryType[] = [
        {
          id: '1',
          userId: currentUser.id,
          scanType: 'Kidney Stone Detection',
          fileName: 'kidney_scan_001.jpg',
          uploadDate: '2024-01-15T10:30:00Z',
          status: 'completed',
          result: {
            id: '1',
            scanType: 'kidney-stone',
            findings: {
              detected: true,
              confidence: 0.94,
              size: 8.5,
              location: 'Left kidney, lower pole',
              severity: 'medium'
            },
            recommendations: [
              'Increase water intake to 2-3 liters daily',
              'Consider dietary modifications',
              'Schedule follow-up in 3 months'
            ],
            processedImageUrl: 'https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=800',
            reportGenerated: '2024-01-15T10:33:00Z',
            technicalDetails: {
              resolution: '512x512',
              processingTime: 3.2,
              algorithm: 'U-Net v2.1'
            }
          }
        },
        {
          id: '2',
          userId: currentUser.id,
          scanType: 'Lung Nodule Detection',
          fileName: 'chest_ct_002.dcm',
          uploadDate: '2024-01-10T14:20:00Z',
          status: 'completed',
          result: {
            id: '2',
            scanType: 'lung-nodule',
            findings: {
              detected: false,
              confidence: 0.98,
              severity: 'low'
            },
            recommendations: [
              'Continue regular screening',
              'Maintain healthy lifestyle',
              'Annual follow-up recommended'
            ],
            processedImageUrl: 'https://images.pexels.com/photos/7089033/pexels-photo-7089033.jpeg?auto=compress&cs=tinysrgb&w=800',
            reportGenerated: '2024-01-10T14:24:00Z',
            technicalDetails: {
              resolution: '512x512',
              processingTime: 4.1,
              algorithm: 'ResNet-50'
            }
          }
        }
      ];
      setScanHistory(mockHistory);
    }
  }, [isAuthenticated, currentUser]);

  // Authentication handlers
  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data
      const user: User = {
        id: '1',
        email,
        name: email === 'demo@renalytics.com' ? 'Dr. Sarah Johnson' : 'John Doe',
        role: email === 'demo@renalytics.com' ? 'doctor' : 'patient',
        createdAt: '2024-01-01T00:00:00Z'
      };
      
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (name: string, email: string, password: string, role: 'patient' | 'doctor' | 'radiologist') => {
    setAuthLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const user: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
        createdAt: new Date().toISOString()
      };
      
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSelectedScanType(null);
    setSelectedImage(null);
    setImagePreview('');
    setResult(null);
    setScanHistory([]);
    setActiveTab('scan');
  };

  // Scan processing
  const processImage = useCallback(async (file: File, scanType: ScanType): Promise<DetectionResult> => {
    await new Promise(resolve => setTimeout(resolve, scanType.processingTime * 1000));
    
    const mockResults: DetectionResult[] = [
      {
        id: Date.now().toString(),
        scanType: scanType.id,
        findings: {
          detected: true,
          confidence: 0.94,
          size: 8.5,
          location: scanType.id === 'kidney-stone' ? 'Left kidney, lower pole' : 'Upper lobe, right lung',
          severity: 'medium',
          count: scanType.id === 'kidney-stone' ? 1 : undefined
        },
        recommendations: [
          'Immediate medical consultation recommended',
          'Follow-up imaging in 3 months',
          'Monitor symptoms closely',
          'Consider treatment options'
        ],
        processedImageUrl: 'https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=800',
        reportGenerated: new Date().toISOString(),
        technicalDetails: {
          resolution: '512x512',
          processingTime: scanType.processingTime,
          algorithm: scanType.id === 'kidney-stone' ? 'U-Net v2.1' : 'ResNet-50'
        }
      },
      {
        id: Date.now().toString(),
        scanType: scanType.id,
        findings: {
          detected: false,
          confidence: 0.98,
          severity: 'low'
        },
        recommendations: [
          'No abnormalities detected',
          'Continue regular screening',
          'Maintain healthy lifestyle',
          'Annual follow-up recommended'
        ],
        processedImageUrl: 'https://images.pexels.com/photos/7089033/pexels-photo-7089033.jpeg?auto=compress&cs=tinysrgb&w=800',
        reportGenerated: new Date().toISOString(),
        technicalDetails: {
          resolution: '512x512',
          processingTime: scanType.processingTime,
          algorithm: scanType.id === 'kidney-stone' ? 'U-Net v2.1' : 'ResNet-50'
        }
      }
    ];

    return mockResults[Math.floor(Math.random() * mockResults.length)];
  }, []);

  // File handling
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setResult(null);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const handleAnalyze = useCallback(async () => {
    if (!selectedImage || !selectedScanType) return;

    setIsProcessing(true);
    try {
      const detectionResult = await processImage(selectedImage, selectedScanType);
      setResult(detectionResult);
      
      // Add to scan history
      const newScan: ScanHistoryType = {
        id: Date.now().toString(),
        userId: currentUser!.id,
        scanType: selectedScanType.name,
        fileName: selectedImage.name,
        uploadDate: new Date().toISOString(),
        status: 'completed',
        result: detectionResult
      };
      setScanHistory(prev => [newScan, ...prev]);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedImage, selectedScanType, processImage, currentUser]);

  const handleReset = useCallback(() => {
    setSelectedImage(null);
    setImagePreview('');
    setResult(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Authentication screens
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <Brain className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Renalytics</h1>
            <p className="text-gray-600">Advanced AI-Powered Medical Imaging Platform</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            {authMode === 'login' ? (
              <LoginForm
                onLogin={handleLogin}
                onSwitchToRegister={() => setAuthMode('register')}
                isLoading={authLoading}
              />
            ) : (
              <RegisterForm
                onRegister={handleRegister}
                onSwitchToLogin={() => setAuthMode('login')}
                isLoading={authLoading}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Renalytics</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">AI Medical Imaging</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Real-time Analysis</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gray-100 rounded-full">
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser?.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500">{currentUser?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg border-r border-gray-200 transition-transform duration-300 ease-in-out`}>
          <div className="p-6">
            <nav className="space-y-2">
              <button
                onClick={() => {setActiveTab('scan'); setSidebarOpen(false);}}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'scan' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Zap className="w-5 h-5" />
                <span>New Scan</span>
              </button>
              
              <button
                onClick={() => {setActiveTab('history'); setSidebarOpen(false);}}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'history' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span>Scan History</span>
              </button>
              
              <button
                onClick={() => {setActiveTab('profile'); setSidebarOpen(false);}}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Brain className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-20 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'scan' && (
              <div className="space-y-8">
                {/* Scan Type Selection */}
                <ScanTypeSelector
                  scanTypes={scanTypes}
                  selectedScanType={selectedScanType}
                  onSelectScanType={setSelectedScanType}
                />

                {selectedScanType && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Section */}
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                          <Upload className="w-5 h-5 mr-2 text-blue-600" />
                          Upload {selectedScanType.name}
                        </h2>
                        
                        <div
                          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50 ${
                            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                          }`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          
                          {imagePreview ? (
                            <div className="space-y-4">
                              <img
                                src={imagePreview}
                                alt="Selected"
                                className="w-full h-48 object-cover rounded-lg border border-gray-200"
                              />
                              <p className="text-sm text-gray-600">{selectedImage?.name}</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <FileImage className="w-16 h-16 text-gray-400 mx-auto" />
                              <div>
                                <p className="text-lg font-medium text-gray-700">Drop your scan here</p>
                                <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
                                <div className="flex flex-wrap justify-center gap-1 mt-2">
                                  {selectedScanType.supportedFormats.map((format) => (
                                    <span key={format} className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                      {format}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {selectedImage && (
                          <div className="mt-6 space-y-3">
                            <button
                              onClick={handleAnalyze}
                              disabled={isProcessing}
                              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                            >
                              {isProcessing ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  <span>Analyzing...</span>
                                </>
                              ) : (
                                <>
                                  <Zap className="w-4 h-4" />
                                  <span>Start AI Analysis</span>
                                </>
                              )}
                            </button>
                            
                            <button
                              onClick={handleReset}
                              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                              Reset
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Processing Status */}
                      {isProcessing && (
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
                          <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <div>
                              <h3 className="font-medium text-blue-900">AI Analysis in Progress</h3>
                              <p className="text-sm text-blue-700">Processing {selectedScanType.name.toLowerCase()}...</p>
                            </div>
                          </div>
                          <div className="mt-4 bg-blue-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-2">
                      {result ? (
                        <div className="space-y-6">
                          {/* Detection Status */}
                          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                              <h2 className="text-xl font-semibold text-gray-900">Detection Results</h2>
                              <div className="flex items-center space-x-2">
                                <Eye className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-500">Confidence: {(result.findings.confidence * 100).toFixed(1)}%</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              <div className={`p-4 rounded-lg border ${getSeverityColor(result.findings.severity)}`}>
                                <div className="flex items-center space-x-2 mb-2">
                                  {result.findings.detected ? (
                                    <AlertCircle className="w-5 h-5" />
                                  ) : (
                                    <CheckCircle className="w-5 h-5" />
                                  )}
                                  <span className="font-medium">Detection Status</span>
                                </div>
                                <p className="text-lg font-bold">
                                  {result.findings.detected ? 'Positive' : 'Negative'}
                                </p>
                              </div>

                              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Ruler className="w-5 h-5 text-gray-600" />
                                  <span className="font-medium text-gray-700">Size</span>
                                </div>
                                <p className="text-lg font-bold text-gray-900">
                                  {result.findings.detected && result.findings.size ? `${result.findings.size} mm` : 'N/A'}
                                </p>
                              </div>

                              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center space-x-2 mb-2">
                                  <MapPin className="w-5 h-5 text-gray-600" />
                                  <span className="font-medium text-gray-700">Location</span>
                                </div>
                                <p className="text-sm font-medium text-gray-900">{result.findings.location || 'N/A'}</p>
                              </div>
                            </div>

                            {/* Image Comparison */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="font-medium text-gray-700 mb-3">Original Image</h3>
                                <img
                                  src={imagePreview}
                                  alt="Original scan"
                                  className="w-full h-64 object-cover rounded-lg border border-gray-200"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-700 mb-3">AI Analysis Result</h3>
                                <img
                                  src={result.processedImageUrl}
                                  alt="Processed scan"
                                  className="w-full h-64 object-cover rounded-lg border border-gray-200"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Medical Report */}
                          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Medical Report</h2>
                            
                            <div className="space-y-4">
                              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                                <h3 className="font-medium text-blue-900 mb-2">Clinical Summary</h3>
                                <p className="text-blue-800">
                                  {result.findings.detected
                                    ? `AI analysis has detected abnormalities in the ${selectedScanType.name.toLowerCase()} with ${(result.findings.confidence * 100).toFixed(1)}% confidence. ${result.findings.size ? `Estimated size: ${result.findings.size}mm.` : ''} ${result.findings.location ? `Location: ${result.findings.location}.` : ''}`
                                    : `AI analysis shows no evidence of abnormalities in the ${selectedScanType.name.toLowerCase()}. The scan appears normal with ${(result.findings.confidence * 100).toFixed(1)}% confidence.`
                                  }
                                </p>
                              </div>

                              <div>
                                <h3 className="font-medium text-gray-900 mb-3">Recommendations</h3>
                                <ul className="space-y-2">
                                  {result.recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <span className="text-gray-700">{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-yellow-800">
                                  <strong>Disclaimer:</strong> This AI analysis is for educational and research purposes only. 
                                  Always consult with qualified medical professionals for proper diagnosis and treatment.
                                </p>
                              </div>
                            </div>

                            <div className="mt-6 flex space-x-3">
                              <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                                <Download className="w-4 h-4" />
                                <span>Download Report</span>
                              </button>
                              <button 
                                onClick={handleReset}
                                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                              >
                                <RefreshCw className="w-4 h-4" />
                                <span>New Analysis</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-200 text-center">
                          <span className="text-6xl mb-4 block">{selectedScanType.icon}</span>
                          <h3 className="text-xl font-medium text-gray-700 mb-2">Ready for {selectedScanType.name}</h3>
                          <p className="text-gray-500">
                            Upload a {selectedScanType.name.toLowerCase()} image to begin the automated analysis process.
                            Our AI system will analyze the image and provide detailed results.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <ScanHistory
                history={scanHistory}
                onViewResult={(scan) => {
                  // Switch to scan tab and show result
                  setActiveTab('scan');
                  setResult(scan.result);
                  setSelectedScanType(scanTypes.find(st => st.id === scan.result.scanType) || null);
                }}
              />
            )}

            {activeTab === 'profile' && currentUser && (
              <UserProfile
                user={currentUser}
                onLogout={handleLogout}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;