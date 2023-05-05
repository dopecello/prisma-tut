# Types of Types
- boolean... pretty self explanatory
- Float or Decimal
    - Float is normal and Decimal is for more specific values
- DateTime is basically like `new Date()`
- Json type: supported by postgres
- Bytes: rare but useful for raw byte info
- Unsupported("") this is written when you are taking an existing db and importing it into prisma and it doesnt work
- data that represents another object... need to flesh out the relationship as shown below
--- 

# Model Relationships
 Here is the way that Prisma illustrates the typical types of relational database relationships:

## One to Many
- Array sign `[]` and `?`(optional) are called field-type operators
- In my code we have `fields: [authorId], references: [id]`
    - In this case, `fields` is pointing to my `authorId` field within the `Post` model
    - `references` is pointing towards my `id` field within the `User` model. 
    - This relationship makes sure the two values are binded and stay consistent.
    - Most similar to `FOREIGN KEY` relationships in SQL.


## Many to Many
- Easy to make these relationships by creating named `@relation` tags like this one:
    - `favoritePosts  Post[]  @relation("FavoritePosts")` in `User` model
    - Which links to: `favoritedBy  User?  @relation("FavoritePosts", fields: [favoritedById], references: [id])`
- The name is sort of arbitrary but it should match what you're trying to link up. 


## One to One
- Pretty easy to autocomplete these. I added one relationship in a new `UserPreferences` model:
    - `user User @relation(fields: [userId], references: [id])`
- This links up to a single field in my `User` model:
    - `UserPreference UserPreference?`

## Enums
- When making an `enum` in Prisma, you can assign strict values to fields in other models. For example, If I wanted to represent three roles: Basic, Editor, and Admin, I would write an `enum` like this:

```
enum Role {
  BASIC
  EDITOR
  ADMIN
}
```
In model `User` the field looks like: `  role Role @default(BASIC)`

- This guarantees that I do not write a value outside of these three values. This is very similar to how TypeScript does its own `enum`s


---

# Other Notes
- There is an option instead of using `autoincrement()` with type `Int` to make IDs.
    - You can also do `uuid()` with type `String` to make modal ID encryption better. Better use case in real apps.
- Block level modifiers are indicated by `@@` symbols at the bottom of a model usually with one line of separation. 
    - Note that in the `Post` model, I used an `@@id([authorId, title])` block modifier
        - This makes a composite id combining these two fields; the combination of them being the "ID" of the post.
