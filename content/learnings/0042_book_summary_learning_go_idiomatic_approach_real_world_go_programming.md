Title: Book summary: Learning Go – An Idiomatic Approach to Real-World Go Programming
Date: 2023-10-20 20:08
Tags: best practices, books, go
Slug: book-summary-learning-go-idiomatic-approach-real-world-go-programming
Authors: Sébastien Lavoie
Summary: [Learning Go](https://www.oreilly.com/library/view/learning-go/9781492077206/) is a book that teaches idiomatic Go style and best practices through concrete examples. It covers fundamental features like types and control flow, as well as more advanced topics like concurrency and reflection. The goal is to help readers write clear, readable, robust Go code. I think it succeeded at that!
Description: Learning Go is a book that teaches idiomatic Go style and best practices through concrete examples. It covers fundamental features like types and control flow, as well as more advanced topics like concurrency and reflection. The goal is to help readers write clear, readable, robust Go code. I think it succeeded at that!

[TOC]

---

# Introduction

Go is a modern programming language developed by Google that has gained immense popularity in recent years. It is a statically typed, compiled language that combines aspects of imperative and object-oriented programming. Go aims to provide simplicity, performance, and reliability.

In his book, Jon provides a comprehensive introduction to Go programming. The book focuses on teaching idiomatic Go code by using concrete examples and focusing on how experienced Go developers structure their code. It covers fundamental language features like primitive types, control structures, and composite types. It also dives into more advanced topics like concurrency through goroutines and channels, writing tests, and using reflection.

This summary highlights the key takeaways from each chapter. It aims to provide an overview of the core concepts and best practices for writing clear, readable, robust Go code. It's written from the perspective of a developer who has experience with other programming languages like Python, Java, and TypeScript but practically none in Go.

---

# Chapter 1: Setting Up Your Go Environment

- Use `golint` to enforce the right coding style of a project.
- Use `go vet` to find errors that may not be detected by the compiler, such as having the wrong number of arguments passed to a `Printf` call.
- A common idiom to run multiple commands at once when building a project is to rely on a `Makefile` like this:

```{makefile}
.DEFAULT_GOAL := build

fmt:
    go fmt ./...
.PHONY:fmt

lint: fmt
    golint ./...
.PHONY:lint

vet: fmt
    go vet ./...
.PHONY:vet

build: vet
    go build hello.go
.PHONY:build
```

Typing `make` will run `fmt`, then `vet`, then `build` since the default task is `build`, which requires `vet` to have run first, which in turn requires `fat` to have run first, which in turn has no dependency, so `fmt` runs and the chain continues.

- Testing whether a new version of Go works for existing programs compiled on an older version is straightforward:

```{.bash}
go get golang.org/dl/go.1.x.y  # replace x.y
go1.x.y download

# try out the changes
go1.x.y build

# If all good, remove this secondary version
go1.x.y env GOROOT
/.../.../go1.x.y
rm -rf $(go1.x.y env GOROOT)
rm $(go env GOPATH)/bin/go1.x.y

# Install new version as wanted...
```

---

# Chapter 2: Primitive Types and Declarations

## Built-in types

- Zero value
    - Assigned to a variable that is declared with no initial value (doesn't lead to bugs like in C or C++).
- Literals
    - These express different bases, such as `0b` (binary), `0o` (octal) or `0x` (hexadecimal). As in other languages like Python or Java, underscores can be used to express large numbers.
    - Floating point literals look like `6.03e23`.
    - Rune literals are represented with single quotes (no double quotes accepted). The most common ones are `('\n')`, tab `('\t')`, single quote `('\'')`, double quote `('\"')` and backslash `('\\')`. Other bases are supported but should be limited to specific contexts (e.g., bit filters for base two).
    - String literals can be written with double quotes, where everything must be escaped.
    - Raw string literals use backticks instead of double quotes and can be used to insert any character except a backtick. They support multiline expressions.
- Boolean
    - The type is `bool` and the default zero value is `false`.
- Numeric types
    - Integers
        - `int8` (aliased `byte`, which is much more common), `int16`, `int32`, `int64`, `uint8`, `uint16`, `uint32`, `uint64`.
        - The zero value is 0.
        - Use the minimum size when needed for specific applications.
        - Use `int64` and `uint64` for library functions (until generics are available).
        - Otherwise, just use `int`. Other types should be considered a premature optimization until proven otherwise.
        - Variables can be modified like so: `+=`, `-=`, `*=`, `/=` and `%=`.
        - Available comparisons are: `==`, `!=`, `>`, `>=`, `<`, and `<=`.
        - Bit manipulations
            - Shifts: `<<` (left), `>>` (right)
            - Logical bit masks: `&` (`AND`), `|` (`OR`), `^` (`XOR`), `&^` (`AND NOT`)
            - All operators can be used to modify a variable as well: `&=`, `|=`, `^=`, `&^=`, `<<=`, `>>=`.
- Floating point types
    - `float32`, `float64`.
    - The zero value is 0.
    - If using a floating point number, default to `float64` unless a profiler shows significant improvement with `float32` and the precision is good enough (6-7 decimal places).
    - Strict equality (or inequality) should not be done on floating point numbers: check the variance instead (less than epsilon).
- Complex types
    - `complex64` uses `float32` to represent real and imaginary parts, while `complex128` uses `float64`, using the `complex` built-in function and `real` and `image` functions to extract the relevant parts.
    - As with floating point numbers, use the epsilon technique to check for equality.
- Strings and runes
    - The zero value is an empty string.
    - Strings are immutable.
    - Strings can be checked for equality or compared for ordering (`>`, `>=`, `<`, or `<=`) and can be concatenated with the `+` operator.
    - The `rune` type represents a single code point, equivalent to `int32`.
- Explicit type conversion
    - All type conversions are explicit.
    - There is no concept of "truthiness" (e.g., `if 2: print("ok")` is valid in Python).

## `var` vs. `:=`

`var` is more verbose but flexible:

```{.go}
var x int = 1
var x = 1           // because the default type is `int`
var x int           // no value => it will be the zero value
var x, y int = 1, 2 // multiple assignments
var x, y int        // multiple assignments, zero values
var x, y = 1, "hi"  // different default types

// Declaration list
var (
  x   int
  y       = 2
  z   string
)
```

Type inference can be performed within a function:

```{.go}
// These statements are equivalent
var x = 1
x := 1    // invalid syntax outside a function
```

Avoid `:=` in the following situations:

- When explicitly initialize a zero value, like `var x int`.
- To avoid a type conversion, by writing `var x byte = 8` instead of `x := byte(8)`.
- To avoid "shadowing" a variable, as `:=` can be used to assign to existing variables. Create new variables with `var`.
- Non-constant package-level variables are a bad idea. If they're unused, they go unnoticed without raising compile-time errors.

## `const`

- Variables cannot be declared as immutable.
- Constants are a way of giving names to literals.
- Inside a function, it is clear when a variable is being modified.
- If a constant is typed (e.g., `const typedVar int = 1`), then it can only be assigned to that type, `int` in this case.
- If a constant is untyped (e.g., `const untypedVar = 2`), then it can be assigned to suitable numerical types.

## Unused variables

- Unused declared local variables result in a compile-time error.

## Naming Variables and Constants

- Even though many Unicode characters can be used, they should be avoided to maintain clarity.
- Go uses camelCase.
- The less scope a variable has, the shorter its name should be (`k` and `v` are accepted for key/value, just like `i` and `j` to use indices when iterating in loops).
- It is common to use the first letter of a type as the variable name (e.g., `i` for integers, `f` for floats, `b` for boolean). If the code is hard to understand, it's a sign the function is trying to do too much.

---

# Chapter 3: Composite Types

## Arrays

- They are rarely used directly.
- They can be compared (`==` and `!=`).
- Their length is retrieved with the built-in `len` function.
- Negative indexing is a compile-time error.
- Out-of-bounds indexing results in a panic at runtime.
- Unless there's a very specific need to use a given size of array (e.g., for a cryptographic library), avoid them.
- They exist basically to provide slices.
  - There are a few ways of declaring arrays:

```{.go}
// indicate the size and type
var x [3]int // 3 integers with zero value

// array literal
var x = [3]int{10, 20, 30} // values specified
var x = [...]int{10, 20, 30} // equivalent

// sparse array:
// indicate few values at specific locations
var x = [12]int{1, 5: 4, 6, 10: 100, 15}

// Get and set values
x[0] = 10
fmt.Println(x[2])
```

## Slices

- The zero value for a slice is `nil`, which represents the lack of a value for some type. `nil` itself has no type.
- The size of the array is not specified: `var x = []int{10, 20, 30}`. This is a slice literal.
- Can be used like a sparse array: `var x = []int{1, 5: 4, 6, 10: 100, 15}`.
- Multidimensional arrays can be simulated: `var x [][]int`.
- Reads and assignments are the same as with arrays, using square brackets.
- Slices can be created without assigning initial values: `var x []int`.
- Slices aren't comparable, except to check if it is nil (`x == nil`).
- They're useful for sequential data.

### `len`

- A `nil` slice returns `0` (`len(x)`).

### `append`

It it used to grow slices:

```{.go}
var x []int
x = append(x, 10) // returns a slice
x = append(x, 5, 6, 7) // more than one value

// append to another slice with `...`
y := []int{20, 30, 40}
x = append(x, y...)
```

### Capacity

- It increases automatically as needed. It doubles under 1,024 items, then it increases by at least 25%.
- `cap` returns the current capacity of the slice.
- It is better when possible to allocate the needed size upfront to avoid resizing the arrays.

### `make`

- It can be used to create a slice that already has a capacity specified.
    - `x := make([]int, 5)`: length and capacity of 5 (all zero values). Using `append` here would add new values to the end of the slice, after the zero values!
    - `x := make([]int, 0, 10)` creates an empty slice with a capacity of 10 and after `x = append(x, 5,6,7,8)`, it contains `[5 6 7 8]`.

### Declaring a slice

- Slice literals
    - An empty slice literal declares a slice that is non-nil: `var x = []int{}`. This is useful to convert to JSON.
    - Useful with some initial values or when the values don't change.

### Slicing slices

These work with square brackets:

```{.go}
x := []int{1, 2, 3, 4} // [1 2 3 4]
y := x[:2]             // [1 2]
z := x[1:]             // [2 3 4]
d := x[1:3]            // [2 3]
e := x[:]              // [1 2 3 4]
```

### Slices can share data

```{.go}
x := []int{1, 2, 3, 4}
y := x[:2]
z := x[1:]

// These are bidirectional changes!
x[1] = 20              // affects `x`, `y` and `z`
y[0] = 10              // affects `x` and `y`
z[1] = 30              // affects `x` and `z`

// Result:
// x: [10 20 30 4]
// y: [10 20]
// z: [20 30 4]
```

`append` can lead to unintuitive results, overwriting existing values:

```{.go}
x := make([]int, 0, 5)    // length 0, capacity 5
x = append(x, 1, 2, 3, 4) // x is now [1 2 3 4]
y := x[:2]                // [1 2], length 2, capacity 5
z := x[2:]                // [3 4], length 2, capacity 3

y = append(y, 30, 40, 50)
// x is now [1 2 30 40], length 4, capacity 5!
// y is now [1 2 30 40 50], length 5, capacity 5
// z is now [30 40], length 2, capacity 3

x = append(x, 60)
// x is now [1 2 30 40 60], length 5, capacity 5
// y is now [1 2 30 40 60], length 5, capacity 5!
// z is still [30 40], length 2, capacity 3

z = append(z, 70)
// x is now [1 2 30 40 70], length 5, capacity 5!
// y is now [1 2 30 40 70], length 5, capacity 5!
// z is now [30 40 70], length 3, capacity 3
```

One way to avoid this issue is to use *full slice expressions- to indicate the capacity of the subslices:

```{.go}
x := make([]int, 0, 5)
x = append(x, 1, 2, 3, 4)
y := x[:2:2]  // take a slice of x, up to index 2, with a capacity of 2
z := x[2:4:4] // take a slice of x, from index 2 to 4, with a capacity of 2

y = append(y, 30, 40, 50)
// x is still [1 2 3 4], length 4, capacity 5
// y is now [1 2 30 40 50], length 5, capacity 6
// z is still [3 4], length 2, capacity 2

x = append(x, 60)
// x is now [1 2 3 4 60], length 5, capacity 5
// y is still [1 2 30 40 50], length 5, capacity 6
// z is still [3 4], length 2, capacity 2

z = append(z, 70)
// x is still [1 2 3 4 60], length 5, capacity 5
// y is still [1 2 30 40 50], length 5, capacity 6
// z is now [3 4 70], length 3, capacity 4
```

### Converting Arrays to Slices

- Arrays can be sliced, though memory will be shared as when slicing a slice.

```{.go}
x := [4]int{5, 6, 7, 8} // [5 6 7 8]
y := x[:2]              // [5 6]
z := x[2:]              // [7 8]
x[0] = 10               // [10 6 7 8]
// y and z are now [10 6] and [7 8]
```

### `copy`

- It creates a slice that is independent from the original slice.

```{.go}
// It can copy the whole slice if the lengths are the same
x := []int{1, 2, 3, 4}    // [1 2 3 4]
y := make([]int, 4)       // [0 0 0 0]
num := copy(y, x)         // num=4, copy(dst, src)
fmt.Println(y, num)       // [1 2 3 4] 4
fmt.Println(x)            // [1 2 3 4]

// It can copy a subset of the slice
y := make([]int, 2)       // [0 0]
num = copy(y, x)          // num=2, copy(dst, src)
fmt.Println(y)            // [1 2]

// It can copy from a subset from any position
x := []int{1, 2, 3, 4}    // [1 2 3 4]
y := make([]int, 2)       // [0 0]
copy(y, x[2:])            // copy(dst, src)
fmt.Println(y)            // [3 4]

num = copy(x[:3], x[1:])  // put the last 3 values at the beginning
fmt.Println(x)            // [2 3 4 4], overwriting

// It also works with arrays
x := []int{1, 2, 3, 4}    // slice, [1 2 3 4]
d := [4]int{5, 6, 7, 8}   // array, [5 6 7 8]
y := make([]int, 2)       // [0 0]
copy(y, d[:])             // first 2 values of d into y
fmt.Println(y)            // [5 6]
copy(d[:], x)             // copy x into d
fmt.Println(d)            // [1 2 3 4]
```

## Strings and Runes and Bytes

- Strings are arrays of bytes.
- Single characters can be extracted from a string with an *index expression*:

```{.go}
s := "hello"
c := s[0]                 // c is a byte, not a rune
fmt.Println(c)            // 104
fmt.Printf("%T\n", c)     // uint8 (i.e., byte)

// Need to be careful with indexing
var s string = "Hello 😄"
fmt.Println(len(s))       // could have expected 7, but it's 10
fmt.Println(s[:2], s[7:]) // He ���: the emoji is 4 bytes long
```

## Maps

- The built-in map type is a *hash map* (implemented as an array).
- The zero value for a map is `nil`.
- Writing to a `nil` map results in a runtime panic.
- `len` on a map returns the number of key/value pairs.
- Maps are not comparable (can check against `nil`).
- The key must be comparable: it cannot be a slice, map or function.
- Maps are good when the order of the keys doesn't matter: use a slice when it does.
- All the values must be of the same type, but *the keys can be of different types*.
- Avoid using them as input parameters to functions (use a struct instead to be self-documenting).

```{.go}
var nilMap map[string]int
//             ^      ^
//      key type      value type

// map literal: length of 0
myMap := map[string]int{}  // allows reads and writes

// Nonempty map
reposByOrg := map[string][]string{
    "dbeaver":   []string{"dbeaver", "cloudbeaver", "team-edition-deploy"},
    "slidevjs":  []string{"slidev", "slidev-vscode", "themes"},
    "ReactiveX": []string{"RxJava", "rxjs", "RxGo"}, // comma at the end here too
}

// With a default size
myValues := make(map[int][]string, 10) // length 0, capacity 10, can grow beyond 10
```

### Reading and writing maps

```{.go}
reposByOrgStars := map[string]int{}    // length 0, can grow, string to integer
reposByOrgStars["dbeaver"] = 10        // write
reposByOrgStars["slidevjs"] = 100      // write
reposByOrgStars["ReactiveX"]++         // read, increment, write (0 -> 1)
// reposByOrgStars["slidevjs"] := 100  // invalid syntax
```

### Comma Ok idiom

- One can get the value of a key and a boolean indicating whether the key exists or not:

```{.go}
value, ok := reposByOrgStars["dbeaver"]  // 10 true
value, ok = reposByOrgStars["notfound"]  // 0 false
```

### Deleting from a map

- `delete` removes a key/value pair from a map:

```{.go}
delete(reposByOrgStars, "ReactiveX")

// It is safe to delete a key that doesn't exist
delete(reposByOrgStars, "notfound")    // it returns nothing

// It is safe to delete a key from a nil map
var nilMap map[string]int
delete(nilMap, "notfound")

// It is safe to delete a key from an empty map
emptyMap := map[string]int{}
delete(emptyMap, "notfound")
```

### Using maps as sets

- Go doesn't have a built-in set type.
- A map can be used as a set by using the key as the value and the value as a boolean:

```{.go}
mySet := map[string]bool{}
mySet["hello"] = true
mySet["world"] = true
mySet["hello"] = true // no error, but it's still a set
```

- This works because if the value isn't found, the zero value is returned, which is `false` for booleans.
- To use operations like `union`, `intersection` and `difference`, the most convenient solution is to use a third-party library.
- Structs can also be used as sets as they're more memory efficient, but more clumsy to use as they make use of the *comma ok idiom*.

## Structs

- Good when there is related data that needs to be grouped together.
- They are defined with the `type` keyword.
- No commas are needed between fields.
- They can be defined inside or outside of a function. If inside a function, they can only be used inside that function.

```{.go}
type user struct {
    age       int
    firstName string
    lastName  string
}

var u user      // zero value for a struct is all zero values for its fields
u.age = 18
u.firstName = "Bob"
u.lastName = "Michigan"
fmt.Println(u)  // {18 Bob Michigan}

// Assignments can also be done with a struct literal
bob := user{}   // also initializes all fields to zero values

// With initial values
jeremy := user{
    49,         // must match the order of the fields
    "Jeremy",   // all fields must be specified
    "Stretchy",
}               // {49 Jeremy Stretchy}

// With this style, fields can be left out:
otherUser := user{
    age:       32,        // using the field name...
    firstName: "Sweaty",  // cannot indicate other fields without the field name
    // lastName is zero value, i.e., empty string
}

// Accessing a field:
jeremy.firstName = "Jer"
fmt.Println(jeremy.firstName) // Jer
```

### Anonymous structs

- They are useful when a struct is only used in one place.
- Useful when [marshalling][marshalling] and unmarshalling data.

```{.go}
computer := struct {
    operatingSystem string
    chip string
}{
    operatingSystem: "macOS",
    chip: "Apple M2 Ultra",
}
```

### Comparing and converting structs

- Contrary to regular structs, they can be compared.

---

# Chapter 4: Blocks, Shadows, and Control Structures

## Blocks

- A block is a place where declarations are made.
- The top-level block is the *package* block.
- The import statements are in the *file* block.

## Shadowing Variables

- There is a "global" block, the *universe* block, which contains the built-in functions and types. Careful: those keywords can be shadowed!

```{.go}
func main() {
    x := 10
    if x > 5 {
        fmt.Println(x)
        x := 5  // shadowing
        fmt.Println(x)
    }
    // x is still 10 here (outer block)
    fmt.Println(x)
}

func main() {
    x := 10
    if x > 5 {
        // x is shadowed while y is declared!
        x, y := 5, 20
        fmt.Println(x, y)  // 5 20
    }
    fmt.Println(x)         // 10
}

func main() {
    x := 10
    fmt.Println(x)
    fmt := "shadowing fmt package"
    fmt.Println(fmt)       // undefined!
}
```

Usual linters won't catch shadowing, but we can install `shadow`:

```{.bash}
go install golang.org/x/tools/go/analysis/passes/shadow/cmd/shadow@latest
```

And we can make it part of the `Makefile`:

```{.makefile}
lint: fmt
    golint ./...
    shadow ./...
.PHONY: lint
```

## `if` statements

- The condition must be a boolean expression.
- The usual flow is `if`, `else if`, `else`.
- There are no parentheses around the condition.
- Variables can be scoped to the `if` statement (they'll be available in `else if` and `else` blocks as well). Only use that feature to define new variables!

```{.go}
if n := rand.Intn(10); n == 0 {
    fmt.Println("That's too low")
} else if n > 5 {
    fmt.Println("That's too big:", n)
} else {
    fmt.Println("That's a good number:", n)
}
// n is not available here!
```

## `for` loops

- It is the only looping construct in the language.
- It can be used in four different ways to accomplish all looping needs.
- It uses no parentheses.

### Complete `for` statement

```{.go}
for i := 0; i < 10; i++ {
    fmt.Println(i)
}
```

- The initialization statement is executed once before the loop starts. It must use the `:=` operator. It can shadow variables.
- The second statement is the condition. It must be a boolean expression. It is checked before each iteration as well as before the loops starts.
- The third statement is the post statement. It is executed after each iteration. It would usually be used to increment a counter.

### Condition-only `for` Statement

```{.go}
i := 0
for i < 10 {
    fmt.Println(i)
    i++
}
```

- This is a statement that only has a condition. It is equivalent to a `while` loop in other languages.

### Infinite `for` Statement

```{.go}
for {
    fmt.Println("Hello")
}
```

- This is a statement that has no condition. It is equivalent to a `while true` loop in other languages.

### `break` and `continue`

- There is no `do... while` construct as in other languages like C, Java or JavaScript.
- `do... while` indicates how to *stay* in the loop while `for` indicates how to *leave* the loop.
- `break` exits the loop.
- `continue` skips the rest of the loop and goes to the next iteration. Use it to avoid nesting loops.
- `break` and `continue` can be used with labels to break out of nested loops.

### `for-range` loop

```{.go}
odds := []int{1, 3, 5, 7, 9}
for i, v := range odds {
    fmt.Println(i, v)
}
```

- Here, `i` (`0` to `4`) is the index of the iterator construct and `v` (`1, 3 ... 9`) is the value.
- `i` is usually used for arrays, slices and strings, while `k` is used for maps.
- As in other languages like Python, use an underscore (`_`) to ignore a value. The index or key can be ignored this way.
- If the key is needed but not the value, leave the value out: `for k := range myMap { ... }`. This is useful when using a map as a set.

#### Iterating over maps

```{.go}
m := map[string]int{"a": 1, "c": 3, "b": 2}
for i := 0; i < 3; i++ {
    fmt.Println("Loop", i)
    for k, v := range m {
        fmt.Println(k, v) // order will differ
    }
}
fmt.Println(m) // will be in ascending order to help with debugging
```

- For security reasons (hash DoS), the order of the keys is randomized. If the order is important, use a slice of keys instead.

#### Iterating over strings

- Go iterates over the Unicode code points (runes), not the bytes.

```{.go}
samples := []string{"hello", "worl∂!"}
for _, sample := range samples {
    for i, r := range sample {
        fmt.Println(i, r, string(r))
    }
    fmt.Println()
}

/*
Output:
0 104 h        // index, rune, string(rune)
1 101 e
2 108 l
3 108 l
4 111 o
               // first string is 5 runes long
0 119 w
1 111 o
2 114 r
3 108 l
4 8706 ∂       // this is a single rune: it occupies 3 bytes
7 33 !         // index 7! The second string is 8 runes long
*/
```

#### `for-range` value is a copy

- Modifying the value variable doesn't change the original value.
- `break` and `continue` are also available in this form.

```{.go}
odds := []int{1, 3, 5, 7, 9}
for _, v := range odds {
    v += 2
}
fmt.Println(odds) // [1 3 5 7 9]
```

### `for` loop labels

- While their use is rare, they can be used to break out of nested loops.
- The label is indented to the same level as the containing block.

```{.go}
    samples := []string{"hello", "worl∂!"}
outer:
    for _, sample := range samples {
        for i, r := range sample {
            fmt.Println(i, r, string(r))
            if r == 'l' {
                continue outer
            }
        }
        fmt.Println()
    }
```

This code will skip the remaining letters of both words once the first `l` is printed out for each one.

### The right `for` statement

- `for-range` is the proper way to iterate over strings to get runes.
- A complete `for` statement is good when not iterating through all the items in a collection (except for strings since runes aren't necessarily one byte long).
- The condition-only `for` statement is used to replace `while` loops.
- Infinite loops can simulate a `do... while` construct and can be used to create the iterator pattern.

## Expression `switch` statements

- They don't use parentheses.
- Used to check for equality.
- Scoped variables can be declared (e.g., `word` is scoped to all cases).
- All cases are part of the same block (only the switch statement itself is a block surrounded by braces).
- No need for `break` statements. It can be used, but may indicate a code smell.
- `break` can be useful if the `switch` statement is inside a loop.
- There is a `fallthrough` keyword to go to the next case (*not recommended*).

```{.go}
words := []string{"Go", "Ada", "COBOL", "C++", "Python", "Clojure", "WebAssembly"}
for _, word := range words {
    switch size := len(word); size {
    case 1, 2, 3, 4:                            // catches multiple matches
        fmt.Println(word, "is a short name!")   // Go, Ada, C++
    case 5:
        wordLen := len(word)
        fmt.Println(word, "is the right length:", wordLen)  // COBOL
    case 6, 7, 8, 9:  // empty case, nothing happens: Python, Clojure
    default:
        fmt.Println(word, "is a long name!")    // WebAssembly
    }
}

// Inside a loop
loop: // label
for i := 0; i < 10; i++ {
    switch {
    case i%2 == 0:
        fmt.Println(i, "is even")
    case i%3 == 0:
        fmt.Println(i, "is divisible by 3 but not 2")
    case i%7 == 0:
        fmt.Println("exit the loop!")
        break loop  // break out of the loop, not just the switch statement
    default:
        fmt.Println(i, "is boring")
    }
}
```

## Blank `switch` statements

- Instead of checking for equality, they check for any boolean comparison.

```{.go}
func main() {
    var x int = 5
    switch {
    case x%2 == 0:
        fmt.Println(x, "is even")
    case x > 6:
        fmt.Println(x, "is large")
    case x <= 6:
        fmt.Println("Got it!") // this is the one that will be executed
    default:
        fmt.Println(x, "Not it...")
    }
}
```

## `if` or `switch`?

- `switch` should be used when there is some relationship between comparable elements. It is more concise and makes the comparisons more obvious.

## `goto`

- It should generally be avoided.
- It can be used to replace boolean flags, such as in [this non-trivial example][atof.go] from the standard library.

---

# Chapter 5: Functions

## Declaring and calling them

- Go has no classes, but it has methods (see [chapter 7](#chapter-7-types-methods-and-interfaces)).
- Types are mandatory.
- The `return` keyword is mandatory (except for `main`) if the function has a return type.
- Nothing goes between the input parameters and the start of the block if there's no return type.
- Go has no named or optional input parameters: you can pass structs instead. In practice, that probably means the function is trying to do too much.
- Go supports variadic parameters (e.g., the `fmt.Println` function) with `...` right before the type: they are used as a slice inside the function.
- Functions can return multiple values. They must all be returned, comma-separated. Unlike Python which uses tuples, Go uses the comma to separate the individual values.
- The error is always the last parameter a function will return. If no error occurred, it will be `nil`.
- Indicate ignored values (possibly all) with an underscore. A notable exception is `fmt.Println` which returns two values that aren't usually used.
- Named values can be returned. They make shadowing possible and should be used sparingly.
- Blank returns can be returned with named values, but they make it harder to understand how data flows.

```{.go}

func div(numerator int, denominator int) int {
//   ^   ^                          ^    ^
//   |   input parameter            |    return type
//   Function name                  parameter type
    if denominator == 0 {
        return 0
    }
    return numerator / denominator
}

// The following is equivalent when the types are the same
// func div(numerator, denominator int) int ...

// variadic parameter
func addTo(base int, vals ...int) []int {
    out := make([]int, 0, len(vals))
    for _, v := range vals {
        out = append(out, base+v)
    }
    return out
}
// fmt.Println(addTo(1, 2, 3, 4))
// a := []int{4, 3}
// fmt.Println(addTo(3, a...))
// fmt.Println(addTo(3, []int{4, 5}...))

// named return values
func divAndRemainder(numerator int, denominator int) (result int, remainder int, err error) { ... }
```

## Functions are values

- Functions can be defined as types, e.g. `type aFuncType func(int, int) int`.
- Anonymous functions can be defined inside other functions and called immediately (IIFE). This comes in handy when using [`defer`](#defer) and [Goroutines](#chapter-10-concurrency-in-go).

### Closures

- Closures are used to create functions that have access to variables that are outside of their scope.
- Functions can be passed as parameters to other functions.
- Functions can return functions.
- They are useful with `sort.Search` and `sort.Slice`.

An example of closure is with the `sort.Slice` function:

```{.go}
import (
    "fmt"
    "sort"
)

func main() {
    type Person struct {
        FirstName string
        LastName  string
        Age       int
        HasPet    bool
    }
    people := []Person{
        {"Pat", "Patterson", 37, true},
        {"Tracy", "Bobbert", 23, false},
        {"Fred", "Fredson", 18, true},
        {"Bob", "Tracier", 18, false},
        {"Alice", "Anderson", 30, true},
    }
    fmt.Println(people)

    // `people` is captured by the closure
    sort.Slice(people, func(i int, j int) bool {
        // If one person has a pet and the other doesn't, prioritize the one with the pet.
        if people[i].HasPet != people[j].HasPet {
            return people[i].HasPet
        }
        // If both have pets, sort by LastName.
        if people[i].HasPet && people[j].HasPet {
            return people[i].LastName < people[j].LastName
        }
        // Otherwise, sort by age in ascending order.
        return people[i].Age < people[j].Age
    })

    fmt.Println(people)
}

// This returns:
// - People that have pets first
// - If both have pets, sort by last name in ascending order
// - If neither have pets, sort by age in ascending order

// Unsorted:
[
    {Pat Patterson 37 true}
    {Tracy Bobbert 23 false}
    {Fred Fredson 18 true}
    {Bob Tracier 18 false}
    {Alice Anderson 30 true}
]

// Sorted:
[
    {Alice Anderson 30 true}
    {Fred Fredson 18 true}
    {Pat Patterson 37 true}
    {Bob Tracier 18 false}
    {Tracy Bobbert 23 false}
]
```

A function that returns a function:

```{.go}
func main() {
    withTwo := getResult(2)
    withThree := getResult(3)
    for i := 0; i < 3; i++ {
        fmt.Println("i=", i, "withTwo (2 + i):", withTwo(i), "withThree (3 + i):", withThree(i))
    }
}

func getResult(initialValue int) func(int) int {
    return func(subsequent int) int {
        return initialValue + subsequent
    }
}

// Output:
// i= 0 withTwo (2 + i): 2 withThree (3 + i): 3
// i= 1 withTwo (2 + i): 3 withThree (3 + i): 4
// i= 2 withTwo (2 + i): 4 withThree (3 + i): 5
```

### `defer`

- This is used to perform the cleanup code, such as closing a file, after a function has returned. This is similar to the `finally` block in Java or Python.
- It delays the execution of a function until the surrounding function returns.
- They run in LIFO (last in, first out) order.
- The code that runs after `defer` is literally the last thing that runs before the function returns, so what is put there is immediately "called" (e.g., `defer close()`) but will run until later.
- It helps reduce depth of nesting, which, along with "lack of structure", are two of the most important factors that contribute to code complexity (see [this paper][code-complexity]).

### Go is "call by value"

- Go always makes a copy of the value before passing it to a function.
- Maps and slices behave differently because they are implemented with pointers.

---

# Chapter 6: Pointers

- A pointer is a variable that holds the address of a value in memory.
- The zero value of a pointer is `nil`.
- `&` is the address-of operator. It goes before the variable name to get its address.
- `*` is the indirection (dereference) operator. It goes before a pointer to get the value it points to.
- Dereferencing a `nil` pointer will result in a runtime panic.
- Types with an `*` are pointers to that type ("pointer type").
- `new` is a built-in function that allocates memory for a type and returns a pointer to it.
- To turn a constant into a pointer, use a helper function that takes a value and returns a pointer to it.
- A pointer is used to indicate that a parameter is mutable, i.e., that the function can modify the original value.
- To update the value of a pointer inside a function, dereference it and assign it a new value.
- Value types should be preferred when returning from functions.
- Use a pointer as a return type when there is a need to return a modified data structure or when the data being passed around is very large (at least 1 MB).
- Slices can be used as buffers when iterating over files to avoid allocating memory in each iteration of the loop.
- The garbage collector will free memory that is no longer used. Go favors low latency over high throughput.

```{.go}
var x int = 10
var y *int = &x
fmt.Println(x, y) // 10 0xc0000b4008
fmt.Println(&x, *y) // 0xc0000b4008 10

// The zero value of a pointer is nil
var z *int
fmt.Println(z) // nil

// Dereferencing a nil pointer will result in a runtime panic
// fmt.Println(*z) // panic: runtime error: invalid memory address or nil pointer dereference

// new allocates memory for a type and returns a pointer to it
var a *int = new(int)
fmt.Println(a) // 0xc0000b4010
fmt.Println(*a) // 0

// To turn a constant into a pointer, use a helper function that takes a value and returns a pointer to it
func intPtr(i int) *int {
    return &i
}
var b *int = intPtr(10)

// A pointer is used to indicate that a parameter is mutable
func addOne(x *int) {
    *x++
}
addOne(b)
fmt.Println(*b) // 11

// To update the value of a pointer inside a function, dereference it and assign it a new value
func updatePointer(x *int) {
    *x = 2
}
updatePointer(b)
fmt.Println(*b) // 2
```

---

# Chapter 7: Types, Methods, and Interfaces

- Types can be declared at any level, including at the package level.

## Methods

- Method names cannot be overloaded.

```{.go}
type Person struct {
    FirstName string
    LastName  string
    Age       int
}

func (p Person) String() string {
//    ^
//    p is a receiver of the String method
    return fmt.Sprintf("%s %s, age %d", p.FirstName, p.LastName, p.Age)
}

func main() {
    p := Person{"Domi", "Noes", 42}
    fmt.Println(p.String())  // Domi Noes, age 42
}
```

### Pointer Receivers and Value Receivers

- Use a *pointer receiver* when the method needs to modify the receiver.
- Use a *pointer receiver* when `nil` must be handled.
- A *value receiver* is used when the method doesn't need to modify the receiver.
- If a type has a pointer receiver, all methods should have pointer receivers for consistency.
- Usually, there's no need for getters and setters when using structs: just use the fields directly.
- Pointer receiver methods should check for `nil` values.

### Methods are also functions

- We can use a *method value* to turn a method into a function.
- A *method expression* is used to turn a method into a function that takes the receiver as the first parameter.
- They can be use for dependency injection.

```{.go}
// Using a method value
func main() {
    p := Person{"Domi", "Noes", 42}
    f := p.String     // using an instance of the struct
    fmt.Println(f())  // Domi Noes, age 42
}

// Using a method expression
func main() {
    p := Person{"Domi", "Noes", 42}
    f := Person.String // using the type itself
    fmt.Println(f(p))  // Domi Noes, age 42
}
```

### Functions vs. methods

- Use a function when there is no need to modify the receiver.
- Use a method with a struct receiver when there is a need to modify data at runtime.

### Type declarations are not inheritance

- Declaring a type based on another type is not inheritance: there is no hierarchy.
- Type conversion is used to convert a value from one type to another.

### Types serve as executable documentation

- They can be used to make code more readable and self-documenting.
- A `Percentage` type can be used to make it clear what a value is instead of an `int`.

### Use iota for enumeration (sparingly)

- Go does not have an enumeration type.
- `iota` is a built-in constant generator that starts at `0` and increments by `1` for each subsequent constant.
- `iota` can be used to create a set of constants that are related to each other.
- It should be used for "internal" purposes only, when the constants are referred to by name -- not by value.
- It is useful to differentiate between sets of values, not to rely explicitly on the values themselves.
- If the first value in the constant block (with value `0`) is not really initialized or the value `0` does not make sense, it can be named with an `_` to skip `0`.

```{.go}
type Color int

const (
    Red Color = iota
    Green
    Blue
)

func main() {
    fmt.Println(Red, Green, Blue) // 0 1 2
}
```

### Embedding for composition

- Types can be embedded to encourage composition.

```{.go}
type Person struct {
    FirstName string
    LastName  string
    Age       int
}

type Employee struct {
    Person         // embedded field
    EmployeeID int
}

func main() {
    e := Employee{
        Person: Person{
            FirstName: "Domi",
            LastName:  "Noes",
            Age:       42,
        },
        EmployeeID: 12345,
    }
    fmt.Println(e.FirstName, e.LastName, e.Age, e.EmployeeID) // Domi Noes 42 12345
}
```

### Interfaces

- Interfaces are declared as a type with the `interface` keyword.
- The methods defined in an interface are the methods that a type must implement to be considered an implementation of that interface: this is referred to as the *method set*.
- They can be declared in any block.
- They usually end with `er` (e.g., `Stringer`, `Reader`, `Writer`).
- They are implemented implicitly.
- Go is a blend of duck typing (e.g., dynamic behavior in Python) and structural typing (Java interfaces).
- Use built-in interfaces from the standard library as much as possible.
- Just like structs, interfaces can be embedded.
- Interfaces are the only abstract type in Go.

```{.go}
// Switching between the logic providers is as simple as changing the type of the L field.
import "fmt"

type LogicProvider struct{}

type LogicProvider2 struct{}

func (lp LogicProvider2) Process(data string) string {
    fmt.Println("LogicProvider2: Process")
    return data
}

func (lp LogicProvider2) Rework(data string) string {
    return data
}

func (lp LogicProvider) Process(data string) string {
    return data
}

func (lp LogicProvider) Rework(data string) string {
    fmt.Println("LogicProvider1: Rework")
    return data
}

type Logic interface {
    Process(data string) string
    Rework(data string) string
}
type Client struct {
    L Logic
}

func (c Client) Program() {
    data := "data"
    c.L.Process(data)
    c.L.Rework(data)
}

func main() {
    c1 := Client{
        L: LogicProvider{},
    }
    c1.Program()

    c2 := Client{
        L: LogicProvider2{},
    }
    c2.Program()
}

// Output:
// LogicProvider1: Rework
// LogicProvider2: Process
```

### Take interfaces and return structs

- Returning interfaces increases coupling.
- It is better to return structs and take interfaces as parameters.

### Empty interfaces

- If an interface is `nil`, invoking a method on it will result in a runtime panic.
- An empty interface matches any type, because it requires implementing no methods.
- They can be used when receiving data from an external source (e.g., a database or JSON) and the type is unknown.
- Using `interface{}` is a code smell: it should be used sparingly.

### Type assertions and type switches

- Use the *comma ok* idiom to avoid a type assertion from panicking.
- Type assertions are checked at runtime.
- Type conversions are checked at compile time.
- A type switch is used to check the type of an interface.
- In the case of errors, use `errors.Is` and `errors.As` to test for specific errors.
- Add a `default` case to switch statements to catch unexpected types.
- It can be safer to keep interfaces unexported.

```{.go}
func main() {
    var i interface{} = 42
    v1, ok1 := i.(int)
    fmt.Println(v1, ok1) // 42 true
    v2, ok2 := i.(string)
    fmt.Println(v2, ok2) // "" false

    // type switch
    switch v := i.(type) {
    case int:
        fmt.Println("int", v) // int 42
    case string:
        fmt.Println("string", v)
    case float64, float32: // check both at once
        fmt.Println("float", v)
    default:
        fmt.Println("unknown", v)
    }

    // type assertion using optional interface
    if s, ok := i.(MySpecificInterface); ok {
        // myInterface satisfies MySpecificInterface
        s.SpecificMethod()
    }
}
```

### Function types are a bridge to interfaces

- Functions can implement interfaces.
- Go uses this to implement the `http.Handler` interface.
- Small interfaces are encouraged.
- If a function can depend on many other functions, it is better to use a struct with methods.

```{.go}
type HandlerFunc func(http.ResponseWriter, *http.Request)

func (f HandlerFunc) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    f(w, r)
}

func main() {
    http.Handle("/", HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintln(w, "Hello, world!")
    }))
    http.ListenAndServe(":8080", nil)
}
```

An actual, basic HTTP server:

```{.go}
package main

import (
    "fmt"
    "net/http"
)

type HandlerFunc func(http.ResponseWriter, *http.Request)

func (f HandlerFunc) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    f(w, r)
}

func main() {
    http.Handle("/", HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        p, err := fmt.Fprintln(w, "Hello, world!")
        if err != nil {
            return
        }
        fmt.Println(p)
    }))
    err := http.ListenAndServe(":8080", nil)
    if err != nil {
        return
    }
}
```

### Implicit Interfaces Make Dependency Injection Easier

- "[...] *code should explicitly specify the functionality it needs to perform its task*".
- If a type has methods that match an interface's signature, it implicitly satisfies that interface.
- Go's implicit interfaces make dependency injection easier.
- Interfaces are used to decouple code.
- The client's code should not be responsible for creating the dependencies it needs.
- The client's code defines the interfaces and can customize the method set it needs.

Here is an example of an implicit interface:

```{.go}
package main

import "fmt"

type Talker interface {
    Say() string
}

// Dog implicitly implements the Talker interface
type Dog struct{}

func (d Dog) Say() string {
    return "Woof!"
}

func Speak(t Talker) {
    fmt.Println(t.Say())
}

func main() {
    d := Dog{}
    Speak(d)  // Woof!
}
```

And an example demonstrating dependency injection:

```{.go}
package main

import (
    "fmt"
)

// Logger is an implicit interface with a Log method
type Logger interface {
    Log(message string)
}

// SimpleLogger implicitly satisfies Logger by implementing Log
type SimpleLogger struct{}

func (sl SimpleLogger) Log(message string) {
    fmt.Println(message)
}

// AdvancedLogger implicitly satisfies Logger by implementing Log
type AdvancedLogger struct{}

func (al AdvancedLogger) Log(message string) {
    fmt.Println("ADVANCED: " + message)
}

// CompositeLogger combines SimpleLogger and AdvancedLogger
// Again, it implicitly satisfies Logger by implementing Log
type CompositeLogger struct {
    loggers []Logger
}

// Log messages with multiple loggers
func (cl CompositeLogger) Log(message string) {
    for _, logger := range cl.loggers {
        logger.Log("[CompositeLogger] " + message)
    }
}

// Greeter contains logic to greet
type Greeter struct {
    logger Logger // Logger is injected
}

// NewGreeter injects dependencies and returns a new Greeter
func NewGreeter(l Logger) Greeter {
    return Greeter{logger: l}
}

// Greet uses the Logger to log a greeting
func (g Greeter) Greet() {
    g.logger.Log("Hello, dependency injection and implicit interface!")
}

func main() {
    logger1 := SimpleLogger{}       // Create Logger
    greeter1 := NewGreeter(logger1) // Inject Logger into Greeter
    greeter1.Greet()                // Use Greeter
    // Logs:
    // Hello, dependency injection and implicit interface!

    logger2 := AdvancedLogger{}     // Create Logger
    greeter2 := NewGreeter(logger2) // Inject Logger into Greeter
    greeter2.Greet()                // Use Greeter
    // Logs:
    // ADVANCED: Hello, dependency injection and implicit interface!

    logger3 := CompositeLogger{loggers: []Logger{SimpleLogger{}, AdvancedLogger{}}}
    greeter3 := NewGreeter(logger3) // Inject CompositeLogger into Greeter
    greeter3.Greet()                // Use Greeter
    // Logs:
    // [CompositeLogger] Hello, dependency injection and implicit interface!
    // ADVANCED: [CompositeLogger] Hello, dependency injection and implicit interface!
}
```

---

# Chapter 8: Errors

- Go does not have exceptions.
- Errors are values.
- They are the last return value of a function (by convention).
- The `error` interface is defined in the standard library.
- The `errors` package is used to create errors.
- The `fmt` package is used to print errors.
- The `errors.Is` function is used to check for specific errors.
- The `errors.As` function is used to check for specific errors and get the underlying error.
- The `errors.Unwrap` function is used to get the underlying error, but `errors.Is` and `errors.As` are more commonly used for this.
- The `errors.New` function is used to create errors.
- The `errors.Errorf` function is used to create errors with formatting.
- When a function returns an error, it is expected that the caller will check for it.
- If a function does not return an error, its value will be `nil`, because it is the zero value for interfaces.
- Error messages should not be capitalized or end with punctuation, nor contain newline.
- Because all values must be read, errors cannot be ignored implicitly.
- Because the main code is unindented and the error handling code is indented, the code's purpose is easier to follow.

## Sentinel errors

- Sentinel errors are errors that are predefined and can be checked for equality.
- They are defined at the package level.
- They start with `Err` (except for `io.EOF`).
- They should be treated as read-only.
- They are used to indicate it is not possible to continue processing (e.g., `ErrFormat` for ZIP files).
- Whenever possible, use existing sentinel errors from the standard library.

## Wrapping errors

- To give additional context to an error, wrap it with `fmt.Errorf`.
- A series of errors can be wrapped with `fmt.Errorf` and `errors.Unwrap`: these are called *error chains*.
- If context is not required, a brand new error can be created with `errors.New` or `errors.Errorf`.
- The `%v` verb can be used to print the error chain without wrapping the error (e.g., `fmt.Errorf("internal failure: %v", err)`).

## `Is` and `As`

- Use `errors.Is` to check for specific errors.
- Use `errors.As` to check for specific errors and get the underlying error.
- `errors.As` can take as the second parameter a pointer to a variable of the type of the error we are looking for, but just as well it can take a pointer to an interface.

## Wrapping Errors with defer

- Using named return values and `defer` can make error handling easier because the error can be formatted only once at the end of the function.

## Panic and recover

- A panic is used to indicate that the program cannot continue (e.g., out of memory error or trying to read beyond the end of a slice).
- When a panic occurs, the program stops executing and the stack is unwound, running all deferred functions until the `main` function is reached.
- `panic` and `recover` are not intended to be used for error handling.
- It is better to explicitly handle errors than to use `panic` and `recover` because it is not clear in `recover` what failed exactly.

## Getting a Stack Trace from an Error

- Go doesn't provide a stack trace by default outside of a `panic` state.
- `%+v` can be used to print the stack trace with `fmt.Printf`.
- Pass the `-trimpath` flag to `go build` to remove the absolute path from the stack trace, which otherwise shows full paths to files.

---

# Chapter 9: Modules, Packages, and Imports

- The module is the root of the package tree. It can be defined in `go.mod` or inferred from the directory structure. For a GitHub repository, it is inferred from the URL as in `module github.com/{USER}/{PROJECT}`.
- Keep a single module per repository.

## `go.mod`

- Use `go mod init MODULE_PATH` to create a new module (`go.mod` file).
- The module path is case-sensitive.
- The minimum version of Go required to build the module can be specified with `go mod init MODULE_PATH GO_VERSION` and it appears in the `go.mod` file below the module declaration.
- There can be a `require` directive for each dependency.
- There are also two optional sections: `replace` and `exclude`.
  - `replace` is used to replace a dependency with a local version.
  - `exclude` is used to exclude a dependency from the build.

```{.go}
// Example of a go.mod file
module github.com/{USER}/{PROJECT}

go 1.xx

require (
    github.com/{OTHER_USER}/{OTHER_PROJECT} v0.0.0-20200921021027-5abc380940ae
    github.com/shopspring/decimal v1.2.0
)
```

## Building packages

### Imports and exports

- Import statements allow accessing exported constants, variables, functions and types from another package.
- An exported identifier starts with a capital letter. It cannot be accessed from another package without an import statement.

### Creating and accessing packages

- The first line of the file should be `package {PACKAGE_NAME}`. It's a *package clause*.
- Next is the import section.
  - Importing from the standard library doesn't require a path.
  - Any other imports require a path, using the module path as a prefix and appending the path to the package.
  - Not using any identifier from a path will result in a compiler error. Hence, all code included in the build will be used.
  - It is best to always use absolute paths for clarity.
  - The name of a package is determined by its package clause, *not by the path* being imported. In general, the package name should match the last element of the path.
  - The `main` package cannot be imported as it is the entrypoint of the application.
- Package names are in the file block: the package name is the same for all files in the same directory and must be present.

### Naming packages

- The package name should be descriptive.
- Avoid `util` and `common` packages. Create more packages with fewer functions instead.
- Don't include the name of the package in functions, as this will be disambiguated by the package name when importing.

### Organizing a module

- There is no official structure.
- The `cmd` directory is used for executables. There can be multiple executables produced by different applications from a module.
- When there are a bunch of files at the root to manage deployment and testing, it is a good pattern to put all packages inside a `pkg` directory.
  - Inside `pkg`, limit dependencies between packages by organizing the code according to the functionality it provides.
  - A good primer on the topic is [GopherCon 2018: Kat Zien - How Do You Structure Your Go Apps][organize-apps-yt].

### Overriding a package's name

- When names collide, you can use an alias to rename a package.
  - In the standard library, both `"crypto/rand"` and `"math/rand"` are imported as `"rand"`, but they can be disambiguated with an alias such as `crand "crypto/rand"`.
- Using the `.` alias is discouraged because it makes it harder to understand where a function is coming from as it will import all exported identifiers from the current namespace (same idea as `import * from ...` in Python).
- Package names can be shadowed, which renders it inaccessible. Always resolve conflicts by using an alias instead.

### Package comments and `godoc`

- Comments must be placed right above the item to be documented.
- Comments start with `//` and can be multiline.
- A blank line with `//` is used to create paragraphs.
- Preformatted text can be inserted with indentation.
- Comments before the package clause create package-level documentation.
  - If the package has a lot of documentation, it is better to put it in a separate file called `doc.go`.
- Comments should start with the name of the item being documented.

### Internal package

- Use the `internal` directory to create packages that are only accessible from the parent and sibling packages.
- Trying to access an `internal` package from outside the module will result in a compiler error.

### The `init` function

- If there is an `init` function in a package, it runs as soon as the package is referenced by another package.
- It has not input or output parameters and can only cause side-effects within the package.
- There can be multiple `init` functions in a package, even in the same file, although this setup is discouraged.
- A blank import can be used to run the `init` function of a package without using any of its exported identifiers, e.g. `import _ "github.com/lib/pq"`. Explicit is better than implicit: this is an obsolete pattern.

### Circular dependencies

- They are not allowed to keep the code readable and the compiler fast.
- If two packages depend on each other, they should probably be merged into a single package.
- If two packages with circular dependencies are still preferred, it may be possible to move only the culprits into a separate package so that both packages can import them.

### API renaming and organizing

- To avoid breaking a function name, a new method can be added with the new name, calling the old one.
- Constants can be re-declared with the same types, but with a different name.
- To rename exported types, we can create an alias such as `type Bar = Foo`. In this case, new methods should still be added to the original type to preserve backward compatibility.
- Caution: a field name cannot be changed without breaking backward compatibility.

## Working with modules

### Importing third-party code

- `go.mod` is used to manage dependencies.
- `go.mod` is automatically populated when a `go` command runs and a dependency is required (e.g., `go build`, `go list`, `go run`, `go test`).
- `go.sum` is used to verify the integrity of the dependencies.
- `god.mod` and `go.sum` should both be committed to version control.

### Working with versions

- `go list` is used to list dependencies used by a project.
  - By default, it lists packages used.
  - The `-m` flag is used to list modules used.
  - Appending the `-versions` flag to the previous command lists all versions of the dependencies.
- `go get` can be used to downgrade or upgrade a dependency (e.g., `go get github.com/{USER}/{PROJECT}@v1.0.0`).
  - It can also be used to add a new dependency.
  - It can be used to remove a dependency by adding the `-u` flag.
  - Changes will be reflected in `go.mod` and `go.sum`.
- Dependencies might be shown with `// indirect` next to them. This means that the dependency is not used directly by the project, but by one of its dependencies.
  - It can be added when the project uses that dependency directly with a newer version than what is declared in the dependency's `go.mod` file.
- Go follows semantic versioning (*SemVer*).
- There is an *import compatibility rule*: all minor and patch versions should remain compatible and if not, this is considered a bug.
  - Instead of importing multiple versions of the same library as with `npm`, Go will import the highest version of the library that satisfies the requirements.

### Updating to compatible versions

- Use `go get -u=patch DEPENDENCY_PATH` to update to the latest compatible patch version.
- `go get -u DEPENDENCY_PATH` will update to the most recent compatible version.

### Updating to incompatible versions

- Go follows the *semantic import versioning* rule: for all major versions greater than `1`, the major version is included in the import path, e.g. `"github.com/{USER}/{PROJECT}/v2"`.
- Once a new major version is used in the project, `go build` will update the `go.mod` file to use the new major version.
- Older versions may still be present in `go.mod`: `go mod tidy` can be used to remove them.

### Vendoring

- `go mod vendor` is used to create a `vendor` directory with all the dependencies to ensure reproducible builds.
- It dramatically increases the size of the project in version control.

### `pkg.go.dev`

- It automatically indexes Go projects.
- It is used to search for packages and their documentation.
- It publishes the godocs, license, `README`, the module's dependencies and which other open source projects depend on it.

## Publishing modules

- Go favors permissive licenses (e.g., MIT, BSD, Apache).
- There is no need for a central repository, as Go uses the module path to find the module.

## Versioning modules

- Minor and patch versions should be compatible and are easy to manage.
- Major versions are slightly more difficult to manage. For instance, let's go from `v1` to `v2`.
  - Create a directory to put all the old code in, named `v2`, including `README` and `LICENSE` files.
  - Create a branch.
    - Name the branch `v1` if the old code goes in it.
    - Name the branch `v2` if the new code goes in it.
  - Make sure the module path in `go.mod` ends with `/v2`.
  - Update all import paths to use the new module path.
  - Create a tag for the new version.
    - Name the tag `v2.0.0`.
    - Tag the `main` branch if the new code goes in it.
    - Otherwise, tag the `v2` branch.
- If breaking changes might be introduced while on the new version, use a pre-release version, e.g., `v2.0.0-alpha.1`.
- The open source project [`mod`][mod] can be used to automate this process.
- The Go Blog has a [post][go-blog-modules] on the topic.

## Module proxy servers

- Google manages a module proxy server that fetches all versions of all publicly available modules.
- Google also maintains a *sum database*, which stores the checksums of all the modules.
- Modules are only installed from the proxy server if they are not already present in the local cache and if the checksums match.

### Specifying a module proxy server

- The `GOPROXY` environment variable can be used to specify a module proxy server. To use GoCenter, set it to `GOPROXY=https://gocenter.io`.
- If the `GOPROXY` environment variable is set to `direct`, the module proxy server will not be used and the module will be downloaded directly from the source.
- Projects such as [`athens`][athens] can be used to create a local module proxy server.

---

# Chapter 10: Concurrency in Go

## When to use concurrency

- *Concurrency is not parallelism*.
- Concurrency is useful when there are multiple tasks that can be executed independently.
- Concurrency brings benefits when a process takes a long time to complete.
- Read [The Art of Concurrency][art-of-concurrency] for more information.
- The book [Concurrency in Go][concurrency-in-go] is also a great resource.

## Goroutines

- "*Goroutines are lightweight processes managed by the Go runtime*".
- Because Go manages goroutines, they are cheap to create and destroy (no need to create system-level resources).
- They are memory efficient because they are allocated on the stack with small initial sizes.
- Switching between goroutines is fast because it is managed by the Go runtime within a process.
- Go optimizes how work is distributed across goroutines.
  - For more details on this, watch [GopherCon 2018: Kavya Joshi - The Scheduler Saga][scheduler-saga].
- A goroutine starts by calling a function with the `go` keyword in front of it.

## Channels

- Channels are used to communicate between goroutines.
- They are a built-in type that require the `make` function to create them, e.g. `ch := make(chan int)`.
- The zero value of a channel is `nil`.
- They are passed as parameters to functions as a pointer.

### Reading, writing, buffering

- The `<-` operator is used to send and receive data from a channel. It indicates the direction of the data flow.
- A function parameter can specify the direction of the channel, e.g. `func f(ch <-chan int)` will make it so that the channel can only be read from. Likewise, `func f(ch chan<- int)` will make it so that the channel can only be written to.
- By default, channels are *unbuffered*, meaning that they can only hold one value at a time. They should be used most of the time.
- A channel can be buffered by specifying the buffer size when creating it, e.g. `ch := make(chan int, 10)`.
- `len(ch)` is used to get the number of elements in the channel.
- `cap(ch)` is used to get the capacity of the channel.
- The capacity of a channel cannot be changed after it is created.

### `for-range` and channels

- `for-range` can be used to read from a channel until it is closed, or until a `break` or `return` statement is encountered.
- There is a single variable declared for the channel, which is the value read from the channel.

```{.go}
for v:= range ch {
    fmt.Println(v)
}
```

### Closing a channel

- Close a channel with `close(ch)`.
- Writing to a closed channel will result in a runtime panic.
- Attempting to read from a closed unbuffered channel will return the zero value of the channel's type.
- Reading from a closed buffered channel will return the remaining values in the channel until it is empty, then it will return the zero value of the channel's type.
- To know if a channel is closed, use the second return value of the receive operation with the *comma ok* idiom, e.g. `v, ok := <-ch`.
  - `ok` will be `true` if the channel is open and `false` if it is closed.

### How channels behave

- They pause the execution of the goroutine until a value is available to read from the channel.
- They pause the execution of the goroutine until a value can be written to the channel.
- A `panic` will occur if a value is written to a closed channel or when trying to close a closed channel or a `nil` channel.
- Make the writer responsible for closing the channel.

### `select`

- *Starvation* is when a goroutine is waiting for a resource that is never available.
- It looks very similar to a `switch` statement.
- A `case` in a `select` statement is executed when the channel is ready to be read from or written to.
- If multiple `case` statements are ready, one is chosen at random -- with `switch`, the first match is always chosen. This solves the starvation problem since all cases are checked at once.
- `select` also deals with deadlock issues: if all channels are blocked, it will execute the `default` case.
- `select` is often used in a loop to keep reading from a channel until it is closed.
  - Having a `default` case inside a loop for a `select` is most certainly not what is intended as it will run constantly.

## Concurrency practices and patterns

### Keep APIs concurrency-free

- Never expose channels or mutexes in an API. If a channel is exposed, the user will have to manage it, know whether it is buffered or not, closed or not or `nil`. The user could also trigger deadlocks.

### Goroutines, for loops, and varying variables

- Instead of shadowing variables in a `for` loop, pass them as parameters to the goroutine.

```{.go}
// Don't do this
for _, v := range a {
    v := v // shadowing
    go func() {
        ch <- v * 2
    }()
}

// Do this instead
for _, v := range a {
    go func(val int) {  // value captured by the closure
        ch <- val * 2
    }(v)
}
```

### Always clean up your goroutines

- If a goroutine is not cleaned up, it will keep running until the program exits: this is called a "*goroutine leak*".

### "Done channel pattern"

- If multiple goroutines are running, it is useful to have a way to signal them to stop.
- A channel (`done`) can be used to signal the goroutines to stop.

### Using a cancel function to terminate a goroutine

- A cancel function can be used to terminate a goroutine.
- It is a function that performs a cleanup and closes a channel.

### When to use buffered and unbuffered channels

- Buffered channels are useful when limiting the number of goroutines that can access a resource at the same time, when limiting the amount of work that gets queued up or when the number of goroutines is known.
- Buffered channels are good to gather results from multiple goroutines when a deterministic order is not required.

### Backpressure

- Backpressure is a way to signal to a goroutine that it should slow down.
- It is implemented with buffered channels.

### Turning off a case in a `select`

- Setting a variable's channel to `nil` will turn off the case in a `select` statement.

```{.go}
for {
    select {
    case v, ok := <-in:
        if !ok {
            in = nil // kills the case
            continue
        }
        fmt.Println(v)
    // ... other cases ...
    case <-done:
        return
    }
}
```

### Time out code

- Use `time.After` to time out code.

```{.go}
select {
// this requires context cancellation to free up resources
// if the function is not finished before the timeout,
// else it will keep processing in the background
case v := <-ch:
    fmt.Println(v)
case <-time.After(1 * time.Second):
    fmt.Println("timed out")
}
```

### Using `WaitGroups`

- The *done channel pattern* works well when waiting for a single goroutine to finish.
- When waiting for multiple goroutines to finish, use a `sync.WaitGroup`.
- `Add` is used to add a goroutine to the wait group.
- `Done` is used to signal that a goroutine is done.
- `Wait` is used to wait for all goroutines to finish.
- Use them when some cleanup is required after all goroutines are done.
- [`ErrGroup`][errgroup] can be used to wait for multiple goroutines to finish and return an error if one of them fails.

```{.go}
func main() {
    var wg sync.WaitGroup
    var a = []int{1, 2, 3, 4, 5}
    wg.Add(len(a))
    ch := make(chan int, len(a))
    for _, v := range a {
        // The wait group is passed with a closure
        // Otherwise it would need to be passed as a pointer
        // So all goroutines share the same instance
        go func(val int) {
            defer wg.Done() // called even if panic
            ch <- val * 2
        }(v)
    }
    wg.Wait()
    close(ch)
    for v := range ch {
        fmt.Println(v)
    }
}
```

### Running code exactly once

- `once.Do` is used to run code exactly once.
- It can be found in the `sync` package.
- It needn't be initialized, as the zero value is usable.
- It is best to use the minimum amount of concurrency possible.

```{.go}
var once sync.Once

func main() {
    once.Do(func() {
        fmt.Println("Only once")
    })
    once.Do(func() {
        fmt.Println("Only once") // will not be printed
    })
}
```

## When to use mutexes instead of channels

- Mutex stands for *mutual exclusion*.
- Mutexes limit access to a resource to a single goroutine at a time with a locking mechanism (`Lock` and `Unlock`, which must be used carefully to avoid creating deadlocks, especially in functions implemented recursively).
- They require to do more bookkeeping than channels.
- They should never be copied, just like `sync.WaitGroup` and `sync.Once`.
- Use mutexes when there is a shared resource that needs to be protected, such as a field in a struct.
- `RWMutex` is used when there are multiple readers and a single writer. The *critical section* is protected by a write lock, while the read lock is used to read the resource by multiple goroutines.
- Sometimes, performance issues with channels can be solved by using mutexes instead.

## Atomics

- Atomics are used to perform atomic operations on integers and pointers.
- They are more niche than mutexes and channels and as such, they are not covered in this introductory summary on Go.

---

# Chapter 11: The Standard Library

- It is battery-included, just like Python.

## `io` and Friends

- `io` is used to read (`io.Reader`) and write (`io.Writer`) data.
- `io.Closer` is used to close a resource.
- Read (`io.ReaderAt`) and write (`io.WriterAt`) data at a specific offset.
- `io.Seeker` is used to seek to a specific offset.
- There are other combinations to define more explicitly the code's intent (`ReadWriter`, `ReadCloser`, `WriteCloser`, `ReadWriteCloser`, `ReadSeeker`, `WriteSeeker`, `ReadWriteSeeker`).
- The `io` package is a great example of the power of interfaces through simple abstractions.
- `Reader`, `Writer`, and `Scanner` from the `bufio` package are used to read and write data more efficiently on larger datasets.

## `time`

- `time` is used to work with dates and times.
- `time.Time` is used to represent a date and time.
- `time.Duration` is used to represent a duration.
- `time.Parse` is used to parse a string into a `time.Time` value.
- `time.Format` is used to format a `time.Time` value into a string.
- `time.Now` is used to get the current time.
- `time.Sleep` is used to pause the execution of a goroutine for a specified duration.
- `time.After` is used to create a channel that will receive a value after a specified duration.
- `time.Tick` is used to create a channel that will receive a value at regular intervals.
- `time.Timer` is used to create a timer that will send a value on a channel after a specified duration.
- `time.Ticker` is used to create a ticker that will send a value on a channel at regular intervals.
- `time.NewTicker` is used to create a new ticker.
- `time.NewTimer` is used to create a new timer.
- `time.Since` is used to get the time elapsed since a specified time.
- `time.Until` is used to get the time until a specified time.
- `time.AfterFunc` is used to execute a function after a specified duration.
- Use `Equal` to compare two `time.Time` values.
- `time.Time` includes the usual constants for days of the week, months, etc.

### Monotonic time

- Go uses a monotonic clock to measure time.
- A monotonic clock is a clock that counts up from the start of the computer.

### Timers and timeouts

- Use `time.NewTicker` to create a ticker that will send a value on a channel at regular intervals.
- Use `time.NewTimer` instead of `time.Tick`, as it can be stopped and reset.

## Encoding and JSON

- "*Marshalling*" is the process of converting a data structure into a byte stream.
- "*Unmarshalling*" is the process of converting a byte stream into a data structure.

### Use struct tags to add metadata

- Struct tags are strings written inside backticks that can be added to struct fields to add metadata.
- They can span only one line, taking the format `` `tagName:"tagValue"` ``.
- `go vet` can be used to check for struct tags validity.
- If no struct tag is specified, the field name will be used instead.
- Use a `-` for a field name to ignore it.
- `,omitempty` can be added right after the field name to omit a field if it is empty.
- While annotations can make the code more declarative and short, they can also make it harder to read and understand. **Go** for readability first.

### Unmarshalling and marshalling

- `json.Unmarshal` is used to unmarshal a JSON byte stream into a data structure.
- `json.Marshal` is used to marshal a data structure into a JSON byte stream.

### JSON, readers, and writers

- `json.Decoder` is used to decode a JSON byte stream into a data structure.
- `json.Encoder` is used to encode a data structure into a JSON byte stream (e.g., encoding a file given an interface: `json.NewEncoder(tmpFile).Encode(toFile)`).
- `json.NewDecoder` is used to create a new decoder (e.g., decoding a file given an interface: `json.NewDecoder(tmpFile2).Decode(&fromFile)`).
- `json.NewEncoder` is used to create a new encoder.

### Encoding and Decoding JSON Streams

- `json.Decoder` and `json.Encoder` can be used to encode and decode JSON streams.

### Custom JSON Parsing

- `json.Unmarshaler` is used to implement custom JSON parsing.
- `json.Marshaler` is used to implement custom JSON marshalling.

### `net/http`

- As a modern language, Go has a built-in HTTP client and server.
- Third-party libraries of interest in this space include [chi][chi] and [Gorilla Mux][gorilla-mux] for routing needs and [alice][alice] to deal with middleware chaining.

### Client

- Don't use the default client in production.
- Don't use the functions to make HTTP requests directly in production as they don't have timeouts.

### Server

- `http.ListenAndServe` is used to start a server.
- The *middleware pattern* is used to add functionality to a server, so as to check for authentication, logging, etc.

---

# Chapter 12: The Context

- Context is not a new feature: it is an instance that meets the `context.Context` interface and gets passed around as the first argument to functions, which is usually named `ctx`.
- `context.TODO` is used when a context is required but there is no context available. It shouldn't be used in production.

## Cancellation

- `context.WithCancel` is used to create a context that can be cancelled.
- When a cancellable context is created, a `cancel` function is returned. It is used to cancel the context and it **must** be called (at least once) using `defer`.

## Timers

A server can do a few things to manage its load:

- It can limit the number of concurrent requests it accepts.
  - It can be done by limiting the number of goroutines.
- It can limit the number of requests queued up.
  - This can be handled with a buffered channel.
- Limit the amount of time a request can take.
  - The context can be used to do this.
  - `context.WithTimeout` is used to create a context that will be cancelled after a specified duration.
  - `context.WithDeadline` is used to create a context that will be cancelled at a specified time.
- Limit the resources a request can use (memory, disk space...).
  - There is no built-in solution for this in Go.

## Values

- `context.WithValue` is used to create a context with a value.

---

# Chapter 13: Writing Tests

## Basics of testing

- The `testing` package is used to write tests.
- `go test` is used to run tests and generate reports.
- Tests are located in files with the suffix `_test.go` in the same package as the code being tested, so they have access to unexported identifiers.
- Test functions start with `Test` and take a `*testing.T` parameter. They do not return any value.
- The test function name should be descriptive. It can start with `Test_` to indicate the function under test is unexported.

### Reporting failure

- Use `t.Error` or `t.Errorf` to report a failure and continue the test. Use it to conveniently report as many failures as possible.
- Use `t.Fatal` or `t.Fatalf` to report a failure and stop the test. Use it when subsequent tests on the same function will fail or trigger a `panic`.
- Use `t.Log` to log information about the test.

### Setting up and tearing down

- `TestMain` is used to set up and tear down tests.
  - It is called *once* before and after all tests, not between each test.
  - Can be used to set up and tear down a database, for instance.
  - It can be used when package-level variables need to be initialized, although this probably means the code needs refactoring.
  - It takes a `*testing.M` parameter. Setup can be done at the beginning, then `exitVal := m.Run()` is called to run tests, then teardown can be done at the end, returning the exit value with `os.Exit(exitVal)`.
- Individual test functions receive a `*testing.T` parameter, which has a `Cleanup` method that can be used to clean up after a test.
  - The `Cleanup` method is similar to the `defer` statement but can be useful is the cleanup actions are performed for multiple tests from a helper function.

### Storing sample test data

- A directory named `testdata` can be created to store sample test data for the package under test, as the package directory is used for the currently working directory.
- Each package accesses its own `testdata` directory, so it is possible to have multiple `testdata` directories in a project: up to one per package.

### Caching test results

- `go test` caches test results to speed up subsequent runs.
- Tests recompile if the source code or the data in `testdata` changes.
- `go test -count=1` can be used to disable caching.

### Testing your public API

- Create a directory `packagename_test` to test the public API of a package, to be found at the same directory level as `packagename`.
- Test files in this case will be named `packagename_public_test.go`.
- Test your public API, not your implementation.
- This is used to test the exported functions and methods, not the unexported ones.

### Use go-cmp to compare test results

- It will output the differences between the expected and actual values in a human-readable format.
- It can be used to compare for strict equality as well as with custom comparators.

## Table tests

- Table tests are used to test a function with multiple inputs and outputs.
- Table-driven tests are idiomatic in Go.
- A slice of an anonymous struct is used to store the test cases.
- The test function iterates over the test cases and runs the test for each of them.

Given the following:

```{.go}
package adder

import (
    "testing"
)

func Add(a, b int) int {
    return a + b
}

func TestAdd(t *testing.T) {
    // Table of test cases
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"Positive integers", 1, 2, 3},
        {"Negative integers", -1, -1, -2},
        {"Two zeros", 0, 0, 0},
        {"Negative and positive", -1, 1, 0},
        {"Two large integers", 100, 200, 300},
    }

    for _, test := range tests {
        t.Run(test.name, func(t *testing.T) {
            result := Add(test.a, test.b)
            if result != test.expected {
                t.Errorf("Add(%d, %d) = %d; want %d", test.a, test.b, result, test.expected)
            }
        })
    }
}
```

The output would look like this:

```{.txt}
=== RUN   TestAdd
=== RUN   TestAdd/Positive_integers
--- PASS: TestAdd/Positive_integers (0.00s)
=== RUN   TestAdd/Negative_integers
--- PASS: TestAdd/Negative_integers (0.00s)
=== RUN   TestAdd/Two_zeros
--- PASS: TestAdd/Two_zeros (0.00s)
=== RUN   TestAdd/Negative_and_positive
--- PASS: TestAdd/Negative_and_positive (0.00s)
=== RUN   TestAdd/Two_large_integers
--- PASS: TestAdd/Two_large_integers (0.00s)
--- PASS: TestAdd (0.00s)
PASS
ok    github.com/{USER}/{PROJECT}/adder    0.368s
```

## Checking code coverage

- The `-cover` flag can be used to check code coverage.
- `go test -coverprofile=coverage.out` is used to generate a coverage profile.
- Go ships with a very cool tool to visualize the coverage profile: `go tool cover -html=coverage.out`.

## Benchmarks

- The built-in testing framework can be used to write benchmarks.
- Benchmarks are functions that start with `Benchmark` and take a `*testing.B` parameter.
- See [Profiling Go programs with pprof][evans-profiling] for more information on profiling Go programs.

## Stubs

- We can using function types and interfaces to create stubs.
- A test function can implement an interface and be passed to the function under test.
- A stub can be defined as a struct that implements the interface and has a field for each method of the interface. E.g., `type MathSolverStub struct {}`.
- When testing larger interfaces, one can define a stub that implements only the methods required for the test.
- For mocks, use a mocking library such as [gomock][go-mock] or [testify][testify].

## `httptest`

- `httptest` is used to test HTTP servers without having to start them.
- A complete, real-world example is provided in the [`test_examples` repo][test-examples].

## Integration tests and build tags

- Integration tests are used to test the interaction between multiple components.
- A build tag is a comment that starts with `// +build` and is followed by a tag name, found on the first line of a file.
- Files with no build tags are included in all builds.
- If a file has a build tag like `// +build integration`, then it can be run with `go test -tags=integration -v ./...`.
- To skip tests that take a long time to run, use `t.Skip`.

```{.go}
func TestFileLen(t *testing.T) {
    if testing.Short() {
        b.Skip("skipping test in short mode.")
    }
    // ...
}

// Skip it when testing in short mode
// go test -short -v ./...
```

## Finding concurrency problems with the race checker

- A *data race* is still possible in Go with its built-in concurrency features if a lock hasn't been acquired.
- Go comes with a race checker for just these cases: `go test -race`.
- Adding "sleep" statements is definitely not the correct approach.
- The race checker can also run after building a binary: `go build -race`. This is useful to detect race condition issues for code that is not covered by tests.
- Note that the race checker makes the code about 10 times slower, so use it only when needed.

---

# Chapter 14: Here There Be Dragons: Reflect, Unsafe, and Cgo

- Theses features are not used that often, but they are useful to know about.
- You cannot make make methods with reflection.
- It should only be used when there is no other way to do it.
- It may increase maintenance cost, because crashes can happen in production due to the lack of type safety (Java *cough* Script *cough*).
- This summary will only cover their starting point.

## Reflection to work with types at runtime

- This can be used to work with data that didn't exist at compile time.
- Use cases:
  - Reading and writing from a database;
  - Template engines;
  - `fmt` uses it heavily;
  - `errors` uses it to implement `errors.Is` and `errors.As`;
  - `sort` uses it to sort slices of arbitrary types;
  - Marshalling/unmarshalling JSON and XML;
  - Comparing maps or slices for deep equality with `reflect.DeepEqual`.

### Types, kinds, and values

- A type is a description of a value's structure and behavior.
- A kind is a description of a type's behavior.
- A value is a representation of a type's behavior.
- A type can have multiple kinds.
- A value can have multiple types.
- `reflect.TypeOf` is used to get the type of a value.
- `reflect.Type` is used to represent a type.

### Making new values

- `reflect.New` is used to create a new value of a type (`reflect.Type` as input, `reflect.Value` as output).

### Use reflection to check if an interface's value is `nil`

- `IsValid` is used to check if a value is valid (e.g., `iv := reflect.ValueOf(i)`, `iv.IsValid()`, `iv.IsNil()`).

### Use reflection to write a data marshaler

- `reflect.ValueOf` is used to get the value of a field.
- `reflect.Type` is used to get the type of a field.
- `reflect.StructField` is used to get the field's metadata.
- `reflect.StructTag` is used to get the struct tag.
- There is a complete example of a CSV data marshaler [on the Go Playground][csv-marshaler].

### Build functions with reflection to automate repetitive tasks

- `reflect.MakeFunc` is used to create a function.
- `reflect.ValueOf` is used to get the value of a function.
- `reflect.TypeOf` is used to get the type of a function.
- Reflection makes the program slower.

### You can build structs with reflection, but don't

- `reflect.StructOf` is used to create a struct.

## `unsafe`... is unsafe

- It allows manipulating memory directly.
- `Sizeof` is used to get the size of a type (*"returns how many bytes it uses"*).
- `Offsetof` is used to get the offset of a field (*"returns the number of bytes from the start of the struct to the start of the field"*).
- `Alignof` is used to get the alignment of a field (*"returns the byte alignment it requires"*).
- `unsafe.Pointer` is used to convert a pointer to a pointer of a different type. Pointer arithmetic is possible just like in C or C++.

### Use unsafe to convert external binary data

- `unsafe` is used to convert external binary data.
- It can be use to gain performance when interacting with the system.
- It can speed up marshalling and unmarshalling (about twice as fast for simple structs).

### unsafe strings and slices

- `reflect.StringHeader` is used to get the header of a string.

## `cgo` is for integration, not performance

- It is best used to integrate with C libraries.
- `cgo` is the FFI (foreign function interface) of Go.
- You can call C functions from Go... and even *Go functions from C*!
- Garbage collection makes it hard to use `cgo` for performance.
- Only use it when there's no suitable Go library available.

---

# Chapter 15: A Look at the Future: Generics in Go

- Go doesn't convert types implicitly.
- For a gentle introduction to the topic, there is [Tutorial: Getting started with generics][go-generics-tutorial].

## Generics reduce repetitive code and increase type safety

- Generics are akin to "type parameters".
- Without generics, Go has to use `interface{}` and type assertions.
- `any` is used to represent any type.
- Generics allow specifying the type of a generic function's parameters, such as `func Sum[T any](a, b T) T { return a + b }`.

## Use type lists to specify operators

- A "type list" is a list of types.

```{.go}
type BuiltInOrdered interface {
    type string, int, int8, int16, int32, int64, float32, float64,
        uint, uint8, uint16, uint32, uint64, uintptr
}
```

---

# Salient takeaways

- Go is a **practical** language, valuing clarity of intent and readability (e.g., standard formatting is mandatory). It takes the best of other languages and leaves out the rest.
- Comprehensibility is more important than conciseness in idiomatic Go.
- Go is "*call by value*", meaning it makes copies of function parameters before passing them along.
- Deployment is a breeze: a single binary file.
- Go doesn't have classes nor inheritance, but it has structs and interfaces.
- Professionals use error handling profusely to make their programs more robust.

---

# Conclusion

This book achieves its goal of teaching readers how to write idiomatic Go code that leverages the strengths of the language. It focuses on real-world examples and best practices to structure Go code, rather than just explaining language syntax. The book covers a wide range of topics including primitive types, control structures, composite types like arrays and maps, concurrency, reflection, testing, and more.

We covered the key takeaways from each chapter, providing a broad overview of important concepts. While not a replacement for reading the book in its entirety, this summary may serve as a helpful reference guide on the subject. Whether you are just starting with Go or are looking to improve your skills, [Learning Go][learning-go] is an invaluable resource and I highly recommend it!

---

# Resources and references

[alice]: https://github.com/justinas/alice
[art-of-concurrency]: https://www.oreilly.com/library/view/the-art-of/9780596802424/
[athens]: https://github.com/gomods/athens
[atof.go]: https://cs.opensource.google/go/go/+/refs/tags/go1.21.2:src/strconv/atof.go
[chi]: https://github.com/go-chi/chi
[code-complexity]: https://link.springer.com/article/10.1007/s10664-017-9508-2
[concurrency-in-go]: https://www.oreilly.com/library/view/concurrency-in-go/9781491941294/
[csv-marshaler]: https://go.dev/play/p/3kwe7ag1i1C
[errgroup]: https://pkg.go.dev/golang.org/x/sync/errgroup
[evans-profiling]: https://jvns.ca/blog/2017/09/24/profiling-go-with-pprof/
[go-blog-modules]: https://go.dev/blog/v2-go-modules
[go-by-example]: https://gobyexample.com/
[go-cmp]: https://github.com/google/go-cmp
[go-generics-tutorial]: https://go.dev/doc/tutorial/generics
[go-mock]: https://github.com/uber-go/mock
[go-prog-language]: https://www.oreilly.com/library/view/the-go-programming/9780134190570/
[go-wiki]: https://github.com/golang/go/wiki
[gorilla-mux]: https://github.com/gorilla/mux
[learning-go]: https://www.oreilly.com/library/view/learning-go/9781492077206/
[marshalling]: https://en.wikipedia.org/wiki/Marshalling_(computer_science)
[mod]: https://github.com/marwan-at-work/mod
[organize-apps-yt]: https://www.youtube.com/watch?v=oL6JBUk6tj0
[scheduler-saga]: https://www.youtube.com/watch?v=YHRO5WQGh0k
[testify]: https://github.com/stretchr/testify
[testing-pkg]: https://pkg.go.dev/testing
[test-examples]: https://github.com/learning-go-book/test_examples

## Articles

- [Evaluating code complexity triggers, use of complexity measures and the influence of code complexity on maintenance time][code-complexity], Springer
- [Go Modules: v2 and Beyond][go-blog-modules], go.dev
- [Go Release History](https://go.dev/doc/devel/release), go.dev
- [Marshalling][marshalling], Wikipedia
- [Profiling Go programs with pprof][evans-profiling], Julia Evans

## Books

- [Concurrency in Go][concurrency-in-go], Katherine Cox-Buday, O'Reilly
- [Learning Go][learning-go], Jon Bodner, O'Reilly
- [The Art of Concurrency][art-of-concurrency], Clay Breshears, O'Reilly
- [The Go Programming Language][go-prog-language], Alan A. A. Donovan and Brian W. Kernighan, Addison-Wesley Professional

## Documentation

- [`atof.go`][atof.go], cs.opensource.google
- [`builtin` documentation](https://pkg.go.dev/builtin), pkg.go.dev
- [CodeReviewComments](https://github.com/golang/go/wiki/CodeReviewComments), GitHub
- [Effective Go](https://go.dev/doc/effective_go), go.dev
- [ErrGroup][errgroup], pkg.go.dev
- [Go By Example][go-by-example], gobyexample.com
- [Go Wiki][go-wiki], GitHub
- [How to Write Go Code](https://go.dev/doc/code), go.dev
- [Standard library documentation](https://pkg.go.dev/std), pkg.go.dev
- [The Go Programming Language Specification](https://go.dev/ref/spec), go.dev

## Other open source projects referenced

- [Alice][alice], GitHub
- [Chi][chi], GitHub
- [go-cmp][go-cmp], GitHub
- [Gorilla Mux][gorilla-mux], GitHub
- [Learning Go: Code examples](https://github.com/learning-go-book), GitHub
- [Mod][mod], GitHub

## Testing

- [gomock][go-mock], GitHub
- [Profiling Go programs with pprof][evans-profiling], Julia Evans
- [`test_examples` repo][test-examples], GitHub
- [`testing` package][testing-pkg], pkg.go.dev
- [testify][testify], GitHub

## Videos

- [GopherCon 2018: Kat Zien - How Do You Structure Your Go Apps][organize-apps-yt], YouTube
- [GopherCon 2018: Kavya Joshi - The Scheduler Saga][scheduler-saga], YouTube
