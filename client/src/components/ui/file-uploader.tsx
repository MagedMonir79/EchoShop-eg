import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Upload as UploadIcon, X as XIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  onUpload: (files: string[]) => void;
  isRTL?: boolean;
}

export function FileUploader({
  accept = '*',
  multiple = false,
  maxFiles = 5,
  maxSize = 5, // 5MB default
  onUpload,
  isRTL = false
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; preview: string; size: number }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFiles = (files: FileList | null): File[] => {
    if (!files || files.length === 0) return [];
    
    const validFiles: File[] = [];
    const errors: string[] = [];
    
    // Check if too many files
    if (multiple && files.length > maxFiles) {
      errors.push(isRTL 
        ? `الحد الأقصى لعدد الملفات هو ${maxFiles}` 
        : `Maximum of ${maxFiles} files allowed`);
      return [];
    }
    
    // Validate each file
    Array.from(files).forEach(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(isRTL 
          ? `الملف ${file.name} أكبر من الحد المسموح به (${maxSize}MB)` 
          : `File ${file.name} exceeds maximum size of ${maxSize}MB`);
        return;
      }
      
      // Check file type if accept is specified
      if (accept !== '*' && !file.type.match(accept.replace(/,|\s/g, '|').replace(/\*/g, '.*'))) {
        errors.push(isRTL 
          ? `نوع الملف ${file.name} غير مدعوم` 
          : `File type of ${file.name} is not supported`);
        return;
      }
      
      validFiles.push(file);
    });
    
    if (errors.length > 0) {
      setError(errors.join('. '));
    } else {
      setError(null);
    }
    
    return validFiles;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const validFiles = validateFiles(e.dataTransfer.files);
    if (validFiles.length > 0) {
      processFiles(validFiles);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const validFiles = validateFiles(e.target.files);
    if (validFiles.length > 0) {
      processFiles(validFiles);
    }
  };

  const processFiles = (files: File[]) => {
    const newUploadedFiles: { name: string; preview: string; size: number }[] = [];
    const fileReaders: FileReader[] = [];
    const fileUrls: string[] = [];

    files.forEach(file => {
      const fileReader = new FileReader();
      
      fileReader.onload = () => {
        const fileUrl = fileReader.result as string;
        fileUrls.push(fileUrl);
        
        newUploadedFiles.push({
          name: file.name,
          preview: file.type.startsWith('image/') ? fileUrl : getFileIcon(file.name),
          size: file.size
        });
        
        if (fileUrls.length === files.length) {
          setUploadedFiles(multiple ? [...uploadedFiles, ...newUploadedFiles] : newUploadedFiles);
          onUpload(multiple ? [...uploadedFiles.map(f => f.preview), ...fileUrls] : fileUrls);
        }
      };
      
      fileReaders.push(fileReader);
      fileReader.readAsDataURL(file);
    });
  };

  const getFileIcon = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return '/icons/pdf.svg';
      case 'doc':
      case 'docx':
        return '/icons/doc.svg';
      case 'xls':
      case 'xlsx':
        return '/icons/xls.svg';
      case 'ppt':
      case 'pptx':
        return '/icons/ppt.svg';
      case 'zip':
      case 'rar':
        return '/icons/zip.svg';
      default:
        return '/icons/file.svg';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / (1024 * 1024) * 10) / 10 + ' MB';
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    onUpload(newFiles.map(f => f.preview));
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 ${
          dragActive ? 'border-primary bg-primary/5' : 'border-border'
        } transition-colors cursor-pointer`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <UploadIcon className="h-8 w-8 text-muted-foreground" />
          <div className="font-medium">
            {isRTL ? 'اسحب وأفلت الملفات هنا أو اضغط للتصفح' : 'Drag & drop files here or click to browse'}
          </div>
          <div className="text-xs text-muted-foreground">
            {isRTL 
              ? `${accept === '*' ? 'جميع أنواع الملفات مدعومة' : `أنواع الملفات المدعومة: ${accept}`}. الحد الأقصى: ${maxSize}MB${multiple ? ` (${maxFiles} ملفات كحد أقصى)` : ''}`
              : `${accept === '*' ? 'All file types supported' : `Supported formats: ${accept}`}. Max size: ${maxSize}MB${multiple ? ` (${maxFiles} files max)` : ''}`}
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className={`text-sm font-medium ${isRTL ? 'text-right' : ''}`}>
            {isRTL ? 'الملفات المحملة:' : 'Uploaded Files:'}
          </div>
          <div className="grid grid-cols-1 gap-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center space-x-2">
                  {file.preview.startsWith('data:image/') ? (
                    <img src={file.preview} alt={file.name} className="h-10 w-10 object-cover rounded-md" />
                  ) : (
                    <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-md">
                      <span className="text-xs uppercase font-bold">
                        {file.name.split('.').pop()}
                      </span>
                    </div>
                  )}
                  <div className={isRTL ? 'mr-2' : 'ml-2'}>
                    <div className="text-sm font-medium truncate max-w-xs">{file.name}</div>
                    <div className="text-xs text-muted-foreground">{formatFileSize(file.size)}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}