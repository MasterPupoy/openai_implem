import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { useState } from "react";

type Node = {
  content: string;
  origin: string;
};

export default function Home() {
  const [input, setInput] = useState<string>();
  const [messages, setMessages] = useState<Node[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = (input: string) => {
    setLoading(true);
    setInput("");
    setMessages((m) => [...m, { origin: "user", content: input }]);
    fetch("/api/completion", {
      method: "POST",
      body: JSON.stringify({
        input: input,
      }),
    })
      .then((res) => res.json())
      .then((d) => {
        setLoading(false);
        setMessages((m) => [
          ...m,
          { origin: "gpt", content: d.choices[0].text },
        ]);
      });
  };

  return (
    <>
      <Head>
        <title>Assistant | With OpenAI</title>
        <meta
          name="description"
          content="Personal Assistant powered by OpenAI"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div
          style={{
            flex: 1,
            flexDirection: "column",
            width: "500px",
            overflowY: "scroll",
            height: "100%",
          }}
        >
          {messages &&
            messages.map((r, i) =>
              r.origin === "user" ? (
                <p key={`${r}${i}`}>{r.content}</p>
              ) : (
                <p style={{ color: "#00a703" }} key={`${r}${i}`}>
                  {r.content}
                </p>
              )
            )}
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <textarea
            style={{
              height: "100px",
              width: "500px",
              padding: "1rem",
              borderRadius: "0.25rem",
            }}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={(e) => {
              console.log(e.key)
              // if (e.key === "Enter") {
              //   sendMessage(input);
              // }
            }}
            disabled={loading}
          >
            Rewrite this message by breaking down the ideas into separate
            sentences in bullet point format:
          </textarea>
          <button
            style={{
              padding: "1rem",
            }}
            onClick={() => {
              sendMessage(input);
            }}
            disabled={loading}
          >
            Send
          </button>
        </div>
      </main>
    </>
  );
}
