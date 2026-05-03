migrate the database and generate the Prisma Client:

```bash
bunx drizzle-kit generate
```

realize the migration:

```bash
# Local database
bunx wrangler d1 migrations apply personal-project --local

# Remote database
bunx wrangler d1 migrations apply personal-project --remote
```
