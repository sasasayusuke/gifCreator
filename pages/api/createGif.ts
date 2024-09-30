import { NextApiRequest, NextApiResponse } from 'next';
import { createGif, ImageWithDelay } from '@/lib/gifUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const images: ImageWithDelay[] = req.body.images;
      const gif = await createGif(images);
      res.status(200).json({ gif });
    } catch (error) {
      res.status(500).json({ error: 'GIF作成中にエラーが発生しました' });
    }
  } else {
    res.status(405).json({ error: 'メソッドが許可されていません' });
  }
}