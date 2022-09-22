import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodos } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import CustomError from '../../utils/CustomError'

const logger = createLogger('getTodos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('getTodos event', { event })

    const userId = event.requestContext.authorizer.principalId

    const res = await getTodos(userId)

    let statusCode: number
    let body: string

    if (res instanceof CustomError) {
      statusCode = res.code
      body = JSON.stringify({ msg: res.message })
    } else {
      statusCode = 200
      body = JSON.stringify({ items: res })
    }

    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
