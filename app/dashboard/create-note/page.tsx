'use client';

import dynamic from 'next/dynamic';
import { useUser } from '@clerk/nextjs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileInput } from '@/components/file-input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';

// https://dev.to/a7u/reactquill-with-nextjs-478b
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function CreateNotePage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  if (!isLoaded) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);

    // Simulating file upload process
    try {
      // In a real application, you would send the file to your server or a file storage service here
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating network request
      console.log('File uploaded successfully:', file.name);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // if (isSignedIn && user?.publicMetadata.isAdmin) {
  //   return <div>CreatePostPage</div>;
  // } else {
  //   return (
  //     <h1 className='text-2xl text-center font-semibold my-7'>
  //       You are not authorized to view this page
  //     </h1>
  //   );
  // }

  return isSignedIn && user?.publicMetadata.isAdmin ? (
    <div className='p-3 max-w-4xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a note</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <Input
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
          />
          <Select>
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='Select a category' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select a category</SelectLabel>
                <SelectItem value='software-development'>
                  Software Development
                </SelectItem>
                <SelectItem value='personal-development'>
                  Personal Development
                </SelectItem>
                <SelectItem value='productivity'>Productivity</SelectItem>
                <SelectItem value='health'>Health</SelectItem>
                <SelectItem value='finance'>Finance</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='flex gap-4 items-center border border-indigo-900 p-3 rounded-md relative'>
          <FileInput onFileSelect={handleFileSelect} />
          <Button
            type='button'
            size='icon'
            className='bg-gradient-to-br from-indigo-400 to-indigo-700 text-white absolute top-11 left-[310px]'
            disabled={!file || uploading}
          >
            <UploadCloud className='h-4 w-4' />
          </Button>
        </div>
        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
        />
        <Button
          type='submit'
          className='bg-gradient-to-br from-indigo-400 to-indigo-700 text-white'
        >
          {uploading ? 'Publishing...' : 'Publish'}
        </Button>
      </form>
    </div>
  ) : (
    <h1 className='text-3xl mt-20 text-center font-semibold my-7'>
      You are not authorized to view this page
    </h1>
  );
}
