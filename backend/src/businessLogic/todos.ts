import { uuid } from 'uuidv4'
import { createTodos, deleteTodos, getSignedUrl, getTodos, updateTodos } from '../helpers/todosAcess'
import { getUserId } from '../lambda/utils'
import { createLogger } from '../utils/logger'
const logger = createLogger('auth')

export const createAttachmentPresignedUrl = (todoId: string) => {
    return getSignedUrl(todoId)
}

export const getTodosBusiness = async (authEvent: any) => {
    const userId = getUserId(authEvent)
    logger.info('User auth', { userId: userId })
    return await getTodos(userId)
}

export const updateTodosBusiness = async (authEvent: any) => {
    const userId = getUserId(authEvent)
    logger.info('Updating todo')
    logger.info('User auth', { userId: userId })
    const todoId = authEvent.pathParameters.todoId
    const updatedTodo = JSON.parse(authEvent.body)
    return await updateTodos(userId, todoId, updatedTodo)
}

export const createTodosBusiness = async (authEvent: any) => {
    const todoId = uuid();
    const userId = getUserId(authEvent)
    const newTodo = JSON.parse(authEvent.body)
    logger.info('Creating todo')
    logger.info('User auth', { userId: userId })
    return await createTodos(userId, todoId, newTodo)
}

export const deleteTodosBusiness = async (authEvent: any) => {
    const logger = createLogger('auth')
    logger.info('Deleting todo')
    const userId = getUserId(authEvent)
    logger.info('User auth', { userId: userId })
    const todoId = authEvent.pathParameters.todoId
    return await deleteTodos(userId, todoId)
}