import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos'
import CustomError from '../../utils/CustomError'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('deleteTodo event', { event })

    const todoId = event.pathParameters.todoId
    const userId = event.requestContext.authorizer.principalId

    const res = await deleteTodo(userId, todoId)

    let statusCode

    if (res instanceof CustomError) {
      statusCode = res.code
    } else {
      statusCode = 204
    }

    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ''
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
