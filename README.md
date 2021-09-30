## Polkadot Scanner Server


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


## Getting Started

First, ensure you have a `.env.local` file in the project directory with these contents.

```env
SECRET_COOKIE_PASSWORD='2gyZ3GDw3LHZQKDhPmPDL3sjREVRXPr8'
SECRET_u8a='248,184,9,213,71,133,129,213,122,191,201,202,7,112,99,210,50,119,130,162,134,99,246,180,93,135,182,9,210,217,1,254'
NONCE='239,191,61,41,3,17,203,156,37,199,164,3,166,148,199,162,10,214,76,99,74,127,254,243'
ENCRYPTED_PASS='198,134,210,34,146,50,19,72,75,254,47,146,252,99,79,194,238,206,159,56,173,247,39,69,71,117,230,7,121,95'
```

Save `.env.local`;

---

Now, ask Yarn to get your dependencies:

```bash
yarn 
```

---

Finally, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. This is the login page.

---

## Production Build

```bash
yarn build
```



