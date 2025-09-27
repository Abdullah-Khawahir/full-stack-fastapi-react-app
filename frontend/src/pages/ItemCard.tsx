import type { ItemResponseDTO } from "@/api-client"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BACKEND_URL } from "@/Config"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Edit2, Trash2 } from "lucide-react"
import { useNavigate } from "react-router"
import { Button } from "../components/ui/button"
import { useItemDeleteById } from "../hooks/itemQueries"
type props = {
  item: ItemResponseDTO
}

const ItemCard = ({ item }: props) => {
  const navigate = useNavigate()
  const deleteItem = useItemDeleteById(item.id)
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })


  function handleDelete(): void {
    deleteItem.mutate();
  }

  return (
    <Card
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
    >
      <CardHeader data-no-drag>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
        <CardAction className="flex gap-2 "
          onPointerDown={e => e.stopPropagation()}>

          <Button variant={'outline'}
            onClick={() => navigate(`/item-form/${item.id}?intent=edit`)}
          >
            {<Edit2 />}
          </Button>

          <Button
            variant={"destructive"}
            onClick={handleDelete}
            disabled={deleteItem.isPending}
          >
            {<Trash2 />}
          </Button>

        </CardAction>
      </CardHeader>

      <CardContent>
        {item.file_mime_type.includes('video') ? (
          <video controls className="rounded-2xl">
            <source src={`${BACKEND_URL}/media/${item.id}`} type="video/mp4" />
          </video>
        ) : (
          <img className="rounded-2xl" src={`${BACKEND_URL}/media/${item.id}`} />
        )}
      </CardContent>

      <CardFooter className="mt-auto">
        <div className="w-full flex justify-between">
          <p>${item.price}</p>
          <p>{item.quantity} Peices</p>
          <p>{item.order} </p>
        </div>
      </CardFooter>

    </Card>
  )
}





export default ItemCard
