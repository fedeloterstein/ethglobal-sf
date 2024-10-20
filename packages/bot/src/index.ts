import { run, HandlerContext } from "@xmtp/message-kit";

run(async (context: HandlerContext) => {
  const {
    typeId,
    content: { content: text },
  } = context.message;

  if (typeId === "text") {
    if (text.startsWith("/deposit")) {
      await context.send(`https://ethglobal-sf-frame.vercel.app/api`);
      return;
    } else if (text.startsWith("/withdraw")) {
      await context.send(`https://ethglobal-sf-frame.vercel.app/api`);
      return;
    } else if (text.startsWith("/balance")) {
      await context.send(`💰 Current balance: 13 USDC

Need to withdraw? Use /withdraw to manage your funds.

🌐 Visit our app: secure-retire.vercel.app`);
      return;
    } else if (text.startsWith("/transactions")) {
      await context.send(`📊 Here is your recent transaction history:

Deposit: 13 USDC – 19/10/2024
Deposit: 10 USDC – 19/10/2024
Withdraw: 10 USDC – 19/10/2024
For more details, contact support or check your wallet directly.

🌐 Visit our app: secure-retire.vercel.app`);
      return;
    } else
      await context.send(`👋 Welcome to the Retirement Insurance Bot! Here you can manage your savings for retirement and ensure an inheritance for your loved ones.

💼 Here are the commands you can use:

/deposit – Deposit USDC into your retirement account.
/withdraw – Withdraw available USDC from your account.
/transactions – View your transaction history.
/balance – Check your current balance.

🌐 Visit our app: secure-retire.vercel.app

⚠️ All transactions are secure and handled with USDC to avoid volatility.`);
  }
});
