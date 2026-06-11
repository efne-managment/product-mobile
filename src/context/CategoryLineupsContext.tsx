import {
  getAllCategoryLineupsFirebase,
  getCategoryLineupFirebase,
  saveCategoryLineupFirebase,
} from "@/firebase/categoryLineups";
import {
  CategoryLineupDocumentType,
  CategoryLineupsContextType,
  CategoryLineupType,
} from "@/types/category";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { useCategoriesContext } from "./CategoriesContext";

const CategoryLineupsContext = createContext<CategoryLineupsContextType>({
  lineups: {},
  getAllCategoryLineups: async () => {},
  getCategoryLineup: async (categoryId: string) =>
    getCategoryLineupFirebase(categoryId),
  saveCategoryLineup: async () => {},
});

function CategoryLineupsProvider({ children }: React.PropsWithChildren) {
  const [lineups, setLineups] = useState<Record<string, CategoryLineupDocumentType>>({});
  const { isAuthenticated, loading } = useAuth();
  const { categories } = useCategoriesContext();

  const getAllCategoryLineups = useCallback(async (categoryIds?: string[]) => {
    const ids =
      categoryIds ||
      categories
        .map((category) => category.id)
        .filter((id): id is string => Boolean(id));

    if (!ids.length) {
      setLineups({});
      return;
    }

    try {
      const lineupsFirebase = await getAllCategoryLineupsFirebase(ids);
      setLineups(
        lineupsFirebase.reduce((acc, lineup) => {
          acc[lineup.categoryId] = lineup;
          return acc;
        }, {} as Record<string, CategoryLineupDocumentType>),
      );
    } catch (e: any) {
      throw new Error(e.message);
    }
  }, [categories]);

  const getCategoryLineup = async (categoryId: string) => {
    try {
      const lineup = lineups[categoryId] || await getCategoryLineupFirebase(categoryId);
      setLineups((currentLineups) => ({
        ...currentLineups,
        [categoryId]: lineup,
      }));

      return lineup;
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  const saveCategoryLineup = async (
    categoryId: string,
    lineup: CategoryLineupType,
  ) => {
    try {
      await saveCategoryLineupFirebase(categoryId, lineup);
      const updatedLineup = await getCategoryLineupFirebase(categoryId);
      setLineups((currentLineups) => ({
        ...currentLineups,
        [categoryId]: updatedLineup,
      }));
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  useEffect(() => {
    if (!loading && isAuthenticated && categories.length) {
      getAllCategoryLineups();
    }
  }, [categories.length, getAllCategoryLineups, isAuthenticated, loading]);

  return (
    <CategoryLineupsContext.Provider
      value={{
        lineups,
        getAllCategoryLineups,
        getCategoryLineup,
        saveCategoryLineup,
      }}
    >
      {children}
    </CategoryLineupsContext.Provider>
  );
}

const useCategoryLineupsContext = () => useContext(CategoryLineupsContext);

export { CategoryLineupsProvider, useCategoryLineupsContext };
