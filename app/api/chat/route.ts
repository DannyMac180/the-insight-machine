import { StreamingTextResponse, Message } from 'ai'
import { SonnetAPI } from 'sonnet-api'

const sonnet = new SonnetAPI({
  apiKey: process.env.SONNET_API_KEY
})

export async function POST(req: Request) {
  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1]

  const stream = await sonnet.chat.completions.create({
    messages: [
      { role: 'user', content: lastMessage.content }
    ],
    model: 'sonnet-3.5',
    stream: true,
  })

  return new StreamingTextResponse(stream)
}
