import React, { ChangeEvent, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export function FileInput({ onFileSelect }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      onFileSelect(file);
    } else {
      alert('Please select a valid image file.');
    }
  };

  return (
    <div className='grid w-full max-w-sm items-center gap-1.5'>
      <Label htmlFor='picture'>Picture</Label>
      <div className='flex items-center gap-4 mt-3'>
        <Input
          id='picture'
          type='file'
          accept='image/*'
          className='cursor-pointer w-72'
          onChange={handleFileChange}
        />
      </div>
      {selectedFile && (
        <p className='text-sm text-muted-foreground mt-2'>
          Selected file: {selectedFile.name}
        </p>
      )}
    </div>
  );
}
