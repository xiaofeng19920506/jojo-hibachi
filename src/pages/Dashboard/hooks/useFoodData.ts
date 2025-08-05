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

    return foodItems.map((item: any) => ({
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
    try {
      await updateMenuItem({ id: foodId, ...updates }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update food item:", error);
      throw error;
    }
  };

  const handleDeleteFood = async (foodId: string) => {
    try {
      await deleteMenuItem(foodId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete food item:", error);
      throw error;
    }
  };

  const handleCreateFood = async (
    newFood: Omit<FoodEntry, "id" | "createdAt" | "updatedAt" | "status">
  ) => {
    try {
      await createMenuItem(newFood).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to create food item:", error);
      throw error;
    }
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
