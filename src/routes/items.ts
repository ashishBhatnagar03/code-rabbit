import { FastifyInstance } from 'fastify'
import { Type } from '@sinclair/typebox'
import { ItemSchema, CreateItemSchema, UpdateItemSchema } from '../types/item'
import crypto from 'node:crypto'

// In-memory storage for demo purposes
const items = new Map<string, any>()

export async function itemRoutes(fastify: FastifyInstance) {
  // Get all items
  fastify.get('/', {
    schema: {
      response: {
        200: Type.Array(ItemSchema)
      }
    },
    handler: async () => {
      return Array.from(items.values())
    }
  })

  // Get single item
  fastify.get('/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      response: {
        200: ItemSchema
      }
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const item = items.get(id)
      
      if (!item) {
        return reply.code(404).send({ error: 'Item not found' })
      }
      
      return item
    }
  })

  // Create item
  fastify.post('/', {
    schema: {
      body: CreateItemSchema,
      response: {
        201: ItemSchema
      }
    },
    handler: async (request, reply) => {
      const id = crypto.randomUUID()
      const item = {
        id,
        ...request.body,
        createdAt: new Date().toISOString()
      }
      
      items.set(id, item)
      return reply.code(201).send(item)
    }
  })

  // Update item
  fastify.patch('/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      body: UpdateItemSchema,
      response: {
        200: ItemSchema
      }
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const existingItem = items.get(id)
      
      if (!existingItem) {
        return reply.code(404).send({ error: 'Item not found' })
      }
      
      const updatedItem = {
        ...existingItem,
        ...request.body
      }
      
      items.set(id, updatedItem)
      return updatedItem
    }
  })

  // Delete item
  fastify.delete('/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      response: {
        204: Type.Null()
      }
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const deleted = items.delete(id)
      
      if (!deleted) {
        return reply.code(404).send({ error: 'Item not found' })
      }
      
      return reply.code(204).send()
    }
  })
}