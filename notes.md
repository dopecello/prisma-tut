# Types of Types

- boolean... pretty self explanatory
- Float or Decimal
  - Float is normal and Decimal is for more specific values
- DateTime is basically like `new Date()`
- Json type: supported by postgres
- Bytes: rare but useful for raw byte info
- Unsupported("") this is written when you are taking an existing db and
  importing it into prisma and it doesnt work
- data that represents another object... need to flesh out the relationship as
  shown below

# Model Relationships

Here is the way that Prisma illustrates the typical types of relational database
relationships:

## One to Many

- Array sign `[]` and `?`(optional) are called field-type operators
- In my code we have `fields: [authorId], references: [id]`
  - In this case, `fields` is pointing to my `authorId` field within the `Post`
    model
  - `references` is pointing towards my `id` field within the `User` model.
  - This relationship makes sure the two values are binded and stay consistent.
  - Most similar to `FOREIGN KEY` relationships in SQL.

## Many to Many

- Easy to make these relationships by creating named `@relation` tags like this
  one:
  - `favoritePosts Post[] @relation("FavoritePosts")` in `User` model
  - Which links to:
    `favoritedBy User? @relation("FavoritePosts", fields: [favoritedById], references: [id])`
- The name is sort of arbitrary but it should match what you're trying to link
  up.

## One to One

- Pretty easy to autocomplete these. I added one relationship in a new
  `UserPreferences` model:
  - `user User @relation(fields: [userId], references: [id])`
- This links up to a single field in my `User` model:
  - `UserPreference UserPreference?`

## Enums

- When making an `enum` in Prisma, you can assign strict values to fields in
  other models. For example, If I wanted to represent three roles: Basic,
  Editor, and Admin, I would write an `enum` like this:

```
enum Role {
  BASIC
  EDITOR
  ADMIN
}
```

In model `User` the field looks like: ` role Role @default(BASIC)`

- This guarantees that I do not write a value outside of these three values.
  This is very similar to how TypeScript does its own `enum`s

# Client Operations

In this section I go over the types of mutations you can make to the database
from the generated Prisma client:

## Data creation

- `create()`
  - Takes in an object for one peice of data
  - can have `select:{}` or `include:{}` objects on them
- `createMany()`
  - This takes in an array of objects
  - When console logging, if gives a count object (ie: `{ count: 2 }` if passing
    two objects of valid data)
  - You **CANNOT** pass an `include:{}` or `select:{}` object on this method.

## Data reading

- `findUnique()`

  - uses a `where: {}` object to find data based on certain parameters, like:

  ```
  where {
      age: 20
  }
  ```

  - If a model has a `@@unique` block modifier, then it is possible to use the
    following syntax:

    ```
    where: {
        age_name: {
            age: 27,
            name: 'Kyle'
        }
    }

    only works when the block modifier looks like:

      @@unique([age, name])
    ```

    - HAS TO QUERY BOTH age and name IN THIS CASE

- `findFirst()`
  - Similar to the previous but can take any parameter and will return the first
    result
- `findMany()`
  - Will find as many parts of matching data as the parameters provide.
  - an interesting `findUnique()`ish thing you can do with this method is:
    ```
    {
    where: {
        name: "Sally",
    },
    distinct: ["name", "age],
    }
    ```
    - This allows Prisma to return all of the results in my database where users
      are unique based on an age and the name Sally.
  - can also use `take:` and `skip:` to get different results as we please
  - we can se `orderby:` to get an ascending or descending order, amongst other
    things!

    ### Other cool features of the `where:{}` object

    - `equals:`
    - `{where: { name: { equals: "Sally } } }` will get us all the sallys!
    - `not:`
    - `{where: { name: { not: "Sally } } }` will return all the results that don't
        contain "sally" in the `name` field
    - `in: []`
    - {where: { name: { in: ["Sally, "Kyle"] } } }` will return all the result
        that include Sally && Kyle.
    - `lt: gt: gte:, lte:`
    - for ints this is useful because they are operators.
    - `contains:`
    - returns results that contain certain elements
    - `endsWith:, startsWith:`
    - `AND:[]`
    - ```
        where: {
            AND: [{ email: { startsWith: "sally" } }, { name: "Sally" }]
        }
        ```
    - This will return a result that has an email that starts with the letters
        "sally" AND also assigned the name "Sally". Good for specific filtering.
    - `OR:[]`
    - Is the same but doesn't require for both parameters to be `true`
    - `NOT:[]`
    - It is the opposite of `AND:[]` where it excludes results that return `true`
        on any of the parameters.
    - `every: {}, some: {}, + none: {}`
    - You can further filter relationships by using these:
    - `where: { writtenPosts: { every: { title: "Test" } } }`
    - some would be the equivalent of "truthy" where post can start with test but
        not deep equal.
    - `is: {}`
    - useful across different models as shown:
    - ```
        const user - await prisma.post.findMany({
        where: {
        author: {
            is: {
                age: 27,
                },
            },
        },
        })
        ```
    - From here, primsa will return posts from my `Post` model that have author
        whose ages are 27. foreign key relationship
    - same flow for `isNot:{}` but the opposite purpose.


## Data Updates

# Other Notes

- There is an option instead of using `autoincrement()` with type `Int` to make
  IDs.
  - You can also do `uuid()` with type `String` to make modal ID encryption
    better. Better use case in real apps.
- Block level modifiers are indicated by `@@` symbols at the bottom of a model
  usually with one line of separation.
  - Note that in the `Post` model, I used an `@@id([authorId, title])` block
    modifier
    - This makes a composite id combining these two fields; the combination of
      them being the "ID" of the post.
- **Important**: If the intellisense isn't showing up in the script.ts folder,
  you can `Ctrl + Click` the Prisma method of whatever you are trying to use and
  load the TypeScript file in the background, usually in the `index.d.ts` file.
  If you go back to the file after that, all of the intellisense should come
  back.
- the `select:{}` and `include:{}` objects are mututally exclusive and cannot be
  run on the same query.
- to further debug Primsa stuff using logs you can write
  `const prisma = new PrismaClient({ log: ["query"] })`
