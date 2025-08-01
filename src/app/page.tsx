'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import Link from 'next/link';

const contractAddress = '0x410a6454568a89021d737866E01384447466BbFb' as const;

const contractABI = [
  {
    "inputs":[{"internalType":"string","name":"tokenURI","type":"string"}],
    "name":"mint",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[{"internalType":"address","name":"","type":"address"}],
    "name":"hasMinted",
    "outputs":[{"internalType":"bool","name":"","type":"bool"}],
    "stateMutability":"view",
    "type":"function"
  }
] as const;

export default function Home() {
  const { isConnected } = useAccount();
  const [tokenURI, setTokenURI] = useState('');
  const [clientError, setClientError] = useState('');

  const { data: hash, error: writeError, isPending: isWritePending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({ 
    hash,
  });

  const handleMint = () => {
    setClientError('');
    if (!tokenURI) {
      setClientError('Please enter a Token URI.');
      return;
    }
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'mint',
      args: [tokenURI],
    });
  };

  const isMinting = isWritePending || isConfirming;
  const anyError = writeError || receiptError;

  return (
    <div className="bg-background min-h-screen w-full">
      <header className="absolute top-0 right-0 p-4 sm:p-6">
        <ConnectButton />
      </header>
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl rounded-xl bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold font-headline">Farcaster NFT Minter</CardTitle>
            <CardDescription className="pt-2">
              Mint your Farcaster identity NFT on Base Sepolia.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6">
            {isConnected ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="tokenURI" className="sr-only">Token URI</label>
                  <Input
                    id="tokenURI"
                    type="text"
                    placeholder="ipfs://..."
                    value={tokenURI}
                    onChange={(e) => {
                      setTokenURI(e.target.value);
                      if (clientError) setClientError('');
                    }}
                    disabled={isMinting}
                    aria-describedby="token-uri-description"
                  />
                  <p id="token-uri-description" className="text-xs text-muted-foreground mt-2">
                    This should be a link to your metadata JSON file.
                  </p>
                </div>

                <Button
                  onClick={handleMint}
                  disabled={!tokenURI || isMinting}
                  className="w-full font-semibold text-lg py-6"
                >
                  {isMinting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Minting...
                    </>
                  ) : (
                    'Mint NFT'
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground p-4 border rounded-md bg-muted/50">
                <Info className="mx-auto h-8 w-8 mb-2" />
                <p>Please connect your wallet to mint an NFT.</p>
              </div>
            )}
          </CardContent>

          {(clientError || anyError || isConfirmed) && (
            <CardFooter className="flex flex-col gap-4">
              {clientError && !anyError && !isConfirmed && (
                <Alert variant="destructive" className="w-full">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Input Error</AlertTitle>
                  <AlertDescription>{clientError}</AlertDescription>
                </Alert>
              )}

              {anyError && (
                  <Alert variant="destructive" className="w-full">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Transaction Error</AlertTitle>
                      <AlertDescription className="break-words">
                          {anyError.message.split('Details:')[0].trim()}
                      </AlertDescription>
                  </Alert>
              )}
              
              {isConfirmed && (
                  <Alert variant="default" className="w-full">
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Mint Successful!</AlertTitle>
                      <AlertDescription>
                          Your NFT has been minted.
                          <br />
                          <Link
                              href={`https://sepolia.basescan.org/tx/${hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline font-medium hover:text-primary"
                          >
                              View on BaseScan
                          </Link>
                      </AlertDescription>
                  </Alert>
              )}
            </CardFooter>
          )}
        </Card>
        <footer className="text-center text-muted-foreground text-sm mt-8 max-w-md w-full">
            <p className="break-words">Contract: <Link href={`https://sepolia.basescan.org/address/${contractAddress}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{contractAddress}</Link></p>
        </footer>
      </main>
    </div>
  );
}
