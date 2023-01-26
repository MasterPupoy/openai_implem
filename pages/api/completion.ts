// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const i = JSON.parse(req.body)
  console.log(i)

  return fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: `${i.input}`,
      max_tokens: 2000,
      temperature: 0,
      stream: false
    }),
  })
    .then((d) => d.json())
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    });
}



