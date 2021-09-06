import withSession from "../../lib/session";
import {
  naclDecrypt,
} from '@polkadot/util-crypto';
import {
  u8aToString,
  stringToU8a,
  isU8a,
  u8aEq
} from '@polkadot/util';

type ResponseData = {
  isLoggedIn: boolean
}

type Data = {
  passwordHash: string
  nonce: string
}

const stringU8A_to_Uint8Array = (str) => {
  const u8a = new Uint8Array(str.split(',').map(x => +x));
  return u8a;
}

export default withSession(async (req, res) => {
  try {
    const { encrypted, nonce } = await req.body;
    const compare = new Uint8Array(Object.values(encrypted))

    const stringu8aEncryptedPass = process.env.ENCRYPTED_PASS ?? '';
    const uint8array_ENCRYPTED_PASS = stringU8A_to_Uint8Array(stringu8aEncryptedPass);
    
    // Instead of decrypting the message, compare Encrypted_u8a hash rather than decrypted data.
    const isMatch = u8aEq(compare, uint8array_ENCRYPTED_PASS)

    if (!isMatch)
      throw { message: 'Unauthorized', status: 401}
    
    //   create user object, set session.user, save it.
    const user = { isLoggedIn: true };
    req.session.set("user", user);
    await req.session.save();
    res.json(user);
  } catch (error) {
    const { message, status } = error;
    res.status(status || 500).json({message});
  }
});







