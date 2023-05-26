import { Client } from "pg"

const max_tokens = 256
const temperature = 1

const chat_url = "https://api.openai.com/v1/chat/completions"
const completions_url = "https://api.openai.com/v1/completions"

export async function testOpenAIAPI(OPENAI_API_KEY: string, model: string) {
  // Create request
  const base = {
    model,
    temperature,
    max_tokens,
    stream: true,
  }

  let body
  let url

  if (model == "gpt-4" || model == "gpt-3.5-turbo") {
    url = chat_url
    body = {
      ...base,
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
    }
  } else {
    url = completions_url
    body = {
      ...base,
      prompt:
        "Can you please provide an in-depth overview of Quantum Cryptography, and the current research being done?",
    }
  }

  // Send request
  const startTime = Date.now()

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  })

  // Handle response
  if (!response.ok) {
    console.log(
      `Unexpected response from OpenAI API: ${response.status} ${response.statusText}`
    )
    return
  }

  if (!response.body) {
    console.log("No response body")
    return
  }
  const reader = response.body.getReader()

  // Get first byte
  let chunk = await reader.read()

  // Log first byte time
  const firstByteTime = Date.now() - startTime

  // Read the rest of the response
  while (!chunk.done) {
    chunk = await reader.read()
  }

  const totalTime = Date.now() - startTime

  // Debug
  console.log("Time to first byte: " + firstByteTime + "ms")
  console.log("Total response time: " + totalTime + "ms")

  return {
    ttfb: firstByteTime,
    duration: totalTime,
  }
}

export async function logResponseTimes(
  db_url: string,
  model: string,
  date: Date,
  ttfb: number,
  duration: number
) {
  const client = new Client(db_url + "?sslmode=require")
  await client.connect()

  const text =
    "INSERT INTO response_times(model, date, ttfb, duration, tps) VALUES($1, $2, $3, $4, $5) RETURNING *"

  try {
    const res = await client.query(text, [
      model,
      date,
      ttfb,
      duration,
      max_tokens / duration,
    ])
    console.log(res.rows[0])
  } catch (err) {
    console.error(err)
  } finally {
    await client.end()
  }
}