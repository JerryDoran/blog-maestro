/* eslint-disable @next/next/no-img-element */
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface NoteCardProps {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  slug: string;
}

export default function NoteCard({ note }: any) {
  return (
    <Link href={`/posts/${note.slug}`} className='group flex h-full w-full'>
      <div className='flex flex-col overflow-hidden rounded-lg shadow-md transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1 w-full dark:border-2'>
        <div className='relative w-full aspect-video'>
          <Image
            src={note.image}
            alt={note.title}
            width={300}
            height={200}
            className='object-cover h-[200px] w-full transition-transform duration-300 ease-in-out group-hover:scale-105'
          />
        </div>
        <div className='bg-white p-4 flex-grow'>
          <h2 className='mb-2 text-xl font-semibold text-gray-800 line-clamp-2'>
            {note.title}
          </h2>
          <p className='mt-auto text-sm text-gray-600'>
            {formatDate(note.date)}
          </p>
        </div>
      </div>
    </Link>
  );
}
