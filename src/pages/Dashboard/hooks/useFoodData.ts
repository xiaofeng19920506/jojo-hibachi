import { useMemo } from "react";
import {
  useGetMenuItemsQuery,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useCreateMenuItemMutation,
} from "../../../services/api";
import type { FoodEntry } from "../../../components/DataTable/types";

export const useFoodData = () => {
  const { data: foodItems, isLoading, error, refetch } = useGetMenuItemsQuery();

  const [updateMenuItem, { isLoading: isUpdateLoading }] =
    useUpdateMenuItemMutation();
  const [deleteMenuItem, { isLoading: isDeleteLoading }] =
    useDeleteMenuItemMutation();
  const [createMenuItem, { isLoading: isCreateLoading }] =
    useCreateMenuItemMutation();

  const transformedFoodData = useMemo(() => {
    if (!foodItems) return [];

    return foodItems.map((item: Record<string, unknown>) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      status: item.status || "active",
      image: item.image,
      allergens: item.allergens || [],
      preparationTime: item.preparationTime,
      calories: item.calories,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })) as FoodEntry[];
  }, [foodItems]);

  const handleUpdateFood = async (
    foodId: string,
    updates: Partial<FoodEntry>
  ) => {
    await updateMenuItem({ id: foodId, ...updates }).unwrap();
    refetch();
  };

  const handleDeleteFood = async (foodId: string) => {
    await deleteMenuItem(foodId).unwrap();
    refetch();
  };

  const handleCreateFood = async (
    newFood: Omit<FoodEntry, "id" | "createdAt" | "updatedAt" | "status">
  ) => {
    await createMenuItem(newFood).unwrap();
    refetch();
  };

  return {
    foodData: transformedFoodData,
    isLoading,
    error,
    handleUpdateFood,
    handleDeleteFood,
    handleCreateFood,
    refetch,
    isUpdateLoading,
    isDeleteLoading,
    isCreateLoading,
  };
};
