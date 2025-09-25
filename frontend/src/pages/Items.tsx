import { renderQueryState } from "@/lib/components-utils"
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useEffect, useState } from "react"
import type { ItemResponseDTO } from "../api-client"
import { useItemsAll, useItemUpdate } from "../hooks/itemQueries"
import ItemCard from "./ItemCard"

const Items = () => {
  const itemsQuery = useItemsAll()
  const itemUpdate = useItemUpdate()
  const [items, setItems] = useState<ItemResponseDTO[]>([])
  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    if (itemsQuery.data) {
      setItems([...itemsQuery.data].sort((a, b) => a.order - b.order))
    }
  }, [itemsQuery.data])

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over) return

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id)
      const newIndex = prev.findIndex((i) => i.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return prev

      const newItems = arrayMove(prev, oldIndex, newIndex)

      const updatedItems = newItems.map((item, index) => ({ ...item, order: index + 1 }))

      updatedItems.forEach((item) => {
        itemUpdate.mutate(
          {
            item_id: item.id,
            update_item: { item_update: { order: item.order }  }
          },
          { onError: () => setItems(prev) }
        )
      })

      return updatedItems
    })
  }

  const sortedItems = [...items].sort((a, b) => a.order - b.order)

  return (
    renderQueryState(itemsQuery) || (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedItems.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-5 gap-4">
            {sortedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    )
  )
}

export default Items
