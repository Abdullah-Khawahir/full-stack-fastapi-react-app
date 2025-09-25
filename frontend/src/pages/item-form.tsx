import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { Body_create_items__post } from "../api-client"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { BACKEND_URL } from "../Config"
import { useItemById, useItemCreate, useItemUpdate } from "../hooks/itemQueries"
import api from "../api"

const ItemForm = () => {
  const { item_id } = useParams()
  const navigate = useNavigate()
  const itemQuery = useItemById(item_id || "")
  const itemUpdate = useItemUpdate()
  const itemCreate = useItemCreate()
  const isEdit = !!item_id

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
  const [preview, setPreview] = useState<string>("")
  const [isVideo, setIsVideo] = useState(false)
  const [formObject, setFormObject] = useState({
    title: "",
    description: "",
    quantity: 0,
    price: 0,
    order: 0,
  })

  useEffect(() => {
    if (isEdit && itemQuery.data) {
      setFormObject({
        title: itemQuery.data.title || "",
        description: itemQuery.data.description || "",
        quantity: itemQuery.data.quantity || 0,
        price: itemQuery.data.price || 0,
        order: itemQuery.data.order || 0,
      })
      setPreview(`${BACKEND_URL}/media/${itemQuery.data.id}`)

      setIsVideo(itemQuery.data.file_mime_type.includes('video'))
    }
  }, [itemQuery.data, isEdit])


  useEffect(() => {
    if (!selectedFile) return
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const handleFileChange = (file: File | undefined) => {
    setSelectedFile(file)
  }

  const handleChange = (key: keyof Body_create_items__post, value: any) => {
    setFormObject((prev) => ({ ...prev, [key]: value }))
  }

  const handleUpdate = () => {
    if (!item_id) return
    api.files.updateItemMediaMediaItemIdPut(item_id, { file: selectedFile! })
    itemUpdate.mutate({ item_id, newItem: formObject }, {
      onSuccess: () => {
        alert("Item updated successfully!")
        navigate(-1)
      },
    }
    )
  }

  const handleCreate = () => {
    itemCreate.mutate(
      {
        title: formObject.title,
        description: formObject.description,
        price: formObject.price,
        quantity: formObject.quantity,
        order: formObject.order,
        file: selectedFile!,
      },
      {
        onSuccess: () => {
          alert("Item created successfully!")
          navigate(-1)
        },
      }
    )
  }

  return (
    <div className="flex w-full h-screen bg-gray-50">
      {/* Left: form inputs */}
      <div className="flex-1 p-8 flex flex-col justify-start gap-6">
        <h1 className="text-3xl font-bold">{isEdit ? "Edit Item" : "Create Item"}</h1>

        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label htmlFor="title" className="text-lg font-medium">Title</Label>
            <Input
              id="title"
              type="text"
              name="title"
              value={formObject.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="description" className="text-lg font-medium">Description</Label>
            <Input
              id="description"
              type="text"
              name="description"
              value={formObject.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label htmlFor="quantity" className="text-lg font-medium">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                name="quantity"
                value={formObject.quantity}
                onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 0)}
                className="text-lg"
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="price" className="text-lg font-medium">Price</Label>
              <Input
                id="price"
                type="number"
                name="price"
                value={formObject.price}
                onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
                className="text-lg"
              />
            </div>
          </div>

          <div className="grid gap-1">
            <Label htmlFor="order" className="text-lg font-medium">Order</Label>
            <Input
              id="order"
              type="number"
              name="order"
              value={formObject.order}
              onChange={(e) => handleChange("order", parseInt(e.target.value) || 0)}
              className="text-lg"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <Button
            variant="default"
            size="lg"
            onClick={isEdit ? handleUpdate : handleCreate}
          >
            {isEdit ? "Update Item" : "Create Item"}
          </Button>
        </div>

        {/* Drag & Drop Box */}
        <div className="mt-8">
          <Label htmlFor="media" className="text-lg font-medium mb-2">Upload Media</Label>
          <div
            className="border border-dashed border-gray-400 rounded-lg h-40 flex flex-col justify-center items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
            onClick={() => document.getElementById("media")?.click()}
          >
            <p className="text-gray-500">Drag & drop an image or click to select</p>
            <p className="text-gray-500">expected images and vidos </p>
            <input
              type="file"
              id="media"
              accept="image/*, video/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] || undefined)}
            />
          </div>
        </div>
      </div>

      {/* Right: image preview */}
      <div className="w-1/3 p-8 flex flex-col items-center justify-start gap-4 bg-white shadow-inner">
        <Label className="text-lg font-medium">Current / Selected Media</Label>
        {preview ? (
          isVideo ? (
            <video
              src={preview}
              controls
              className="w-full max-h-[70vh] object-contain rounded"
            />
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-[70vh] object-contain rounded"
            />
          )
        ) : (
          <div className="w-full h-80 flex items-center justify-center border border-gray-300 rounded text-gray-400">
            No media selected
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemForm
