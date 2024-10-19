"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowDownIcon, ArrowUpIcon, InfoIcon } from "lucide-react";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function Dashboard() {
  const [invested, setInvested] = useState(false);
  const [newEmergencyWallet, setNewEmergencyWallet] = useState(false);
  const [timeRemaining] = useState(3 * 365 * 24 * 60 * 60 * 1000);
  const [isLoading, setIsLoading] = useState(true);

  const { address: connectedAddress, isConnected } = useAccount();

  const handleToggleInvestment = () => {
    if (isConnected) {
      setInvested(prevInvested => !prevInvested);
    }
  };

  const formatTimeRemaining = (ms: number) => {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    return `${years} years and ${remainingDays} days`;
  };

  const { data: retirementBalance, isLoading: balanceLoading } = useScaffoldReadContract({
    contractName: "Retirement",
    functionName: "balances",
    args: [connectedAddress],
    watch: true,
  });

  const { data: lastProofOfLifeData, isLoading: proofOfLifeLoading } = useScaffoldReadContract({
    contractName: "Retirement",
    functionName: "lastProofOfLife",
    args: [connectedAddress],
    watch: true,
  });

  const { data: transactionHistoryData, isLoading: transactionHistoryLoading } = useScaffoldReadContract({
    contractName: "Retirement",
    functionName: "getTransactionHistory",
    args: [connectedAddress],
    watch: true,
  });

  const { data: fallbackWalletsData, isLoading: fallbackWalletsLoading } = useScaffoldReadContract({
    contractName: "Retirement",
    functionName: "fallbackWallets",
    args: [connectedAddress],
    watch: true,
  });

  const { writeContractAsync: writeRetirementAsync } = useScaffoldWriteContract("Retirement");
  const { writeContractAsync: writeUSDCMockAsync } = useScaffoldWriteContract("USDCMock");
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo("Retirement");

  useEffect(() => {
    const loadingStates = [
      balanceLoading,
      proofOfLifeLoading,
      transactionHistoryLoading,
      fallbackWalletsLoading,
      deployedContractLoading,
    ];
    setIsLoading(loadingStates.some(state => state));
  }, [balanceLoading, proofOfLifeLoading, transactionHistoryLoading, fallbackWalletsLoading, deployedContractLoading]);

  const handleDeposit = async (amount: number) => {
    try {
      await writeUSDCMockAsync({
        functionName: "approve",
        args: [deployedContractData?.address, BigInt(amount * 10 ** 18)],
      });
      await writeRetirementAsync({
        functionName: "deposit",
        args: [BigInt(amount * 10 ** 18)],
      });
    } catch (e) {
      console.error("Error depositing:", e);
    }
  };

  const handleSetEmergencyWallet = async (address: string) => {
    try {
      await writeRetirementAsync({
        functionName: "setFallbackWallet",
        args: [address],
      });
      setNewEmergencyWallet(false);
    } catch (e) {
      console.error("Error setting emergency wallet:", e);
    }
  };

  const handleProofOfLife = async () => {
    try {
      await writeRetirementAsync({
        functionName: "updateProofOfLife",
      });
    } catch (e) {
      console.error("Error updating proof of life:", e);
    }
  };

  const handleWithdraw = async (amount: number) => {
    try {
      await writeRetirementAsync({
        functionName: "withdraw",
        args: [BigInt(amount * 10 ** 18)],
      });
    } catch (e) {
      console.error("Error withdrawing:", e);
    }
  };

  const formatBalance = (balance: bigint): string => {
    return (Number(balance) / 1e18).toFixed(2);
  };

  const formatDate = (timestamp: bigint): string => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:flex lg:space-x-8">
          <Card
            className={`w-full lg:w-1/2 shadow-lg mb-8 lg:mb-0 ${!isConnected ? "opacity-50 pointer-events-none" : ""}`}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold">Your Retirement Fund</CardTitle>
              <CardDescription>Manage your retirement fund with USDC</CardDescription>
              <div className="mt-6 p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                <div>
                  <div className="text-3xl font-bold">
                    {isLoading ? (
                      <Skeleton className="h-8 w-32" />
                    ) : (
                      `${isConnected && retirementBalance ? formatUnits(retirementBalance as bigint, 18) : 0} USDC`
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Last activity:{" "}
                    {isLoading ? (
                      <Skeleton className="h-4 w-24 inline-block" />
                    ) : isConnected ? (
                      formatDate(lastProofOfLifeData as bigint)
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
                <Badge variant={invested && isConnected ? "default" : "secondary"}>
                  {invested && isConnected ? "Invested" : "Not invested"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit">Deposit USDC</Label>
                <div className="flex space-x-2">
                  <Input id="deposit" placeholder="Amount" type="number" />
                  <Button
                    disabled={isLoading}
                    onClick={() =>
                      handleDeposit(Number((document.getElementById("deposit") as HTMLInputElement).value))
                    }
                  >
                    Deposit
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="withdraw">Withdraw USDC</Label>
                <div className="flex space-x-2">
                  <Input id="withdraw" placeholder="Amount" type="number" />
                  <Button
                    variant="outline"
                    disabled={isLoading}
                    onClick={() =>
                      handleWithdraw(Number((document.getElementById("withdraw") as HTMLInputElement).value))
                    }
                  >
                    Withdraw
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="investment-mode">Invest all balance</Label>
                  <Switch
                    id="investment-mode"
                    checked={invested && isConnected}
                    onCheckedChange={handleToggleInvestment}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emergency">Emergency Wallet</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{`If there's no activity for over 3 years, the emergency wallet can withdraw the funds.`}</p>
                        <p>Time remaining: {isConnected ? formatTimeRemaining(timeRemaining) : "N/A"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : fallbackWalletsData !== "0x0000000000000000000000000000000000000000" &&
                  newEmergencyWallet === false &&
                  isConnected ? (
                  <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span className="text-sm text-gray-600 truncate">{fallbackWalletsData}</span>
                    <Button variant="outline" onClick={() => setNewEmergencyWallet(true)}>
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Input id="emergency" placeholder="Wallet address" />
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleSetEmergencyWallet((document.getElementById("emergency") as HTMLInputElement).value)
                      }
                    >
                      Set
                    </Button>
                  </div>
                )}
              </div>
              <div className="pt-4">
                <Button onClick={handleProofOfLife} className="w-full" disabled={isLoading}>
                  Provide Proof of Life
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className={`w-full lg:w-1/2 shadow-lg ${!isConnected ? "opacity-50" : ""}`}>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                  ))}
                </div>
              ) : transactionHistoryData && transactionHistoryData.length > 0 ? (
                <ul className="space-y-4">
                  {transactionHistoryData.map((tx, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        {tx.txType === "deposit" ? (
                          <ArrowUpIcon className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <ArrowDownIcon className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className={tx.txType === "deposit" ? "text-green-600" : "text-red-600"}>
                          {tx.txType === "deposit" ? "+" : "-"}
                          {formatBalance(tx.amount)} USDC
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(tx.date)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-500">No transactions yet.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
