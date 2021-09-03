// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// import ApiPromise from '@polkadot/api'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if (req.aborted) void 0;
  res.status(200).json({ name: 'Ada Lovelace' })
}
 
// // import withSession from "../../lib/session";

// export default withSession(async (req, res) => {
//   const user = req.session.get("user");

//   if (user) {
//     // in a real world application you might read the user id from the session and then do a database request
//     // to get more information on the user if needed
//     res.json({
//       isLoggedIn: true,
//       ...user,
//     });
//   } else {
//     res.json({
//       isLoggedIn: false,
//     });
//   }
// });