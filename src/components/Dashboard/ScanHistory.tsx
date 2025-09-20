import React from 'react';
import { Calendar, Download, Eye, FileText } from 'lucide-react';
import { ScanHistory as ScanHistoryType } from '../../types';

interface ScanHistoryProps {
  history: ScanHistoryType[];
  onViewResult: (scan: ScanHistoryType) => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({ history, onViewResult }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'processing': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">No Scan History</h3>
        <p className="text-gray-500">Your completed scans will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Scan History</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {history.map((scan) => (
          <div key={scan.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{scan.fileName}</h3>
                  <p className="text-sm text-gray-500">{scan.scanType}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(scan.status)}`}>
                  {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {new Date(scan.uploadDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Detection</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {scan.result.findings.detected ? 'Positive' : 'Negative'}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Severity</p>
                <p className={`text-sm font-medium mt-1 ${getSeverityColor(scan.result.findings.severity)}`}>
                  {scan.result.findings.severity.charAt(0).toUpperCase() + scan.result.findings.severity.slice(1)}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Confidence</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {(scan.result.findings.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {scan.result.findings.location || 'No specific location'}
              </p>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => onViewResult(scan)}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};