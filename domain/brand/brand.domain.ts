import {ulid} from "ulid";

export type Brand = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}


export const brandDomain = {
  create: (name: string, description: string): Brand => {
    const trimmedName = name.trim()
    if (trimmedName.length === 0) {
      throw new Error("ブランド名は1文字以上にしてください")
    }
    const trimmedDescription = description.trim()
    if (trimmedDescription.length === 0) {
      throw new Error("詳細説明は1文字以上入れてください")
    }
    return {
      id: ulid(),
      name: trimmedName,
      description: trimmedDescription,
    }
  },

  changeName: (brand: Brand, name: string): Brand => {
    const newName = name.trim()
    if (newName.length === 0) {
      throw new Error("ブランド名は1文字以上にしてください")
    }
    return {
      ...brand,
      name: newName,
    }
  },

  changeDescription: (brand: Brand, description: string): Brand => {
    const newDescription = description.trim()
    if (newDescription.length === 0) {
      throw new Error("詳細説明は1文字以上入れてください")
    }
    return {
      ...brand,
      description: newDescription
    }
  }
}

export interface BrandRepository {
  save: (brand: Brand) => Promise<void>;
}