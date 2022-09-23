// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '0t457ig5l9'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  domain: 'dev-z5dj4-y6.us.auth0.com',            // Auth0 domain
  clientId: '64uXs7lfFYlixQrnzlud3MOWmWs6cco2',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
