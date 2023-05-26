/* eslint-disable import/no-anonymous-default-export */
/**
 * Welcome to Cloudflare Workers! This is your first scheduled worker.
 *
 * - Run `wrangler dev --local` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/cdn-cgi/mf/scheduled"` to trigger the scheduled event
 * - Go back to the console to see what your worker has logged
 * - Update the Cron trigger in wrangler.toml (see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers)
 * - Run `wrangler deploy --name my-worker` to deploy your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/runtime-apis/scheduled-event/
 */

import { Client } from "pg"

export interface Env {
  OPENAI_API_KEY: string
  DB_URL: string
}

export default {
  async scheduled(
    event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    console.log("Scheduled event called at", new Date(event.scheduledTime))

    const url = "https://api.openai.com/v1/chat/completions"

    const body = JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in quantum mechanics & computing.",
        },
        {
          role: "user",
          content:
            "Can you please provide an in-depth overview of Quantum Cryptography, and the current research being done?",
        },
      ],
      temperature: 1,
      max_tokens: 256,
    })

    const start = Date.now()

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body,
    })

    const end = Date.now()
    const responseTime = end - start

    // Validate response
    if (!response.ok) {
      console.log(
        `Unexpected response from OpenAI API: ${response.status} ${response.statusText}`
      )
    }

    console.log("Response time: " + responseTime + "ms")

    // Log response time
    const client = new Client(env.DB_URL + "?sslmode=require")
    await client.connect()

    const text =
      "INSERT INTO response_time(duration, date) VALUES($1, $2) RETURNING *"
    const values = [responseTime, new Date(event.scheduledTime)]

    try {
      const res = await client.query(text, values)
      console.log(res.rows[0])
    } catch (err) {
      console.error(err)
    } finally {
      ctx.waitUntil(client.end())
    }
  },
}
