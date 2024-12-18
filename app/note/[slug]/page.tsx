/* eslint-disable @next/next/no-img-element */
import CallToAction from '@/components/call-to-action';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import RecentNotes from '../_components/recent-notes';

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  let note = null;

  try {
    const result = await fetch(process.env.URL + '/api/note/get', {
      method: 'POST',
      body: JSON.stringify({ slug: params.slug }),
      cache: 'no-store',
    });

    const data = await result.json();
    note = data.notes[0];
  } catch (error) {
    console.log('Error getting note:', error);
    note = { title: 'Failed to load note' };
  }

  if (!note || note.title === 'Failed to load note') {
    return (
      <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
        <h2 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
          Note not found
        </h2>
      </main>
    );
  }

  return (
    <main className='p-3 flex flex-col max-w-4xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center max-w-2xl mx-auto lg:text-4xl'>
        {note && note.title}
      </h1>
      <Link
        href={`/search?category=${note && note.category}`}
        className='mt-5 w-full text-center'
      >
        <Button>{note && note.category}</Button>
      </Link>
      <div className='rounded-md'>
        <img
          src={note && note.image}
          alt={note && note.title}
          className='mt-10 max-h-[300px] w-full object-cover border rounded-md'
        />
      </div>

      <div className='flex justify-end gap-4 p-3 border-b border-slate-500 mx-auto w-full max-w-4xl'>
        <span>{note && new Date(note.createdAt).toLocaleDateString()} </span>
        <span className='italic'>
          {note && (note?.content?.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className='p-3 max-w-4xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: note.content }}
      ></div>
      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>
      <RecentNotes limit={3} />
    </main>
  );
}
