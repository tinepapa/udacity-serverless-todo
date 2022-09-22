import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
const Str = require('@supercharge/strings')
import { cors, httpErrorHandler } from 'middy/middlewares'

import {
  generateSignedUrl,
  updateAttachmentUrl
} from '../../businessLogic/todos'
import CustomError from '../../utils/CustomError'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('generateUploadUrl event', { event })

    const todoId = event.pathParameters.todoId
    const userId = event.requestContext.authorizer.principalId
    //const attachmentId = uuid.v4()
    //const attachmentId = uuidv4()
    const attachmentId = Str.uuid() 

    logger.info('Attachment ID is ', attachmentId)

    const uploadUrlRes = generateSignedUrl(attachmentId)

    logger.info('Generating signed url ', uploadUrlRes)

    if (uploadUrlRes instanceof CustomError) {
      return {
        statusCode: uploadUrlRes.code,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ msg: uploadUrlRes.message })
      }
    }

    const uploadAttachmentUrlRes = await updateAttachmentUrl(
      userId,
      todoId,
      attachmentId
    )
    if (uploadAttachmentUrlRes instanceof CustomError) {
      return {
        statusCode: uploadAttachmentUrlRes.code,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ msg: uploadAttachmentUrlRes.message })
      }
    }
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ uploadUrl: uploadUrlRes })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
