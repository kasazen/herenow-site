import { sql } from "./db";
import { displayNameFor, rankFor } from "./names";

export type CrewRow = {
  display_name: string;
  rank: string;
  balance: number;
  joined_at: string | null;
};

export async function topN(limit: number): Promise<CrewRow[]> {
  const lim = Math.max(1, Math.min(Math.floor(limit), 200));
  const db = sql();
  const rows = (await db`
    select u.id::text as id,
           u.display_name,
           u.created_at,
           coalesce(sum(dl.delta), 0)::bigint::text as balance
    from users u
    left join doubloons_ledger dl on dl.user_id = u.id
    where u.deleted_at is null
    group by u.id
    order by coalesce(sum(dl.delta), 0) desc, u.created_at asc
    limit ${lim}
  `) as unknown as Array<{
    id: string;
    display_name: string | null;
    created_at: Date | string;
    balance: string | number;
  }>;
  return rows.map((r) => {
    const bal = Number(r.balance) || 0;
    const created = typeof r.created_at === "string"
      ? r.created_at
      : r.created_at.toISOString();
    return {
      display_name: displayNameFor(Number(r.id), r.display_name),
      rank: rankFor(bal),
      balance: bal,
      joined_at: created.slice(0, 10),
    };
  });
}
