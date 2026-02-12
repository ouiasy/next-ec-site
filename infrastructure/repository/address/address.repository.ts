import { DB } from "@/db";
import { addressTable } from "@/db/schema/address.schema";
import { Address, AddressRepository } from "@/domain/address/address.domain";
import { RepositoryError } from "@/domain/repository.error";
import { Result, ok, err } from "neverthrow";
import { ULID } from "ulid";
import { eq } from "drizzle-orm";
import { Prefecture } from "@/domain/address/prefecture.type";

export type RawAddressSelect = typeof addressTable.$inferSelect;
export type RawAddressInsert = typeof addressTable.$inferInsert;

const toRawAddress = (address: Address): RawAddressInsert => {
    return {
        id: address.id,
        userId: address.userId,

        lastName: address.lastName,
        firstName: address.firstName,

        postalCode: address.postalCode,
        prefecture: address.prefecture,
        city: address.city,
        street: address.street,
        building: address.building,

        isDefault: address.isDefault,

        updatedAt: address.updatedAt,
        createdAt: address.createdAt,
    }
}

const fromRawAddress = (addrRaw: RawAddressSelect): Address => {
    return {
        id: addrRaw.id,
        userId: addrRaw.userId,

        lastName: addrRaw.lastName,
        firstName: addrRaw.firstName,

        postalCode: addrRaw.postalCode,
        prefecture: addrRaw.prefecture,
        city: addrRaw.city,
        street: addrRaw.street,
        building: addrRaw.building,

        isDefault: addrRaw.isDefault,

        updatedAt: addrRaw.updatedAt,
        createdAt: addrRaw.createdAt,
    }
}

export const createAddressRepository = (db: DB): AddressRepository => {
    return {
        getAddrByUserId: async (userId: ULID): Promise<Result<Address[], RepositoryError>> => {
            try {
                const res = await db
                    .select()
                    .from(addressTable)
                    .where(eq(addressTable.userId, userId));
                const addrs = res.map(raddr => fromRawAddress(raddr));
                return ok(addrs);
            } catch (e) {
                return err(new RepositoryError("住所の取得に失敗", { cause: e }));
            }
        },

        save: async (addr: Address): Promise<Result<Address, RepositoryError>> => {
            try {
                const rawAddr = toRawAddress(addr);
                const res = await db.insert(addressTable)
                    .values(rawAddr)
                    .onConflictDoUpdate({
                        target: addressTable.id,
                        set: {
                            lastName: addr.lastName,
                            firstName: addr.firstName,
                            postalCode: addr.postalCode,
                            prefecture: addr.prefecture as Prefecture,
                            city: addr.city,
                            street: addr.street,
                            building: addr.building,
                            isDefault: addr.isDefault,

                            updatedAt: addr.updatedAt,
                        }
                    }).returning();
                if (res.length === 0) {
                    return err(new RepositoryError("住所の保存に失敗しました"));
                }
                const savedAddr = fromRawAddress(res[0]);
                return ok(savedAddr)
            } catch (e) {
                return err(new RepositoryError("住所の保存に失敗", { cause: e }));
            }
        },
    }
}

