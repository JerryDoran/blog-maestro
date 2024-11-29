/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import dynamic from 'next/dynamic';
import { useUser } from '@clerk/nextjs';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '@/firebase.config';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
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
import { AlertCircle, UploadCloud } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';
import { useRouter } from 'next/navigation';

// https://dev.to/a7u/reactquill-with-nextjs-478b
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

type FormData = {
  image?: string;
  content?: string;
  category?: any;
  title?: string;
};

export default function CreateNotePage() {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<
    number | null | boolean
  >(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<FormData>({});
  const [publishError, setPublishError] = useState('');
  const [uploading, setUploading] = useState(false);

  if (!isLoaded) return null;

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  async function handleUploadImage() {
    try {
      if (!file) {
        setImageUploadError('Please select an image file');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(Number(progress.toFixed(0)));
        },
        (error) => {
          console.log(error);
          setImageUploadError('Image upload failed!');

          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      console.log(error);
      setImageUploadError('Something went wrong!');

      setImageUploadProgress(null);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/note/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userMongoId: user?.publicMetadata.userMongoId,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setPublishError(data.message);
        console.log(publishError);
        return;
      }
      if (response.ok) {
        setPublishError('');
        router.push(`/note/${data.slug}`);
      }
    } catch (error) {
      console.log(error);
      setPublishError('Something went wrong!');
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

  console.log(formData);

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
            onChange={(e: any) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
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
            className='bg-gradient-to-br from-indigo-400 to-indigo-700 text-white top-11 left-[310px] flex items-center justify-center absolute'
            size='icon'
            disabled={
              file === null ||
              file === undefined ||
              Number(imageUploadProgress) > 0
            }
            onClick={handleUploadImage}
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={Number(imageUploadProgress)}
                  text={`${imageUploadProgress || 0}%`}
                  className='mt-6 ml-[10px]'
                />
              </div>
            ) : (
              <UploadCloud className='size-16' />
            )}
          </Button>
        </div>

        {imageUploadError && (
          <div className='flex items-center gap-2'>
            <AlertCircle className='size-8 text-red-500' />
            {imageUploadError}
          </div>
        )}
        {formData?.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}

        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
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
