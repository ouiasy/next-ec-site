import {isValid, ulid} from "ulid";

export type Category = {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
}

export const categoryDomain = {
  create: (name: string, description: string, parentId?: string): Category => {
    const trimmedName = name.trim()
    if (trimmedName.length === 0) {
      throw new Error("カテゴリ名は1文字以上にしてください")
    }
    const trimmedDescription = description.trim()
    if (trimmedDescription.length === 0) {
      throw new Error("カテゴリの説明は1文字以上にしてください")
    }
    if (parentId && !isValid(parentId)) {
      throw new Error("不正な親カテゴリです")
    }
    return {
      id: ulid(),
      name: trimmedName,
      description: trimmedDescription,
      parentId: parentId ? parentId : null,
    }
  },

  changeName: (category: Category, name: string): Category => {
    const trimmedName = name.trim()
    if (trimmedName.length === 0) {
      throw new Error("カテゴリ名は１文字以上にしてください")
    }
    return {
      ...category,
      name: trimmedName,
    }
  },

  changeDescription: (category: Category, description: string): Category => {
    const trimmedDescription = description.trim()
    if (trimmedDescription.length === 0) {
      throw new Error("カテゴリの説明は1文字以上にしてください")
    }
    return {
      ...category,
      description: trimmedDescription
    }
  },

  changeParentCategory: (category: Category, parentId: string): Category => {
    if (!isValid(parentId)) {
      throw new Error("不正な親カテゴリーです")
    }
    return {
      ...category,
      parentId
    }
  }
}

export interface CategoryRepository {
  save: (category: Category) => Promise<void>;
}