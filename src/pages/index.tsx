import Head from 'next/head';
import { Inter } from '@next/font/google';
import styles from '@/styles/Home.module.css';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';
import { Data } from '@/pages/api/openai';
import React from 'react';

async function fetchCompletion(
  url: string,
  { arg }: { arg: { prompt: string; password: string } }
): Promise<Data> {
  console.log(arg);

  const response = await fetch('/api/openai', {
    method: 'POST',
    body: JSON.stringify(arg),
  });
  const jsonData = response.json();

  return jsonData;
}

export default function Home() {
  const [prompt, setPrompt] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { trigger, data, isMutating, error } = useSWRMutation(
    '/api/openai',
    fetchCompletion
  );

  React.useEffect(() => {
    let password = window.prompt('Please enter the secret', 'wrong') as string;
    setPassword(password);
  }, []);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles['s2-heading']}>S2 Brain</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            trigger({ prompt, password });
          }}
          className={styles.section}
        >
          <textarea
            required
            maxLength={100}
            onInput={(e) => setPrompt(e.currentTarget.value)}
            className={styles['prompt-input']}
            placeholder="Prompt..."
          />
          <button
            disabled={isMutating}
            style={{ opacity: isMutating ? '0.5' : 1 }}
            className={styles['submit-button']}
          >
            Go!
          </button>
        </form>

        <div style={{ marginTop: '20px' }}>
          {data?.status === 'error' && (
            <div>Failed to load due to {JSON.stringify(data?.message)}</div>
          )}
          {isMutating && <div>Is loading...</div>}
          {!isMutating && data?.status === 'success' && (
            <div className={styles['completion-section']}>
              {data.response.choices[0].text}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
function useSWR(
  arg0: string,
  fetcher: any
): { data: any; error: any; isLoading: any } {
  throw new Error('Function not implemented.');
}
