/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import Retirement from "./Retirement.json";
import USDCMock from "./USDCMock.json";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
  title: "Frog Frame",
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const USDC_CONTRACT = "0xA4832FB68BF9ca311e317b24F7bBc524c80E2dDE";
const RETIREMENT_CONTRACT = "0x8E33Bae126e6cCFB0AaEAc6eA7d8E46e9C957D28";

const formatBalance = (balance: bigint): string => {
  return (Number(balance) / 1e18).toFixed(0);
};

const formatDate = (timestamp: bigint): string => {
  return new Date(Number(timestamp) * 1000).toLocaleString();
};

async function checklastProofOfLife(address: any) {
  try {
    const balance = await client.readContract({
      address: RETIREMENT_CONTRACT,
      abi: Retirement.abi,
      functionName: "lastProofOfLife",
      args: [address],
    });
    return formatDate(balance as bigint);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function checkBalance(address: any) {
  try {
    const balance = await client.readContract({
      address: RETIREMENT_CONTRACT,
      abi: Retirement.abi,
      functionName: "balances",
      args: [address],
    });
    return formatBalance(balance as bigint);
  } catch (error) {
    console.log(error);
    return error;
  }
}

app.transaction("/approve", async (c) => {
  return c.contract({
    // @ts-ignore
    abi: USDCMock.abi,
    chainId: "eip155:84532",
    functionName: "approve",
    args: [RETIREMENT_CONTRACT, BigInt(10 * 10 ** 18)],
    to: USDC_CONTRACT,
  });
});

app.transaction("/deposit", async (c) => {
  return c.contract({
    // @ts-ignore
    abi: Retirement.abi,
    chainId: "eip155:84532",
    functionName: "deposit",
    args: [BigInt(10 * 10 ** 18)],
    to: RETIREMENT_CONTRACT,
  });
});

app.transaction("/withdraw", async (c) => {
  return c.contract({
    // @ts-ignore
    abi: Retirement.abi,
    chainId: "eip155:84532",
    functionName: "withdraw",
    args: [BigInt(10 * 10 ** 18)],
    to: RETIREMENT_CONTRACT,
  });
});

app.frame("/", async (c) => {
  const { status } = c;

  const balance = await checkBalance(
    "0xDFbE6c0A54F9f4f758753aE56eDD02Dd92C29be3"
  );

  const lastProofOfLife = await checklastProofOfLife(
    "0xDFbE6c0A54F9f4f758753aE56eDD02Dd92C29be3"
  );

  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F0F5FF",
          minHeight: "100vh",
          padding: "40px",
          gap: "32px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div style={{ fontSize: "64px", fontWeight: "bold", color: "#0A2540" }}>
          Your Retirement Fund
        </div>

        <div style={{ fontSize: "48px", fontWeight: "500", color: "#1C3A63" }}>
          Manage your retirement fund with USDC
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
            borderRadius: "16px",
            padding: "32px",
            width: "100%",
            maxWidth: "800px",
            gap: "24px",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div
              style={{ fontSize: "36px", fontWeight: "600", color: "#0A2540" }}
            >
              {`${balance} USDC`}
            </div>
            <div style={{ fontSize: "24px", color: "#5A7184" }}>
              {`Last activity: ${lastProofOfLife}`}
            </div>
          </div>

          <div
            style={{ fontSize: "32px", fontWeight: "600", color: "#2563EB" }}
          >
            Not invested
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button.Transaction target={`/approve`}>Approve</Button.Transaction>,
      <Button.Transaction target={`/deposit`}>Deposit</Button.Transaction>,
      <Button.Transaction target={`/withdraw`}>Withdraw</Button.Transaction>,
      <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

// NOTE: That if you are using the devtools and enable Edge Runtime, you will need to copy the devtools
// static assets to the public folder. You can do this by adding a script to your package.json:
// ```json
// {
//   scripts: {
//     "copy-static": "cp -r ./node_modules/frog/_lib/ui/.frog ./public/.frog"
//   }
// }
// ```
// Next, you'll want to set up the devtools to use the correct assets path:
// ```ts
// devtools(app, { assetsPath: '/.frog' })
// ```
