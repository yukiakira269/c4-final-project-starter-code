import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
// import { createTodo } from '../../businessLogic/todos'
import { createTodosBusiness } from '../../businessLogic/todos'
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Implement creating a new TODO itemconst userId = parseUserId(jwtToken);
    const result = await createTodosBusiness(event)
    console.log(result)
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        "item": result
      }),
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
