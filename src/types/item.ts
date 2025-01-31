import { Type, Static } from "@sinclair/typebox";

export const ItemSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  description: Type.String(),
  price: Type.Number(),
  createdAt: Type.String({ format: "date-time" }),
});

export const CreateItemSchema = Type.Omit(ItemSchema, ["id", "createdAt"]);
export const UpdateItemSchema = Type.Partial(CreateItemSchema);

export type Item = Static<typeof ItemSchema>;
export type CreateItem = Static<typeof CreateItemSchema>;
export type UpdateItem = Static<typeof UpdateItemSchema>;
