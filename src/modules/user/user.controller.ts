import { Request, Response } from 'express';
import { User } from '../user/user.model';



// Get user profile
const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// Update user profile
const updateUserProfile = async (req: Request, res: Response) => {
  const updates = req.body;

  try {
    const user = await User.findByIdAndUpdate(req.user?.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Update failed', error });
  }
};

export { getUserProfile, updateUserProfile };
