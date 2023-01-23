// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, CreateCompletionResponse, OpenAIApi } from 'openai';

export type Data =
  | {
      status: 'success';
      response: CreateCompletionResponse;
    }
  | { status: 'error'; message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.status(405).json({ status: 'error', message: 'Method not allowed' });
    return;
  }

  const body = JSON.parse(req.body);
  console.log(req.body);

  // check if request has a "prompt" key
  if (!body.prompt) {
    res.status(400).json({ status: 'error', message: 'Missing "prompt" key' });
    return;
  }

  // check if request has a "prompt" key
  if (!body.password || body.password !== process.env.SECRET) {
    console.log(body.password, process.env.SECRET);
    res.status(400).json({ status: 'error', message: 'Wrong secret' });
    return;
  }

  const openAIConfig = new Configuration({
    organization: 'org-18dtyftqiVdiEM0coh24XS5s',
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(openAIConfig);

  try {
    const response = await openai.createCompletion({
      model: 'curie:ft-personal-2023-01-20-17-57-58',
      prompt: body.prompt,
      max_tokens: 160,
      temperature: 0.7,
    });

    res.status(200).json({ status: 'success', response: response.data });
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(400).json({ status: 'error', message: error.response.data });
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      res.status(400).json({ status: 'error', message: error.request });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({ status: 'error', message: error.message });
    }

    return;
  }
}
