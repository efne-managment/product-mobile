import {
  createCategoryFirebase,
  deleteCategoryFirebase,
  editCategoryFirebase,
  getAllCategoriesFirebase,
  getCategoryFirebase,
} from "@/firebase/categories";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { CategoriesContextType, CategoryType } from "@/types/category";

const CategoriesContex = createContext<CategoriesContextType>({
  categories: [],
  createCategory: async (data: CategoryType) => {},
  getAllCategories: async () => {},
  getOneCategory: async (id: string) => undefined,
  editCategory: async (data: CategoryType, id: string) => {},
  deleteCategory: async (id: string) => {},
});

function CategoriesProvider({ children }: any) {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const { isAuthenticated, loading } = useAuth();

  const getAllCategories = useCallback(async () => {
    try {
      const categoriesFirebase = await getAllCategoriesFirebase();
      if (categoriesFirebase) {
        setCategories(categoriesFirebase);
      }
    } catch (e: any) {
      throw new Error(e.message);
    }
  }, []);

  const getOneCategory = async (id: string) => {
    try {
      if (!categories.length) {
        await getAllCategories();
      }
      const category = categories.find((category) => category.id === id);
      return category;
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  const createCategory = async (data: CategoryType) => {
    try {
      await createCategoryFirebase(data);
      await getAllCategories();
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  const editCategory = async (data: CategoryType, id: string) => {
    try {
      await editCategoryFirebase(data, id);
      await getAllCategories();
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteCategoryFirebase(id);
      await getAllCategories();
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  useEffect(() => {
    if (!loading && isAuthenticated) {
      getAllCategories();
    }
  }, [getAllCategories, loading, isAuthenticated]);

  return (
    <CategoriesContex.Provider
      value={{
        categories,
        createCategory,
        getAllCategories,
        getOneCategory,
        editCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoriesContex.Provider>
  );
}

const useCategoriesContext = () => useContext(CategoriesContex);

export { CategoriesProvider, useCategoriesContext };
