import Note from '@/db/models/note.model';
import { connectDb } from '@/db/mongodb';
import { currentUser } from '@clerk/nextjs/server';

export const POST = async (req: Request) => {
  const user = await currentUser();
  try {
    await connectDb();
    const data = await req.json();

    if (
      !user ||
      user.publicMetadata.userMongoId !== data.userMongoId ||
      user.publicMetadata.isAdmin !== true
    ) {
      return new Response('Unauthorized', {
        status: 401,
      });
    }
    const slug = data.title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');

    const newNote = await Note.create({
      userId: user.publicMetadata.userMongoId,
      content: data.content,
      title: data.title,
      image: data.image,
      category: data.category,
      slug,
    });

    await newNote.save();
    return new Response(JSON.stringify(newNote), {
      status: 200,
    });
  } catch (error) {
    console.log('Error creating post:', error);
    return new Response('Error creating post', {
      status: 500,
    });
  }
};
