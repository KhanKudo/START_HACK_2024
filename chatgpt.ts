import OpenAI from 'openai'
import { OPENAI_SECRET_KEY } from './secrets'

const openai = new OpenAI({
    apiKey: OPENAI_SECRET_KEY
})

export async function askChatGPT(question: string) {
    return (await openai.chat.completions.create({
        messages: [{ role: 'user', content: question }],
        model: 'gpt-3.5-turbo',
    })).choices[0].message.content
}