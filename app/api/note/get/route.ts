import Note from '@/db/models/note.model';
import { connectDb } from '@/db/mongodb';
import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {
  await connectDb();

  const data = await req.json();

  try {
    const startIndex = parseInt(data.startIndex) || 0;
    const limit = parseInt(data.limit) || 9;
    const sortDirection = data.order === 'asc' ? 1 : -1;
    const notes = await Note.find({
      ...(data.userId && { userId: data.userId }),
      ...(data.category && { category: data.category }),
      ...(data.slug && { slug: data.slug }),
      ...(data.noteId && { noteId: data.noteId }),
      ...(data.searchTerm && {
        $or: [
          { title: { $regex: data.searchTerm, $options: 'i' } },
          { content: { $regex: data.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalNotes = await Note.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthNotes = await Note.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return new Response(JSON.stringify({ notes, totalNotes, lastMonthNotes }));
  } catch (error) {
    console.log('Error getting notes:', error);
  }
};
