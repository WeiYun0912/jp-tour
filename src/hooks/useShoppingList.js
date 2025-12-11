import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchShoppingList,
  addShoppingItem,
  toggleShoppingItem,
  deleteShoppingItem,
} from "../api";

export function useShoppingList() {
  const queryClient = useQueryClient();

  // GET - 使用 useQuery
  const {
    data: items = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["shoppingList"],
    queryFn: fetchShoppingList,
    staleTime: 30000,
  });

  // 新增項目 - useMutation
  const addItemMutation = useMutation({
    mutationFn: addShoppingItem,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["shoppingList"] });
      const previousItems = queryClient.getQueryData(["shoppingList"]);

      queryClient.setQueryData(["shoppingList"], (old = []) => [
        {
          id: Date.now().toString(),
          item: newItem.item,
          quantity: newItem.quantity || "",
          checked: false,
          tripId: newItem.tripId || null,
          timestamp: Date.now(),
        },
        ...old,
      ]);

      return { previousItems };
    },
    onError: (err, newItem, context) => {
      queryClient.setQueryData(["shoppingList"], context.previousItems);
    },
    onSettled: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
      }, 2000);
    },
  });

  // 切換勾選狀態 - useMutation
  const toggleItemMutation = useMutation({
    mutationFn: toggleShoppingItem,
    onMutate: async (timestamp) => {
      await queryClient.cancelQueries({ queryKey: ["shoppingList"] });
      const previousItems = queryClient.getQueryData(["shoppingList"]);

      queryClient.setQueryData(["shoppingList"], (old = []) =>
        old.map((item) =>
          item.id === timestamp ? { ...item, checked: !item.checked } : item
        )
      );

      return { previousItems };
    },
    onError: (err, timestamp, context) => {
      queryClient.setQueryData(["shoppingList"], context.previousItems);
    },
    onSettled: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
      }, 2000);
    },
  });

  // 刪除項目 - useMutation
  const deleteItemMutation = useMutation({
    mutationFn: deleteShoppingItem,
    onMutate: async (timestamp) => {
      await queryClient.cancelQueries({ queryKey: ["shoppingList"] });
      const previousItems = queryClient.getQueryData(["shoppingList"]);

      queryClient.setQueryData(["shoppingList"], (old = []) =>
        old.filter((item) => item.id !== timestamp)
      );

      return { previousItems };
    },
    onError: (err, timestamp, context) => {
      queryClient.setQueryData(["shoppingList"], context.previousItems);
    },
    onSettled: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
      }, 2000);
    },
  });

  return {
    items,
    loading,
    error: error?.message || null,
    submitting:
      addItemMutation.isPending ||
      toggleItemMutation.isPending ||
      deleteItemMutation.isPending,
    addItem: (itemData) => addItemMutation.mutateAsync(itemData),
    toggleItem: (timestamp) => toggleItemMutation.mutateAsync(timestamp),
    deleteItem: (timestamp) => deleteItemMutation.mutateAsync(timestamp),
  };
}
