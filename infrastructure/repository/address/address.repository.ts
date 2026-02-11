import { DB } from "@/db";
import { addressTable } from "@/db/schema/address.schema";
import { Address, AddressRepository } from "@/domain/address/address.domain";
import { RepositoryError } from "@/domain/repository.error";
import { Result, ok, err } from "neverthrow";
import { ULID } from "ulid";
import { eq } from "drizzle-orm";

export const createAddressRepository = (db: DB): AddressRepository => {
    return {
        getAddrByUserId: async (userId: ULID): Promise<Result<Address[], RepositoryError>> => {
            try {
                const res = await db
                    .select()
                    .from(addressTable)
                    .where(eq(addressTable.userId, userId));
                return ok(res)
            } catch (e) {
                console.error("error at address repository [getAddrByUserId]: ", e);
                return err(new RepositoryError("住所の取得に失敗"));
            }
        },

        save: async (addr: Address): Promise<Result<Address, RepositoryError>> => {
            try {
                const res = await db.insert(addressTable).values(addr).onConflictDoUpdate({
                    target: addressTable.id,
                    set: {
                        ...addr,
                        updatedAt: new Date(),
                    }
                }).returning();
                return ok(res[0])
            } catch (e) {
                console.log("error at address repository [save]: ", e);
                return err(new RepositoryError("住所の保存に失敗"));
            }
        },
    }
}