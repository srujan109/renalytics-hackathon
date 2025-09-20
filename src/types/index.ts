export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor' | 'radiologist';
  createdAt: string;
}

export interface ScanType {
  id: string;
  name: string;
  description: string;
  icon: string;
  supportedFormats: string[];
  processingTime: number;
  color: string;
}

export interface DetectionResult {
  id: string;
  scanType: string;
  findings: {
    detected: boolean;
    confidence: number;
    size?: number;
    location?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    count?: number;
  };
  recommendations: string[];
  processedImageUrl: string;
  reportGenerated: string;
  technicalDetails: {
    resolution: string;
    processingTime: number;
    algorithm: string;
  };
}

export interface ScanHistory {
  id: string;
  userId: string;
  scanType: string;
  fileName: string;
  uploadDate: string;
  result: DetectionResult;
  status: 'processing' | 'completed' | 'failed';
}