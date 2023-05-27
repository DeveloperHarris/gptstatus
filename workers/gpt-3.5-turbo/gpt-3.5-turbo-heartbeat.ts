/* eslint-disable import/no-anonymous-default-export */

import { logResponseTimes, testOpenAIAPI } from "../utils"

export interface Env {
  OPENAI_API_KEY: string
  DB_URL: string
}

const model = "gpt-3.5-turbo"

export default {
  async scheduled(
    event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    console.log("Scheduled event called at", new Date(event.scheduledTime))

    const response = await testOpenAIAPI(env.OPENAI_API_KEY, model)

    if (
      response == undefined ||
      response.ttfb == undefined ||
      response.duration == undefined
    ) {
      return
    }

    // Log response time
    await logResponseTimes(
      env.DB_URL,
      model,
      new Date(event.scheduledTime),
      response.ttfb,
      response.duration
    )
  },
}
