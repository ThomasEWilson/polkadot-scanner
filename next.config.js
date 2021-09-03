/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
    async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ]
  },


  

}

// Dont know where this goes

// const CSuspense: FC = memo(({ children }) => {
//   return <Suspense fallback={<PageContentSkeleton />}>{children}</Suspense>;
// });

// CSuspense.displayName = 'Page Suspense';

// const LogoContainer = styled.div``;

// const Logo = styled(_Logo)`
//   margin: 116px auto 24px 25px;
//   @media (max-height: 900px) {
//     margin-top: 56px
//   }
// `;

// const PortfolioContent = memo(() => {
//   const isAppReady = useIsAppReady();
//   const { active } = useAccounts();

//   if (isAppReady) {
//     return <SideBarAccount address={active?.address || ''}
//       name={active?.name} />;
//   }

//   return <span>Portfolio</span>;
// });

// PortfolioContent.displayName = 'PortfolioContent';

// export const sidebarConfig: SidebarConfig = {
//   logo: <LogoContainer><Logo /></LogoContainer>,
//   products: [
//     {
//       icon: <WalletIcon />,
//       name: <PortfolioContent />,
//       path: 'portfolio'
//     },
//     {
//       icon: <LoanIcon />,
//       name: 'Mint kUSD',
//       path: 'vault'
//     },
//     {
//       icon: <SwapIcon />,
//       name: 'Swap',
//       path: 'swap'
//     },
//     {
//       icon: <LiquidIcon />,
//       name: 'Liquid Staking',
//       path: 'homa'
//     },
//     {
//       icon: <EarnIcon />,
//       name: 'Earn',
//       path: 'earn'
//     },
//     {
//       icon: <GovernanceIcon />,
//       name: 'Governance',
//       path: 'governance'
//     },
//     {
//       icon: <ResourcesIcon />,
//       name: 'Resources',
//       path: 'https://wiki.karura.app',
//       isExternal: true
//     }
//   ],
//   socialPlatforms: [
//     {
//       href: 'https://wiki.acala.network/karura/home',
//       icon: <img alt='guide'
//         src={guideDarkIcon} />,
//       name: 'Wiki',
//       rel: 'wiki'
//     },
//     {
//       href: 'https://discord.gg/rCSDmmtYaS',
//       icon: <img alt='discord'
//         src={discordDarkIcon} />,
//       name: 'Email',
//       rel: 'email'
//     },
//     {
//       href: 'https://twitter.com/karuraNetwork',
//       icon: <img alt='twitter'
//         src={twitterDarkIcon} />,
//       name: 'Twitter',
//       rel: 'twitter'
//     }
//   ]
// };