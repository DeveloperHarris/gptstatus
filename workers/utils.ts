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
    body = JSON.stringify({
      ...base,
      messages: [
        {
          role: "system",
          content: "You are an expert in quantum mechanics & computing.",
        },
        {
          role: "user",
          content:
            "Can you please provide an extensive & in-depth overview of Quantum Cryptography, and the current research being done?",
        },
      ],
    })
  } else {
    url = completions_url
    body = JSON.stringify({
      ...base,
      prompt:
        "Can you please provide an extensive & in-depth overview of Quantum Cryptography, and the current research being done?",
    })
  }

  // Send request
  let generationAttempts = 0
  const maxGenerationAttempts = 3
  let finishReason = null

  let startDate

  let ttfb
  let duration

  while (generationAttempts < maxGenerationAttempts) {
    generationAttempts++

    startDate = Date.now()

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body,
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
    const decoder = new TextDecoder("utf-8")

    // Get first byte
    let chunk = await reader.read()

    // Log first byte time
    ttfb = Date.now() - startDate

    // Read the rest of the response
    let chunks = []
    while (!chunk.done) {
      chunks.push(decoder.decode(chunk.value, { stream: true }))
      chunk = await reader.read()
    }

    // Log total response time
    duration = Date.now() - startDate

    // Decode last chunk (ensure to flush the decoder's end-of-stream)
    chunks.push(decoder.decode(chunk.value, { stream: false }))

    // Concatenate chunks into single string
    let responseText = chunks.join("")

    // Split the response by newline to separate JSON objects
    let jsonStrings = responseText.split("\n")

    let parsedResult
    // Loop through array from end to find last valid JSON object
    for (let i = jsonStrings.length - 1; i >= 0; i--) {
      try {
        parsedResult = JSON.parse(jsonStrings[i].replace("data: ", ""))
        // If parsing was successful, break from loop
        break
      } catch (e) {
        // If parsing wasn't successful (i.e., not valid JSON), continue to next string
        continue
      }
    }

    // Extract finish reason from parsed result
    finishReason = parsedResult.choices[0].finish_reason

    // Ensure logs are always 256 tokens
    if (finishReason !== "length") {
      console.log(`Unexepcted finish reason: ${finishReason}`)
      continue
    } else {
      break
    }
  }

  if (
    generationAttempts === maxGenerationAttempts &&
    finishReason !== "length"
  ) {
    console.log(
      `Failed to generate response after ${maxGenerationAttempts} attempts`
    )
    return
  }

  // Debug
  console.log("Time to first byte: " + ttfb + "ms")
  console.log("Total response time: " + duration + "ms")

  return {
    ttfb,
    duration,
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
      max_tokens / (duration / 1000),
    ])
    console.log(res.rows[0])
  } catch (err) {
    console.error(err)
  } finally {
    await client.end()
  }
}
