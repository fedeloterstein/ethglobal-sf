import { run, HandlerContext } from "@xmtp/message-kit";

run(async (context: HandlerContext) => {
  const {
    typeId,
    content: { content: text },
  } = context.message;

  if (typeId === "text") {
    console.log(text);
    if (text.startsWith("/update")) {
      await context.send(`gm update`);
      return;
    } else if (text.startsWith("/poap")) {
      await context.send(`gm list`);
      return;
    } else if (text.startsWith("/frame")) {
      await context.send(`https://ethglobal-sf-frame.vercel.app/api`);
      return;
    } else await context.send(`gm general`);
  }
});
