import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { config } from '../../dapp.config'
import Header from '../components/Header'

const Home: NextPage = () => {
  return (
    <div className="flex h-full min-h-screen w-full flex-col overflow-hidden bg-brand-light">
      <Head>
        <title>{config.title}</title>
        <meta name="description" content={config.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="container mx-auto flex h-full w-full max-w-5xl flex-col items-center pt-4">
        <div className="flex w-full max-w-4xl flex-col items-center">
          <Link href="/mint" passHref>
            <a className="oy-2 mt-16 inline-flex items-center rounded px-6 text-center font-coiny text-sm font-medium uppercase text-rose-500 hover:bg-rose-600 hover:text-white sm:text-2xl md:text-3xl">
              Go to minting page
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 mt-0.5 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </Link>

          <div className="mt-20 flex w-full flex-col items-center space-y-10 md:flex-row md:space-x-16">
            {/* BoredApe Image */}
            <img
              src="/images/9.png"
              className="h-64 w-64 rounded-md object-cover"
            />

            <div className="mt-14 flex flex-col items-center justify-center px-4 py-10 text-center font-coiny text-gray-800 md:items-start md:px-0">
              <h2 className="text-2xl font-bold uppercase md:text-4xl">
                About BoredApes
              </h2>

              <p className="mt-6 text-lg">
                {`BoredApes are a collection of 5,555 burning hot NFTs living in
                the core of the blockchain. Each individual BoredApes is
                carefully curated from over 150 traits, along with some
                incredibly rare 1/1s that have traits that can't be found from
                any other BoredApes. Our vision is to create an amazing project
                that will shed light, joy, love, and creativity! Burn on,
                BoredApes!`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
