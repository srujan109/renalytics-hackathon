import React from 'react';
import { ScanType } from '../../types';

interface ScanTypeSelectorProps {
  scanTypes: ScanType[];
  selectedScanType: ScanType | null;
  onSelectScanType: (scanType: ScanType) => void;
}

export const ScanTypeSelector: React.FC<ScanTypeSelectorProps> = ({
  scanTypes,
  selectedScanType,
  onSelectScanType
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Scan Type</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scanTypes.map((scanType) => (
          <button
            key={scanType.id}
            onClick={() => onSelectScanType(scanType)}
            className={`p-6 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
              selectedScanType?.id === scanType.id
                ? `border-${scanType.color}-500 bg-${scanType.color}-50`
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-lg bg-${scanType.color}-100`}>
                <span className="text-2xl">{scanType.icon}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{scanType.name}</h3>
                <p className="text-sm text-gray-500">~{scanType.processingTime}s processing</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{scanType.description}</p>
            
            <div className="flex flex-wrap gap-1">
              {scanType.supportedFormats.map((format) => (
                <span
                  key={format}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {format}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
      
      {selectedScanType && (
        <div className={`mt-6 p-4 rounded-lg bg-${selectedScanType.color}-50 border border-${selectedScanType.color}-200`}>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{selectedScanType.icon}</span>
            <span className={`font-medium text-${selectedScanType.color}-800`}>
              {selectedScanType.name} Selected
            </span>
          </div>
          <p className={`text-sm text-${selectedScanType.color}-700 mt-1`}>
            Ready to analyze {selectedScanType.name.toLowerCase()} images
          </p>
        </div>
      )}
    </div>
  );
};