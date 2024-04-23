import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class OrderCounter {
  @prop({ required: true })
  id!: string

  @prop({ required: true })
  seq!: number
}

const OrderCounterModel = getModelForClass(OrderCounter)

export async function call() {
  try {
    const updatedCounter = await OrderCounterModel.findOneAndUpdate(
      { id: 'autoval' },
      { $inc: { seq: 1 } },
      { new: true }
    )

    if (!updatedCounter) {
      const newCounter = new OrderCounterModel({ id: 'autoval', seq: 1 })
      await newCounter.save()
    }

    return updatedCounter || { id: 'autoval', seq: 1 }
  } catch (error) {
    // Handle error
    console.error(error)
    throw new Error('Failed to update or create order counter')
  }
}
