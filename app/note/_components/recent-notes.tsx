/* eslint-disable @typescript-eslint/no-explicit-any */
import NoteCard from './note-card';

export default async function RecentNotes({ limit }: { limit: number }) {
  let notes = [];

  try {
    const result = await fetch(process.env.URL + '/api/note/get', {
      method: 'POST',
      body: JSON.stringify({ limit: limit, order: 'desc' }),
      cache: 'no-store',
    });
    const data = await result.json();
    notes = data.notes;
    console.log(notes);
  } catch (error) {
    console.log('Error getting recent notes: ', error);
  }
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 text-3xl font-bold dark:text-gray-200 text-gray-800'>Recent Articles</h1>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {notes &&
          notes.map((note: any) => <NoteCard key={note._id} note={note} />)}
      </div>
    </div>
  );
}
