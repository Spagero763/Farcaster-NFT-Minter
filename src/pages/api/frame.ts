import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="og:title" content="Mint your Farcaster NFT" />
        <meta property="og:image" content="https://nft-image-tau.vercel.app/" />
        <meta property="fc:frame:image" content="https://nft-image-tau.vercel.app/" />
        <meta property="fc:frame:button:1" content="Mint NFT" />
        <meta property="fc:frame:button:1:action" content="post_redirect" />
        <meta property="fc:frame:post_url" content="https://farcaster-nft-minter.vercel.app/" />
      </head>
      <body></body>
    </html>
  `);
}
