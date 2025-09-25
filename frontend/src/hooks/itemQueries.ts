import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import type { Body_create_items__post, ItemUpdateDTO } from "../api-client";

const itemsKey = "items"

export function useItemsAll() {
  return useQuery({
    queryKey: [itemsKey],
    queryFn: () => api.items.getAllItemsGet()
  })
}

export function useItemById(item_id: string) {
  return useQuery({
    queryKey: [itemsKey, item_id],
    queryFn: () => api.items.getByIdItemsItemIdGet(item_id)
  })
}


export function useItemUpdate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ item_id, newItem }: { item_id: string, newItem: ItemUpdateDTO }) => {
      return api.items.updateItemByIdItemsItemIdPut(item_id, newItem)
    },
    onSuccess: (item_id) => {
      queryClient.invalidateQueries({ queryKey: [itemsKey, item_id] })
    }
  })
}

export function useItemCreate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (item: Body_create_items__post) => {
      return api.items.createItemsPost(item)
    },
    onSuccess: (item_id) => {
      queryClient.invalidateQueries({ queryKey: [itemsKey, item_id] })
    }
  })
}

export function useItemDeleteById(item_id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => { return api.items.deleteByIdItemsItemIdDelete(item_id) },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [itemsKey] })
    },
  })
}
