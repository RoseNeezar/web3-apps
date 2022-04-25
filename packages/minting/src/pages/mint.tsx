import { OnboardAPI } from '@web3-onboard/core'
import { useConnectWallet, useSetChain, useWallets } from '@web3-onboard/react'
import React, { useEffect, useState } from 'react'
import { initOnboard } from '../utils/onboard'
import {
  getTotalMinted,
  getMaxSupply,
  isPausedState,
  isPublicSaleState,
  isPreSaleState,
  presaleMint,
  publicMint,
} from '../utils/interact'
import { config } from '../../dapp.config'

const Mint = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
  const connectedWallets = useWallets()
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalMinted, setTotalMinted] = useState(0)
  const [maxMintAmount, setMaxMintAmount] = useState<any>(0)
  const [paused, setPaused] = useState(false)
  const [isPublicSale, setIsPublicSale] = useState(false)
  const [isPreSale, setIsPreSale] = useState(false)

  const [status, setStatus] = useState<any>(null)
  const [mintAmount, setMintAmount] = useState(1)
  const [isMinting, setIsMinting] = useState(false)
  const [onboard, setOnboard] = useState<OnboardAPI | null>(null)

  useEffect(() => {
    setOnboard(initOnboard)
  }, [])

  useEffect(() => {
    if (!connectedWallets.length) return

    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }) => label
    )
    window.localStorage.setItem(
      'connectedWallets',
      JSON.stringify(connectedWalletsLabelArray)
    )
  }, [connectedWallets])

  useEffect(() => {
    if (!onboard) return

    const previouslyConnectedWallets = JSON.parse(
      window.localStorage.getItem('connectedWallets') as string
    )

    if (previouslyConnectedWallets?.length) {
      const setWalletFromLocalStorage = async () => {
        await connect({
          autoSelect: {
            label: previouslyConnectedWallets[0],
            disableModals: true,
          },
        })
      }
      setWalletFromLocalStorage()
    }
  }, [onboard, connect])

  useEffect(() => {
    const init = async () => {
      setMaxSupply(await getMaxSupply())
      setTotalMinted(await getTotalMinted())

      setPaused(await isPausedState())
      setIsPublicSale(await isPublicSaleState())
      const isPreSale = await isPreSaleState()
      setIsPreSale(isPreSale)

      setMaxMintAmount(
        isPreSale ? config.presaleMaxMintAmount : config.maxMintAmount
      )
    }

    init()
  }, [])

  const incrementMintAmount = () => {
    if (mintAmount < maxMintAmount) {
      setMintAmount(mintAmount + 1)
    }
  }

  const decrementMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1)
    }
  }

  const presaleMintHandler = async () => {
    setIsMinting(true)

    const { success, status } = await presaleMint(mintAmount)

    setStatus({
      success,
      message: status,
    })

    setIsMinting(false)
  }
  const publicMintHandler = async () => {
    setIsMinting(true)

    const { success, status } = await publicMint(mintAmount)

    setStatus({
      success,
      message: status,
    })

    setIsMinting(false)
  }
  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-brand-background ">
      <div className="relative flex h-full w-full flex-col items-center justify-center">
        <img
          src="/images/blur.jpeg"
          className="absolute inset-auto block min-h-screen w-full animate-pulse-slow object-cover"
        />

        <div className="flex h-full w-full flex-col items-center justify-center px-2 md:px-10">
          <div className="z-1 relative flex w-full flex-col items-center rounded-md bg-gray-900/90 py-4 px-2 filter backdrop-blur-sm md:max-w-3xl md:px-10">
            {wallet && (
              <button
                className="font-chalk absolute right-4 rounded-md border-2 border-[rgba(0,0,0,1)] bg-indigo-600 px-4 py-2 text-sm uppercase tracking-wide text-white shadow-[0px_3px_0px_0px_rgba(0,0,0,1)] transition duration-200 ease-in-out active:shadow-none"
                onClick={() =>
                  disconnect({
                    label: wallet.label,
                  })
                }
              >
                Disconnect
              </button>
            )}
            <h1 className="mt-3 bg-gradient-to-br from-brand-green to-brand-blue bg-clip-text font-coiny  text-3xl font-bold uppercase text-transparent md:text-4xl">
              {paused ? 'Paused' : isPreSale ? 'Pre-Sale' : 'Public Sale'}
            </h1>
            <h3 className="text-sm tracking-widest text-pink-200">
              {wallet?.accounts[0]?.address
                ? wallet?.accounts[0]?.address.slice(0, 8) +
                  '...' +
                  wallet?.accounts[0]?.address.slice(-4)
                : ''}
            </h3>

            <div className="mt-10 flex w-full flex-col md:mt-14 md:flex-row md:space-x-14">
              <div className="relative w-full">
                <div className="absolute top-2 left-2 z-10 flex items-center justify-center rounded-md border border-brand-purple bg-black px-4 py-2 font-coiny text-base font-semibold text-white opacity-80 filter backdrop-blur-lg">
                  <p>
                    <span className="text-brand-pink">{totalMinted}</span> /{' '}
                    {maxSupply}
                  </p>
                </div>

                <img
                  src="/images/13.png"
                  className="w-full rounded-md object-cover sm:h-[280px] md:w-[250px]"
                />
              </div>

              <div className="mt-16 flex w-full flex-col items-center px-4 md:mt-0">
                <div className="flex w-full items-center justify-between font-coiny">
                  <button
                    className="flex h-10 w-14 items-center justify-center rounded-md bg-gray-300 font-bold text-brand-background hover:shadow-lg md:h-12 md:w-16"
                    onClick={incrementMintAmount}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 md:h-8 md:w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>

                  <p className="flex flex-1 grow items-center justify-center text-center text-3xl font-bold text-brand-pink md:text-4xl">
                    {mintAmount}
                  </p>

                  <button
                    className="flex h-10 w-14 items-center justify-center rounded-md bg-gray-300 font-bold text-brand-background hover:shadow-lg md:h-12 md:w-16"
                    onClick={decrementMintAmount}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 md:h-8 md:w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 12H6"
                      />
                    </svg>
                  </button>
                </div>

                <p className="mt-3 text-sm tracking-widest text-pink-200">
                  Max Mint Amount: {maxMintAmount}
                </p>

                <div className="mt-16 w-full border-t border-b py-4">
                  <div className="flex w-full items-center justify-between font-coiny text-xl text-brand-yellow">
                    <p>Total</p>

                    <div className="flex items-center space-x-3">
                      <p>
                        {Number.parseFloat(
                          (config.price * mintAmount).toString()
                        ).toFixed(2)}{' '}
                        ETH
                      </p>{' '}
                      <span className="text-gray-400">+ GAS</span>
                    </div>
                  </div>
                </div>

                {/* Mint Button && Connect Wallet Button */}
                {wallet ? (
                  <button
                    className={` ${
                      paused || isMinting
                        ? 'cursor-not-allowed bg-gray-900'
                        : 'bg-gradient-to-br from-brand-purple to-brand-pink shadow-lg hover:shadow-pink-400/50'
                    } mx-4 mt-12 w-full rounded-md px-6 py-3 font-coiny text-2xl  uppercase tracking-wide text-white`}
                    disabled={paused || isMinting}
                    onClick={isPreSale ? presaleMintHandler : publicMintHandler}
                  >
                    {isMinting ? 'Minting...' : 'Mint'}
                  </button>
                ) : (
                  <button
                    className="mx-4 mt-12 w-full rounded-md bg-gradient-to-br from-brand-purple to-brand-pink px-6 py-3 font-coiny text-2xl uppercase tracking-wide text-white shadow-lg hover:shadow-pink-400/50"
                    onClick={() =>
                      connect({
                        autoSelect: {
                          disableModals: true,
                          label: 'Connect',
                        },
                      })
                    }
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>

            {/* Status */}
            {status && (
              <div
                className={`border ${
                  status.success ? 'border-green-500' : 'border-brand-pink-400 '
                } text-start md:mt-4" mx-auto mt-8 h-full w-full rounded-md px-4 py-4`}
              >
                <p className="... flex flex-col space-y-2 break-words text-sm text-white md:text-base">
                  {status.message}
                </p>
              </div>
            )}

            {/* Contract Address */}
            <div className="mt-10 flex w-full flex-col items-center border-t border-gray-800 py-2">
              <h3 className="mt-6 font-coiny text-2xl uppercase text-brand-pink">
                Contract Address
              </h3>
              <a
                href={`https://rinkeby.etherscan.io/address/${config.contractAddress}#readContract`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-gray-400"
              >
                <span className="... break-all">{config.contractAddress}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mint
