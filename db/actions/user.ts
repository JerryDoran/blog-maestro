import User from '../models/user.model';
import { connectDb } from '../mongodb';
import { EmailAddressJSON } from '@clerk/backend';

export async function createOrUpdateUser(
  id: string,
  first_name: string | null,
  last_name: string | null,
  image_url: string | null,
  email_addresses: EmailAddressJSON[],
  username: string | null
) {
  try {
    await connectDb();
    const user = await User.findOneAndUpdate(
      {
        clerkId: id,
      },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: image_url,
          email: email_addresses[0].email_address,
          username: username,
        },
      },
      { new: true, upsert: true }
    );

    return user;
  } catch (error) {
    console.log('Error creating or updating user', error);
  }
}

export async function deleteUser(id: string) {
  try {
    await connectDb();
    await User.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.log('Error deleting user', error);
  }
}
