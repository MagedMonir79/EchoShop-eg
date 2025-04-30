import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanLine, Camera, X, RefreshCw } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
  className?: string;
}

export function QRScanner({ onScan, className = '' }: QRScannerProps) {
  const { t } = useTranslation();
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // In a real implementation, we would use a library like react-qr-reader
  // For this demo, we're simulating a scan after a delay
  const handleStartScan = () => {
    setIsScanning(true);
    setErrorMessage(null);
    
    // Simulate requesting camera permission
    setTimeout(() => {
      // For demo purposes, we'll just simulate a successful permission
      setHasPermission(true);
      
      // Simulate scanning success after 3 seconds
      setTimeout(() => {
        setIsScanning(false);
        // Call the onScan callback with a sample QR data
        onScan("PKG12345678");
      }, 3000);
    }, 1000);
  };
  
  const handleStopScan = () => {
    setIsScanning(false);
  };
  
  const handleRetry = () => {
    setHasPermission(null);
    setErrorMessage(null);
    handleStartScan();
  };
  
  return (
    <Card className={`overflow-hidden border border-gray-700 ${className}`}>
      <CardHeader className="bg-mediumBlue">
        <CardTitle className="text-lg font-bold">{t('qrScanner.title')}</CardTitle>
        <CardDescription>{t('qrScanner.instructions')}</CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 flex flex-col items-center">
        <div className="w-full aspect-square bg-gray-900 relative mb-4 rounded-lg overflow-hidden flex items-center justify-center">
          {isScanning ? (
            <>
              {/* Simulated scanner UI */}
              <div className="relative w-full h-full">
                {/* Placeholder camera feed (gray background) */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-950 flex items-center justify-center">
                  <Camera className="h-16 w-16 text-gray-700 animate-pulse" />
                </div>
                
                {/* Scanner animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-primary rounded-lg relative">
                    {/* Scanning line animation */}
                    <div className="absolute inset-x-0 h-0.5 bg-primary top-1/2 transform -translate-y-1/2 animate-bounce">
                      <ScanLine className="h-6 w-6 text-primary absolute -top-3 left-1/2 transform -translate-x-1/2" />
                    </div>
                    
                    {/* Corner highlights */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                  </div>
                </div>
                
                {/* Stop button */}
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="absolute top-2 right-2 rounded-full p-1 h-8 w-8 flex items-center justify-center"
                  onClick={handleStopScan}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              {hasPermission === false && (
                <div className="text-center p-4">
                  <div className="text-red-500 mb-2">{t('qrScanner.noCameraAccess')}</div>
                  <Button onClick={handleRetry} className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    {t('retry')}
                  </Button>
                </div>
              )}
              
              {errorMessage && (
                <div className="text-center p-4">
                  <div className="text-red-500 mb-2">{errorMessage}</div>
                  <Button onClick={handleRetry} className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    {t('retry')}
                  </Button>
                </div>
              )}
              
              {hasPermission !== false && !errorMessage && (
                <div className="flex items-center justify-center p-10">
                  <Camera className="h-16 w-16 text-gray-700" />
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-700 pt-3 pb-3">
        {!isScanning && (
          <Button 
            onClick={handleStartScan} 
            className="w-full bg-primary hover:bg-lime-500 text-black"
            disabled={isScanning}
          >
            {t('qrScanner.startScanning')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}