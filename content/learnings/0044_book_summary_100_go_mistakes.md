Title: Book summary: 100 Go Mistakes and How to Avoid Them
Date: 2024-08-24 14:55
Tags: best-practice, books, go, skimming-notes
Slug: book-summary-100-go-mistakes-and-how-to-avoid-them
Authors: Sébastien Lavoie
Summary: _100 Go Mistakes and How to Avoid Them_ is a truly insightful book by [Teiva Harsanyi](https://teivah.dev/) that covers common mistakes made by Go developers. This summary provides a high-level overview of the book's content.

[TOC]

---

# Go: Simple to learn but hard to master

## Go outline

- Go does not have:
    - Type inheritance;
    - Macros;
    - Partial functions;
    - Support for lazy variable evaluation;
    - Support for immutability;
    - Operator overloading;
    - Pattern matching;
    - ...
- Go is:
    - Stable;
    - Expressive;
    - Fast to compile;
    - Safe (type-safety);
    - Simple;
    - Excellent for concurrent programming (goroutines, channels).

## Simple doesn't mean easy

- Concurrency in Go may be _simpler_ than in other languages, but it is still hard to get right, as per [this study][concurrency-bugs].

## 100 Go mistakes

- Learning from mistakes is efficient.
- _"the best time for brain growth is when we're facing mistakes"_ ([source][mind-your-mistakes]).
- _"we can remember not only the error but also the context surrounding the mistake"_ ([source][learning-from-errors]).
- Categories of mistakes
    - Bugs
        - Bugs are very costly ([source][costly-bugs]).
        - Bugs can be very dangerous (e.g., in the case of a radiation therapy machine).
    - Needless complexity
        - Don't over-complicate things.
    - Weaker readability
        - _"the ratio of time spent reading versus writing is well over 10 to 1"_ ([source][clean-code]).
        - Nested code.
        - Data type representation.
        - Not using named result parameters.
    - Suboptimal or unidiomatic organization
        - Utility packages.
        - Init functions.
    - Lack of API convenience
        - Overusing `any` types.
        - Wrong creational pattern.
        - Blindly applying OOP principles.
    - Under-optimized code
        - Lack of fundamental knowledge.
        - Impacted performance.
        - Floating-point accuracy.
        - Poorly parallelized execution.
        - Not knowing how to reduce allocations.
        - Data alignment.
    - Lack of productivity
        - Know how to write efficient tests.
        - Use the standard library.
        - Use profilers and linters.

---

# Code and project organization

## 1 - Unintended variable shadowing

- A variable name declared in a block can be re-declared in a nested block (_variable shadowing_).

```go
// client is shadowed
var client *http.Client  // will always be nil
 if tracing {
  client, err := createClientWithTracing()
  if err != nil {
   return err
  }
  log.Println(client)
 } else {
  client, err := createDefaultClient()
  if err != nil {
   return err
  }
  log.Println(client)
 }
```

- Solutions
    - Use a temporary variable name in the inner scope.
    - Use the `=` operator instead of `:=` in the inner scope. Leads to a single assignment. Error handling can be handled in the outer scope (`client, err = ...`).
    - Be caution with reusing `err` as well.

## 2 - Unnecessary nested code

- Put the happy path first and return early on all edge cases and errors.
- Instead of using `else` blocks, use early returns.
- Instead of checking for an happy path, check for the error path and return where possible.

## 3 - Misusing init functions

- Refresher on `init` functions
    - An init function is a special function that is executed before the main function. It takes no arguments and returns no values.
    - Variables are initialized, the `init` function is called, and then the `main` function is called.
    - Imported packages are initialized before the `main` function is called and before the `init` function in the main package is called because the main package depends on the imported packages.
    - Packages can define multiple `init` functions, in which case they are executed in alphabetical order based on the source code file name. Hence, we should not depend on the order of execution of `init` functions as file names can change.
    - The same source file can define multiple `init` functions, in which case they are executed in the order they are defined in the file.
    - The underscore operator (`_`) can be used to import a package without using it. This is useful to execute the `init` function of a package without using the package itself.
    - `init` functions cannot be invoked explicitly.
- When to use `init` functions
    - They should not be used to initialize variables, as error handling is limited (they don't return errors, one must `panic`).
    - When testing a package, the `init` function is executed before the tests are run.
    - If side effects are achieved via variables, these become global variables, which pollute the global namespace. Any function in the package can access these variables, which can lead to unexpected behavior. Unit tests depending on such functions will be harder to write.
    - The responsibility of error handling should be left up to the caller.
    - _They can be helpful to define static configurations_, as is done in [the `init` function of the Go blog][init-go-blog].

## 4 - Overusing getters and setters

- Go has no support for automatic getters and setters, and it is idiomatic to use direct access to fields.
- When the use case justifies it, a getter should be named `FieldName` (not `GetFieldName`) and a setter should be named `SetFieldName`.

## 5 - Interface pollution

- Go's interfaces are satisfied implicitly (structural typing).
- _"The bigger the interface, the weaker the abstraction."_ — Rob Pike
- When to use interfaces
    - Common behavior
        - The behavior is factored out into an interface when it is common to multiple types (e.g., `sort.Interface`).
    - Decoupling
        - The implementation is decoupled from the interface, which allows for easier testing and swapping of implementations.
    - Restricting behavior
        - The interface restricts the behavior of the type, which can be useful for enforcing constraints. For example, the `io.Reader` interface restricts the behavior of the type to reading. It is possible to enforce constraints such as with a getter interface that only has a `Get` method and prevents setting values.
- Interface pollution
    - Abstractions should be discovered, not invented. Only create interfaces when they are needed.
    - Adding levels of indirection makes the code harder to understand.

## 6 - Interface on the producer side

- _Producer side_ refers to an interface defined in the same package as the type that satisfies it.
- _Consumer side_ refers to an interface defined in a package that uses it and which is independent of the package that implements the interface.
- The client should determine the level of abstraction it needs.
- This relates to the _Interface segregation principle_ of SOLID.

## 7 - Returning interfaces

- In many cases, this is a bad practice in Go.
- _"Be conservative in what you do, be liberal in what you accept from others."_ — Transmission Control Protocol
    - Return structs instead of interfaces.
    - Accept interfaces if possible.
- Interfaces might be returned (e.g., `io.Reader`), but this should be done with caution. It's usually done when the interface itself is implemented on the producer side (e.g., standard library) and the consumer side (e.g., user code) is expected to use it.

## 8 - `any` says nothing

- The `interface{}` type is a placeholder for `any` type. `any` is an alias for `interface{}` since Go 1.18.
- It requires a type assertion to be used.
- Using `any` does not convey any meaningful information about the type.
- It will lead to issues compilation-wise.

## 9 - Being confused about when to use generics

- A "type parameter" is a placeholder for a type that is specified when the function is called.
- A constraint is a condition that the type parameter must satisfy (e.g., implement an interface like `comparable`).

```go
type intStringConstraint interface {
    ~int | ~string
      // ^--- union operator
}
```

- The union operator (`|`) is used to specify that the type parameter must be either `int` or `string`.
- The tilde (`~`) is used to restrict all the underlying types of the type parameter to the specified types.
- Common uses and misuses
    - Generics are useful to factor out common behavior (e.g, the `sort` interface).
        - Data structures (e.g., binary tree, linked list, heap).
        - Functions working with slice, map, channels of any type.
    - Generics are not useful when the behavior is not common.
        - If the method of the type argument is called, then the generic should be removed in the function received and a type should be specified in the function parameter.
    - Generics do not shine when they make the code more complex. Unnecessary abstraction should be avoided.

## 10 - Not being aware of the possible problems with type embedding

- A type embedding is a way to reuse the fields and methods of a type in another type. The fields from that other type get "promoted" to the new type (i.e., they can be accessed directly from the new type, as well as through the embedded type).
- Incorrect usage
    - An example of a wrong use of type embedding is a `sync.Mutex` embedded in a struct. It will be available outside the struct and can be misused.
    - It shouldn't be used only as syntactic sugar to access the methods of the embedded type. Use a field instead.
    - It shouldn't promote fields that are not intended to be used outside the struct (e.g., `sync.Mutex`).
- Correct usage
    - A custom logger that wants to write and close may embed a `io.WriteCloser` interface so that both methods are available. They will be promoted to the new type and there won't be a need to implement these methods simply to forward a call to the embedded type.
    - Preventing type embeddings in public structs is probably the safest route.
- Embedding vs. OOP subclassing
    - Embedding is not subclassing. It is a way to reuse fields and methods of a type in another type. It is a form of composition.

## 11 - Not using the functional options pattern

- Config struct
    - This is limited because to bring flexibility and distinguish between the zero value and the default value, one must use pointers.
- Builder pattern
    - To keep chaining method calls, one should not return an error, which means validation is delayed.
    - To have proper error handling along the way, it makes the configuration more complex than it needs to be.
- Functional options pattern
    - This pattern makes use of closures to set the configuration options, where the closure is an anonymous function being returned.
    - The closure is called with the configuration struct as an argument, and it sets the configuration options.
    - This pattern allows for validation of the configuration options and for the configuration to be set in a single call.
    - It is a flexible pattern that allows for the configuration to be set in any order and for the configuration to be validated at the time of setting.
    - One does not need to provide a default value for the configuration struct since the function accepts variadic arguments, which may be empty.

## 12 - Project misorganization

- Project structure
    - The [`project-layout`][project-layout] is a great place to start for a complex application. Despite not being an official standard, it is a great and logically sound starting point.
- Package organization
    - There is no concept of subpackages in Go. Sub-directories are useful to have high cohesion.
    - Hexagonal architecture group per technical layer.
    - An alternative is to group by context (e.g., customer context, contract context).
    - Avoid both nano and huge packages.
        - Nano packages probably mean there's lack of understanding about the connections between the different files.
        - Huge packages dilute the meaning of the package.
        - Name a package after what they _provide_, not what they _contain_.
        - _"Package names should be short, concise, expressive and, by convention, a single lowercase word"_.
    - Minimize what should be exported as much as possible to reduce coupling.

## 13 - Creating utility packages

- `utils`, `common`, `base`... bad practice.
- `util` is meaningless.
- While nano packages should be avoided, if a few functions are highly cohesive and don't belong anywhere else, it's a good idea to keep them separate with good naming.
- Make APIs expressive.

## 14 - Ignoring package name collisions

- Naming a variable the same as a package name will shadow the package name.
- Either rename the variable (`redisClient := redis.NewClient()`) or rename the import with an alias (`import redisapi "mylib/redis"`).
- The same is true for built-in functions like `copy`: they shouldn't be shadowed.

## 15 - Missing code documentation

- Simplifies how clients consume an API.
- Helps in maintaining a project.
- In Go, every exported element should be documented, starting with the name of the element being documented (e.g., `Customer is ...`). It should be a complete sentence ending with a period.
- An element can be marked as deprecated with a comment starting with `Deprecated:` after the description of the element.
- The convention to document a package is to have a comment at the top of the file with the package name and a description of the package, starting with `// Package packageName ...`. The first line should be concise, then a blank line, then a more detailed description.
- Comments at the top of the file will be omitted from the documentation if they are followed by a blank line and more comments.

## 16 - Not using linters

- Automatic tool to analyze code and catch errors.
- They help prevent mistakes automatically and consistently.

---

# Data types

## 17 - Creating confusion with octal literals

- Using `0o` instead of `0` for octal literals is clearer.
- Octal is still useful to express file permissions (e.g., `0644`).
- Go supports using underscores in numeric literals to improve readability (e.g., `1_000_000`).

## 18 - Neglecting integer overflows

- It won't panic at runtime. They are silent bugs.
- It will wrap around.
- Use the `math` package to check for overflows.
- Detecting integer overflow when incrementing
    - Use `math.MaxInt`, `math.MinInt`, `math.MaxUint`, `math.MinUint`.
- Detecting integer overflows during addition
    - Use `math.MaxInt - a < b` or `math.MaxUint - a < b`.
- Detecting integer overflows during multiplication
    - Use `math.MaxInt/a < b` or `math.MaxUint/a < b`.

## 19 - Not understanding floating points

- A _mantissa_ is the significant part of a floating-point number.
- The _exponent_ is the power of 10 by which the mantissa is multiplied.
- For `float32`, the mantissa is 23 bits and the exponent is 8 bits.
- For `float64`, the mantissa is 52 bits and the exponent is 11 bits, the remaining bit is the sign bit.
- It is best to avoid comparing by equality with floating-point numbers and instead use a tolerance (delta).
- Use `math.IsInf` and `math.IsNaN` to check for infinity and NaN.
- Group floating-point numbers together by their magnitude to reduce precision loss when adding and subtracting.
- With calculations involving both addition/subtraction and multiplication/division, it is best to perform the multiplication/division first to reduce precision loss.

## 20 - Not understanding slice length and capacity

- Slice data is stored contiguously in an array data structure.
- A slice holds a pointer to the array, the length of the slice, and the capacity of the slice.
- Trying to access an index greater than the length of the slice will result in a runtime panic, even though the capacity is greater.
- Slicing a slice will create a new slice with the same underlying array, but with a different length and capacity.
- The `append` function will create a new slice with a new underlying array if the capacity is exceeded.

## 21 - Inefficient slice initialization

- Use `make` to initialize a slice with a specific length and capacity.
- Set a length of `0` (2nd argument to `make`) and a capacity of `n` (3rd argument to `make`), which will reuse the same backing array until the capacity is exceeded.
- One can also set only the length and use direct assignment instead of `append` (`bars[i] = fooToBar(foo)`). This is about 400% faster than using an empty slice.
- If the length of the slice is already known, it is better to take advantage of it and set the length of the slice when initializing it.

## 22 - Being confused about nil vs. empty slices

- A slice is empty if its length is equal to 0.
- A slice is `nil` if it equals `nil`.
- A `nil` slice is an empty slice.
- A `nil` slice can be passed in a single line: `s := append([]int(nil), 42)`.
- A nil slice is marshaled as a `null` element, whereas a non-nil, empty slice is marshaled as an empty array.

## 23 - Not properly checking if a slice is empty

- _"[...] when designing interfaces, we should avoid distinguishing nil and empty slices, which leads to subtle programming errors"_.
- _"This principle is the same with maps. To check if a map is empty, check its length, not whether it's nil"_.
- Do `len(slice) != 0` instead of `slice != nil`.

## 24 - Not making slice copies correctly

- The destination slice must have the same length as the source slice (or greater). Else, the copy will match the length of the destination slice and may be missing elements.
- `copy` is the more idiomatic way to copy slices (vs. `dst := append([]int(nil), src...)`).

## 25 - Unexpected side effects using slice `append`

- If the resulting slice as a length smaller than the capacity, the slice will be modified in place and will have unintended side effects.
- To avoid side effects outside a given range of a slice, _full slice expression_ can be used (e.g., `s := []int{1, 2, 3}`, then `s[:2:2]` will create a new slice with a length of 2 and a capacity of 2).

## 26 - Slices and memory leaks

- Leaking capacity
    - Slicing a huge slice to a smaller slice will keep the capacity of the original slice. This makes matters worst if the result of a slice is kept for many iterations in a loop.
    - Instead, use `copy` to create a new slice with the necessary length.
- Leakage with full slice expressions
    - The issue is the same as with slicing.
    - The solution is the same as with slicing.
- Slice and pointers
    - A slice holds a pointer to an array, so if the slice is kept, the array will be kept in memory.
    - To avoid this, use `copy` to create a new slice with the necessary length.
    - If however we want to keep the original capacity, we can set all the unneeded elements to `nil` explicitly. For instance, all elements but the first 2:

```go
for i := 2; i < len(foos); i++ {
        foos[i].v = nil
    }
```

## 27 - Inefficient map initialization

- Maps are unordered collections of key-value pairs, where all keys are unique. They use hash tables under the hood.
- Insertion can be an `O(n)` operation if the map is resized.
- `make` can be used to initialize a map with a specific size (second argument to `make`, without capacity). This avoids having to grow the map and re-balancing all the buckets of 8 elements each.

## 28 - Maps and memory leaks

- The number of buckets in a map cannot shrink. Removing elements from a map will not reduce the number of buckets.
- Even the overflown buckets will not be reduced.
- One possible solution: periodically copy the map to a new map.
    - Downside: the amount of memory used will be doubled for a short period of time.
- Another solution: update the value type of the map to store an array pointer.
    - The peak memory consumed will be far less.
    - The garbage collection will be more efficient.

## 29 - Comparing values incorrectly

- `==` does not work for slices, maps, and functions.
- `reflect.DeepEqual` could be used, but it's about 100x slower than `==`, and so might be better used for testing only.
- If strict comparison is needed on structs and good performance is required, consider using a custom comparison function.

---

# Control structures

## 30 - Ignoring the fact that elements are copied in range loops

- In Go, every assignment leads to a copy of the value.
- In a range loop, the value is copied, not the reference.
- To update a slice with a range loop, one must use the index to update the slice, i.e., `for i := range s { s[i] = ... }`.
- A classic `for` loop can be used to update the slice in place, i.e., `for i := 0; i < len(s); i++ { s[i] = ... }`.
- Using a pointer to a slice will allow for the slice to be updated in place, but iterating over such a slice is less efficient for the CPU.

## 31 - Ignoring how arguments are evaluated in range loops

- Looping over an array will copy the value of the array element.
- Using a pointer to the array will allow for the array to be updated in place and will avoid copying values, which may be more efficient, especially on large arrays.
- The `range` loop evaluates the expression to its right only once, so if the expression is a slice, the slice will not be updated in the loop.
- To access updated elements of a slice during iteration with a `range` loop, one must use the index to access the element in the slice, not the value of the element, since the expression is copied to a temporary variable.

## 32 - Ignoring the impact of using pointer elements in range loops

- Using a pointer to a slice when looping with a `range` loop can lead to storing the address of the temporary variable in the slice for all elements in the slice.
- To avoid this issue, one can create a local variable for each element to be iterated over in the slice and then use the local variable in the loop to perform assignments.
- Another solution is to use a `range` loop with the index, create a temporary variable by dereferencing the pointer, and then assign the temporary variable to the slice.

## 33 - Making wrong assumptions during map iterations

- Maps don't sort keys.
- Insertion order is not preserved.
- Iteration order is unspecified. This is a conscious language design choice so that developers don't rely on the order of the keys.
- One should work on a copy of a map if new elements are to be added or removed during iteration.

## 34 - Ignoring how the break statement works

- `break` works on the innermost loop, whether that be a `for`, `switch`, or `select`.
- To break outside of a loop, one can use a label.
- A label can be an idiomatic way to break out of nested loops, as is done in the `net/http` package with a `readlines:` label.

## 35 - Using `defer` inside a loop

- `defer` is a statement that schedules a function to be called when the surrounding function returns. That is, it won't run on each iteration of the loop until it returns, if ever.
- To avoid resource leaks like this, each iteration of the loop can use a separate function that is run and defers the cleanup.
- Another solution is to use a closure, but this can be less readable.
- A function call will decrease performance slightly, so if performance is a concern, the `defer` call should be handled manually before the loop.

---

# Strings

## 36 - Not understanding the concept of a rune

- A charset is a set of characters.
- An encoding describes how to translate a character set into a sequence of bytes.
- In Go, a string is a reference to an immutable slice of bytes.
- A rune is a Unicode code point.
- Source code in Go is encoded in UTF-8: string literals will then also be encoded in UTF-8.
- UTF-8 is a variable-length encoding, where each code point is represented by one to four bytes. For instance, the string `hello` is represented by five bytes, but the string containing the character `汉` is represented by three bytes, which we can check with `len("汉")`.
- A rune is an alias for `int32` (4 bytes = 32 bits).
- The repository `golang.org/x` contains extensions to work with UTF-16 and UTF-32.

## 37 - Inaccurate string iteration

- With the `unicode/utf8` package, one can use `utf8.RuneCountInString(s)` to count the number of runes in a string.
- Accessing specific runes can be done without converting the string if characters are in the ASCII range.
- It is most useful to convert a string to a slice of runes when a specific rune is required by index.
- Iterating over the runes with a `for range` loop returns the starting index of the rune and the rune itself.
- Iterating with a `for range` using only the index returns the starting index of the rune and the byte value at that position.

## 38 - Misusing trim functions

- Use `TrimRight` to remove trailing characters. Go backwards until a rune is not in the set of characters to be trimmed.
- Use `TrimSuffix` to remove a suffix (only one substring occurrence).
- Use `TrimLeft` to remove leading characters. Go forwards until a rune is not in the set of characters to be trimmed.
- Use `TrimPrefix` to remove a prefix (only one substring occurrence).

## 39 - Under-optimized string concatenation

- `+=` is inefficient for string concatenation because it creates a new string each time.
- Use `strings.Builder` for efficient string concatenation.
- Call `Grow` on the builder to allocate memory for the string.

## 40 - Useless string conversions

- Working with `[]byte` is more efficient than working with strings due to many interfaces in the standard library taking `[]byte` as input, which avoids doing a conversion.
- Most methods in the `strings` package have a `[]byte` counterpart in the `bytes` package.

## 41 - Substrings and memory leaks

- A substring shares the same backing array as the original string.
- If the substring is kept, the original string will be kept in memory.
- To avoid this, either use `string([]byte(theString[:n]))`  to slice the needed part of the string or `strings.Clone` to create a new string.

---

# Functions and methods

## 42 - Not knowing which type of receiver to use

- Go does not pass values by reference.
- A value receiver makes a copy of the value: changes are local to the method.
- A pointer receiver passes the memory address of the value: changes are global to the value. Strictly speaking, this is still a copy, but the copy is made for a pointer.
- Use a pointer receiver when:
    - The method needs to mutate the receiver.
    - The method receiver contains a field that cannot be copied.
    - The receiver is a large struct.
- Use a value receiver when:
    - Enforcing immutability.
    - The receiver is a `map`, `func` or `chan`.
    - A slice that doesn't have to be mutated.
    - The receiver is a small struct or array with no mutable fields, like `time.Time`.
    - The receiver is a basic type, like `int`, `float64`, or `string`.
- Mixing value and pointer receivers can lead to confusion and bugs: this should generally be avoided (although the standard library shows some exceptions, like `time.Time`).
- Defaulting to a value receiver is a good practice, unless there is a good reason to use a pointer receiver.

## 43 - Never using named result parameters

- Only use named result parameters when they make the code more readable (e.g., returning two `int` can be ambiguous).
- Use naked returns only when the function is short and the return values are clear.
- For an interface definition, named result parameters are useful to document the return values.

## 44 - Unintended side effects with named result parameters

- Named result parameters are _initialized to their zero value_.
- Using named result parameters doesn't mean one has to use naked returns: clarity is more important than brevity.

## 45 - Returning a nil receiver

- A nil receiver is a pointer to a struct that has not been initialized.
- Instead of returning a pointer to a struct (which will return a non-nil pointer to a nil struct), return `nil` directly.

## 46 - Using a filename as a function input

- It is more idiomatic and flexible to use an `io.Reader` or `io.Writer` as an input to a function that reads or writes to a file: this abstracts the data source.
- This allows for the function to be used with any type that implements the `io.Reader` or `io.Writer` interface, not just a file.
- It makes testing easier, as one can pass in a `bytes` buffer instead of a file, for instance.

## 47 - Ignoring how defer arguments and receivers are evaluated

- The arguments to a `defer` statement are evaluated when the `defer` statement is executed, not when the deferred function is executed.
    - That means that if a variable is initialized with a zero value and passed to `defer` as is, the deferred function will receive the zero value.
    - To avoid this pitfall, one can use a pointer to the variable, which will be evaluated when the deferred function is executed. The memory address will not change, but the value at that address will.
    - Another solution is to use a closure to capture the value of the variable at the time the `defer` statement is executed.
        - This works because the values of the variables are evaluated when the closure runs, not when the closure is created.
- In the case of a method receiver, data in the receiver is evaluated when the `defer` statement is executed, leading to the same situation as with arguments.
    - A pointer receiver can be used to avoid this issue, as the updated value of the pointer will be visible to the deferred function when it is executed.

---

# Error management

## 48 - Panicking

- It is used to signal genuinely unexpected errors, such as programming errors (e.g., `net/http` checking for a status code outside the valid range).
- Another use case for `panic` is when the application requires a dependency but fails to initialize it (e.g., a regular expression).

## 49 - Ignoring when to wrap an error

- `%w` is used to wrap an error conveniently.
- The `%v` directive will print the transformed error message, but `%w` will print the error message and the wrapped error message.
- If a caller relies on unwrapping an error provided with `%w`, it leads to coupling: if the underlying implementation that is wrapped changes, the caller will break.
- To mark an error, one should use a custom error type.

## 50 - Checking an error type inaccurately

- `errors.As` is used to check if an error is of a specific type anywhere in the error chain.
- `errors.As` should be used whenever error wrapping is used.

## 51 - Checking an error value inaccurately

- A sentinel error is a predefined error that can be compared to an error value. It is about an "expected" error (e.g., `sql.ErrNoRows` and `io.EOF`).
- Unexpected errors should be implemented as error types, implementing the `error` interface.
- `errors.Is` is used to check if an error is equal to a sentinel error (not `==`! if the error is wrapped, it will not be equal to the sentinel error).

## 52 - Handling an error twice

- Logging the same error twice can lead to confusion.
- Logging an error is handling an error! One should not both log and return an error.
- Error wrapping is useful to provide context to an error when propagating it up the call stack.

## 53 - Not handling an error

- The only way to explicitly ignore an error is to assign it to the blank identifier `_`. Adding a comment about why the error is ignored is a good practice.
- Do not simply ignore the assignment.

## 54 - Not handling defer errors

- Errors should be handled or explicitly ignored in `defer` functions.
- To return an error to the caller via the `defer` function, one can use a named return parameter, assigning the error to it.
- Instead of returning multiple errors from a `defer` function, it may be a good idea to log one error and return the other, depending on the context.

---

# Concurrency: Foundations

## 55 - Mixing up concurrency and parallelism

- Concurrency is about structuring a program, while parallelism is about running multiple tasks at the same time.
- _Concurrency enables parallelism_.

## 56 - Thinking concurrency is always faster

- A thread is the smallest unit of execution that can be scheduled by an operating system.
- A goroutine is a lightweight thread managed by the Go runtime: it is context-switched on and off by an OS thread.
- A goroutine has a memory footprint of 2 KB, while a thread has a memory footprint of ~2 MB.
- There is a point of diminishing returns when creating too many goroutines: one must take into account the overhead of context switching and determine the size of the workload that will be processed by each goroutine.
- It is often best to start with a sequential solution and use profiling tools to determine where to add concurrency.

## 57 - Being puzzled about when to use channels or mutexes

- Synchronization between parallel goroutines is achieved with mutexes (mutex stands for _mutual exclusion_).
- Channels are used to communicate between goroutines. If there are 3 goroutines and a third one needs results from the first two, a channel is the way to go.
- Mutexes ensure exclusive access to a resource (e.g., a map).
- Coordination or ownership of a resource is achieved with channels.
- In general, mutexes are needed for parallel goroutines, whereas channels are needed for concurrent ones.

## 58 - Not understanding race problems

- A _data race_ occurs when two goroutines access the same variable concurrently and at least one of the accesses is a write.
- `sync/atomic` provides atomic operations to avoid data races. It works only on primitive types.
- Channels can be used to perform atomic operations on non-primitive types, then send the result over the channel.
- Mutexes can be used to protect a critical section of code.
- The absence of a data race doesn't mean the code will be deterministic: it is possible for goroutines to be scheduled in different orders, leading to a _race condition_.
- A buffered channel can lead to a data race because a receive from an unbuffered channel happens before the send, but a send to a buffered channel happens before the receive.

## 59 - Not understanding the concurrency impacts of a workload type

- A worker pool can be based on `GOMAXPROCS` (the number of OS threads) to efficiently distribute the workload when a workload is CPU-bound.
- When a workload is I/O-bound, the number of goroutines can be increased to handle more I/O operations concurrently, depending on the external systems.

## 60 - Misunderstanding Go contexts

- A context is a way to pass deadlines, cancellation signals, and other request-scoped values across API boundaries and between processes.
- `context.Background` is the root context, which is never canceled, has no values, and has no deadline, used when there is no parent context.
- Deadline
    - A deadline is a point in time when the context should be canceled, specified as either a `time.Time` or a `time.Duration` (time from now).
    - Deferring the cancellation of a context can prevent a goroutine from being blocked indefinitely or leaking resources.
- Cancellation signals
    - `context.WithCancel` returns a copy of the parent context with a new `Done` channel.
- Context values
    - `context.WithValue` returns a copy of the parent context with a key-value pair.
- A function that users wait for should take a context as an argument.
- Prefer `context.TODO()` to `context.Background()` when a context is needed but there is no parent context, as it better represents the intent.

---

# Concurrency: Practice

## 61 - Propagating an inappropriate context

- Propagating a context is about passing a context from one goroutine to another.
- A context should be passed to a goroutine carefully: if the context requires some values to be passed but the parent goroutine gets its context cancelled, the child goroutine will also be cancelled. This may be undesirable.
    - To avoid this, create a custom struct implementing a context that never expires and that does not carry a cancellation signal, so the values can be passed without the risk of being cancelled.

## 62 - Starting a goroutine without knowing when to stop it

- A goroutine might loop over the values received from a channel, but if the channel is never closed, this will be a resource leak.
- Passing a context to a goroutine (e.g., to expect a file to be closed) is bad design. Instead, the parent goroutine should be responsible for closing the file by calling a `defer` function right after the resource used by another routine is created.

## 63 - Not being careful with goroutines and loop variables

- Spinning up a goroutine inside a `for` loop and relying on the loop variable can lead to unexpected behavior.
- Either assign the value of the loop variable to a new variable inside the loop or pass the loop variable as an argument to the goroutine. In the first case, the goroutine could be set up as a closure. In the second case, it would be a regular function call on an anonymous function.

## 64 - Expecting deterministic behavior using select and channels

- The `select` statement is used to wait on multiple channels. If multiple channels are ready, one will be chosen semi-randomly.
- Using an unbuffered channel with a `select` statement will block until a value is sent on the channel.
- Using a single channel and then checking the message type is an option.
- Using a `default` case in a `select` statement will allow the program to continue if a channel no longer receives values.
    - This approach works well for multiple channels: when a `select` case is chosen, add an inner `select` statement to handle the channel. For instance, after a _disconnection_ message, handle all remaining messages sent the another channel by looping over the channel inside that `select` case.

## 65 - Not using notification channels

- A notification channel is a channel that is used to signal the completion of a task.
- If no data is needed to be sent, a `struct{}` can be sent over the channel. This is clearer than sending a `bool` or `int`. An empty struct occupies no memory.

## 66 - Not using nil channels

- Sending a message to a `nil` channel will block forever.
- Receiving from a closed channel is a non-blocking operation: the zero value of the channel type will be returned.
- When looping over multiple channels and using `select`, if one of the channels is closed, this will lead to a busy-wait loop.
    - E.g., say we have two channels in a function that are to be "merged" such that data returned from that function comes from the two channels. If one of the channels is closed, the function will still keep looping over the now invalid `select` case.
- To avoid this, one can use a `nil` channel to signal a channel is closed. The `select` case will be skipped if the channel is `nil`, avoiding the busy-wait loop.

## 67 - Being puzzled about channel size

- An unbuffered channel (synchronous channel) has a size of 0: the sender blocks until the receiver receives data from the channel.
- With a buffered channel, the sender will block only when the buffer is full.
- An unbuffered channel enables synchronization between goroutines.
- An unbuffered channel can be used as a notification channel via a channel closure (`close`).
- When using worker pools, a buffered channel can be used to limit the number of tasks that can be processed concurrently, matching the number of goroutines in the pool.
- Rate-limiting can be achieved with a buffered channel, where the buffer size is the number of tasks that can be processed concurrently.
- In a buffered channel, the lower the value, the bigger the impact on CPU. The higher the value, the bigger the impact on memory.
- Buffered channels can lead to obscure deadlocks.
- It's usually best to start with a channel of size `1` and perform benchmarks to determine the optimal size.
- Queues tend to be close to full or close to empty anyways ([source][lmax-disruptor]).

## 68 - Forgetting about possible side effects with string formatting

- Printing the values in a context will evaluate the values at the time of the call, which could lead to a data race.
- Acquiring a lock only when it's required is best. This reduces side effects and possible deadlocks. This ties nicely with the fact that a function can go over the "error cases" before doing anything else that might require more resources (e.g., check the age of a customer is valid before acquiring a lock).

## 69 - Creating data races with append

- To prevent data races with `append`, one can make a copy of the slice in each goroutine before appending to it.
- If the slice is initialized in such a way that the backing array is shared between goroutines, there will not be a data race since the original slice will remain unchanged.
- Updating a `map` from one goroutine will lead to a data race if another goroutine tries to read from the `map` at the same time, given that the hashing algorithm for maps introduces some randomness.

## 70 - Using mutexes inaccurately with slices and maps

- A mutex is used to protect a critical section of code from being accessed by multiple goroutines at the same time.
- A mutex is used to protect a shared resource, like a slice or a map.
- If an operation is lightweight, it is better to use a mutex to protect the resource (protecting the whole function in the process).
- If an operation is heavy, it is better to make a copy of the resource and then update the copy, then replace the original resource with the copy.

## 71 - Misusing `sync.WaitGroup`

- `Add` must be called in the parent goroutine before the child goroutine is started.
- `Done` must be called in the child goroutine when the child goroutine is finished.
- `Wait` must be called in the parent goroutine after all child goroutines have been started.

## 72 - Forgetting about `sync.Cond`

- `sync.Cond` is used to signal a condition to multiple goroutines.
- The updater goroutine locks a mutex, updates the condition, unlocks the mutex, and then signals the condition.
- The listener goroutine(s) lock the mutex, wait for the condition to be signaled, and then unlock the mutex.
    - Lock/unlock is done to offset the fact that `Wait` unlocks the mutex and then relocks it when the condition is signaled.
- If no goroutines are waiting for the condition when the call to `Broadcast` occurs, the signal is lost.

## 73 - Not using `errgroup`

- [errgroup][errgroup] provides tools to manage a group of goroutines and propagate errors.
- It can be used to share context between goroutines to allow for cancellation of the group of goroutines upon the first error. If 3 calls are made in parallel and one of them fails fast with an error, the other two will be cancelled instead of waiting.

## 74 - Copying a sync type

- `sync.*` types should never be copied.
- If we have a value receiver receiving a struct containing a Mutex, for instance, it will be copied when passed to a function. This will lead to a data race.
- To avoid the issue with a value receiver, either use a pointer receiver or make the mutex field a pointer.
- The same issue will present itself if a function takes a `sync.*` type as an argument or if a field in a struct received as a function argument is a `sync.*` type.
- `go vet` can catch these types of issues.

---

# The standard library

## 75 - Providing a wrong time duration

- Always use the `time.Duration` API to provide a time duration. Passing any `int64` value would work, but the function accepts nanoseconds, which will be confusing.

## 76 - `time.After` and memory leaks

- Resources created by `time.After` (e.g., a channel) are released only when the timer expires.
- Using `time.After` inside a loop will create a new channel each time the loop iterates, leading to a memory leak. Each call to `time.After` will consume about 200 bytes. If this is a long-running loop with frequent events, this can be a significant memory leak (e.g., 5 million calls in an hour would be about 1 GB of wasted memory).
- Use `time.NewTimer` instead, which will create a timer that can be reset, then listen for the timer to expire on the channel (`<-timer.C`).

## 77 - Common JSON-handling mistakes

- When unmarshaling JSON, the `json` package will not set the fields of a struct to their zero values if the fields are not present in the JSON.
- Type embedding in a struct can be problematic if the embedded type implements the `json.Marshaler` interface, which by virtue of being promoted will be used instead of the `json.MarshalJSON` method of the struct.
    - Type embedding makes the parent struct implements interfaces of the embedded type.
- If possible, use a named field instead of an anonymous field (type embedding) to avoid this issue.
- Monotonic clocks guarantee that the time will always increase, even if the system clock is changed. This is useful for measuring time intervals.
    - In Go, monotonic time is part of the same API that provides wall time.
    - `time.Equal` does not take into account the monotonic clock, so it is possible for two times to be equal even if they are not.
    - One can also strip away the monotonic time with `time.Truncate(0)`.
- To prevent time zone issues, use time.LoadLocation` to load the desired time zone or use `time.UTC` to work with UTC time.
- Using a map of any to unmarshal JSON may be convenient but has its drawbacks. For instance, numeric values will be unmarshaled as `float64`, even if they contain no decimals.

## 78 - Common SQL mistakes

- _"Forgetting that sql.Open doesn't necessarily establish connections to a database"_
    - The behavior depends on the SQL driver.
    - To make sure the connection is open, one should call `Ping` on the connection or use `PingContext`.
- _"Forgetting about connections pooling"_
    - `SetMaxOpenConns` should be set in any production-grade application to match the load the database can handle.
    - If an application generates significant concurrent requests, the default value for `SetMaxIdleConns` (2) should be updated.
    - If an application can face bursts of requests, one should set `SetConnMaxIdleTime` accordingly.
    - `SetConnMaxLifetime` can be useful if an application is behind a load balancer, for example.
- _"Not using prepared statements"_
    - Prepared statements should be used in untrusted contexts.
- _"Mishandling null values"_
    - If the value of a column can be `NULL`, it should be structured as a pointer to receive `nil` values.
    - Another approach is to use `sql.NullString`, `sql.NullInt64`, etc.
- _"Not handling row iteration errors"_
    - One should check `rows.Err` after iterating over rows to check for errors. This is because `rows.Next` can stop iterating over rows if an error occurs as well as when all rows have been read.

## 79 - Not closing transient resources

- HTTP body
    - The response body should be closed to avoid resource leaks (this is done automatically on the server side). This can be done conveniently with `defer` function that should call `resp.Body.Close()`.
    - The body should be closed even if it was not read (e.g., just checking the status code).
        - The body should be read to have a "keep-alive" connection (`io.Discard` is efficient for this purpose).
- `sql.Rows`
    - Rows should be closed to release the database connection.
- `os.File`
    - When closing a file in a `defer` function, the error should be sent back to the parent function to be handled in case of error while closing a writable file, for instance.
    - If a write should be committed immediately, the file should be flushed before closing it with `file.Sync()` (this is a synchronous operation).

## 80 - Forgetting the return statement after replying to an HTTP request

- `http.Error` does not stop the handler's execution.
- After calling `http.Error`, the handler should return to stop the execution.

## 81 - Using the default HTTP client and server

- HTTP client
    - The default client does not specify any timeouts.
- HTTP server
    - Just like the client, default timeouts should be overridden in production applications to avoid abuse and resource leaks.

---

# Testing

## 82 - Not categorizing tests

- They should be organized as per the testing pyramid:
    - Unit tests: test a single function or method.
    - Integration tests: test the interaction between multiple components.
    - End-to-end tests: test the entire system.
- It is not always necessary to run all tests at different stages of a project.
- One can add a build flag such as `// go:build integration` to run integration tests only when needed.
    - By default, files without a build flag will be run. Use `go test --tags=integration -v .` to run integration tests.
    - It is possible to include negation in the build flag, e.g., `// go:build !integration`.
    - Build tags apply to the whole file, not individual tests.
- Using environment variables may be a better approach than build flags, because one can forget about existing tests that are being ignored and not explicitly flagged as such.
    - Each test can then decide to check for environment variables being set and use `t.skip` to skip the test if the environment variable is not set.
- Use `testing.Short()` in a conditional statement to skip long-running tests when running tests with the `-short` flag.

## 83 - Not enabling the `-race` flag

- In Go, the race detector is a tool used at runtime to find data races.
    - It is really useful, but brings quite a performance hit (5-10x memory, 2-20x execution time).
- Concurrent code should be tested thoroughly to make use of the `-race` flag.
- To avoid false positives in data race detections, one can use a loop to run the logic of the test multiple times.
- If needed, `// go:build !race` can be used to exclude tests from running with the `-race` flag.

## 84 - Not using test execution modes

- `t.Parallel` can be used to run tests in parallel.
    - Sequential tests run first, then all parallel tests run at the same time (up to `GOMAXPROCS`, unless configured otherwise on the command-line).
- There exists a `-shuffle` flag to randomize the order of tests, which isolates tests from each other.
    - Using `-v` flag along with `-shuffle` will print the seed used to shuffle the tests, which can be useful to reproduce results from a CI environment.

## 85 - Not using table-driven tests

- They are shorter and more readable than traditional tests.
- They make refactoring tests easier.
- They make test function names clearer/shorter.

## 86 - Sleeping in unit tests

- Sleeping in a test can mean the test is flaky, especially when testing concurrent code.
- Implementing a retry strategy is better than using a passive `time.Sleep` in a test.
    - The `testify` package provides an `Eventually` function that can be used to retry a test function a number of times.
- If a test can be synchronized, using a channel to receive the value from a goroutine to be tested can lead to deterministic results with no need for a sleep. This strategy can also implement a timeout using a `select` with a `time.After` case.

## 87 - Not dealing with the time API efficiently

- Do not rely on `time.Now` in a function. If it must be tested, the time functionality could be injected as a dependency.
- Even better, a function should allow receiving a `time.Time` as an argument, so that the caller can provide the needed value.
- Time should also not be stored in a global variable, as all tests will share the same time, preventing them from running in parallel.
- Whenever possible, testing time should be abstracted away from the code being tested.

## 88 - Not using testing utility packages

- `httptest` package
    - It can be used to test HTTP handlers.
    - Instead of spinning up Docker, a fake server can be used to test the HTTP client.
- `iotest` package
    - `io.Reader` and `io.Writer` can be tested with this package.
    - It can be used to test edge cases, such as reading a file that is too large or to make sure a reader is resilient against errors (e.g., network error).

## 89 - Writing inaccurate benchmarks

- Use `testing.B` to run benchmarks. Then run `go test -bench=.`, optionally adding the flag `-benchtime=2s` to run the benchmark for 2 seconds (default is 1 second).
- Use `b.ResetTimer` after an expensive setup to reset the timer.
- If the expensive call must be done for each iteration in the testing loop, then one can use `b.StopTimer` and `b.StartTimer` to stop and start the timer, respectively.
- `perflock` can be used to lock the CPU frequency to avoid performance fluctuations during benchmarking.
- Micro-benchmarks should be avoided, as they can be misleading. `benchstat` can be used to compare benchmarks. For instance, run `go test -bench=. -count=10 | tee stats.txt` to save the results to a file, then run `benchstat stats.txt` to compare the results.
- Reusing the same variable in a benchmark can lead to incorrect results, as the compiler may optimize the code. To avoid this, use `b.N` to create a new variable for each iteration.
- Forcing a benchmark to recreate data for each iteration of a loop may prevent CPU caching from affecting the results.

## 90 - Not exploring all the Go testing features

- Use `go test -coverprofile=coverage.out ./...` in combination with `go tool cover -html=coverage.out` to generate a coverage report.
- Test exposed behavior by creating a separate package so that unexported elements and internals are not tested.
- `testing.T` can be used to test the behavior of a function, while `testing.B` can be used to test the performance of a function.
- `t.Cleanup` can be used to clean up resources after a test (e.g., close a database connection).
- When multiple cleanup functions are needed, they will be executed in reverse order of registration (LIFO), just like using `defer`.
- `TestMain` can be used to set up and tear down resources for all tests in a package.

---

# Optimizations

## 91 - Not understanding CPU caches

- _Mechanical sympathy_ is about understanding the hardware to write efficient code.
- Most modern CPU architectures have three levels of cache: L1, L2, and L3.
- L2 is about 4 times slower than L1, and L3 is about 10 times slower than L2.
- L3 is a _victim cache_ containing only data evicted from L2.
- Access to main memory is between 50 and 100 times slower than access to L1 cache.
- A _cache line_ is the smallest unit of data that can be transferred between the cache and main memory. When first accessible a memory location, it results in a _compulsory miss_. Once the cache line is copied to the cache, subsequent accesses to the same memory location and contiguous ones will result in a _cache hit_.
- A struct of slices can be about 20% faster than a slice of structs, because of _spatial locality_. For 16 elements, it may require 2 cache lines instead of 4 for a struct containing fields with slices.
- Data structures affect _predictability_ at the CPU level.
    - _Unit stride_ is when the CPU can predict the next memory location to access. All values are contiguous in memory.
    - _Constant stride_ is when the CPU can predict the next memory location to access (e.g., read every two elements of a slice), but the values are not contiguous in memory.
    - _Non-unit stride_ is when the CPU cannot predict the next memory location to access. The values are not contiguous in memory. This would be the case for a linked list or a slice of pointers.
- _Cache placement policy_ works roughly with the principle of _least recently used_ (pseudo-LRU). When a cache line is full, the least recently used cache line is evicted.
- _Conflict misses_ happen because the cache is partitioned into sets, and two memory locations map to the same set. This can be avoided by aligning data structures to the cache line size.
- A _critical stride_ accesses memory addresses with the same set index, leading to a _conflict miss_.
- This is why micro-benchmarking can be misleading: if the production system uses a different cache architecture, the results may be widely different.

## 92 - Writing concurrent code that leads to false sharing

- _False sharing_ is when two threads access different variables that are on the same cache line, and at least one of the goroutines is a writer.
- This causes the cache line to be invalidated.
- One solution is to add _padding_ to the struct to ensure that the variables are on different cache lines, so that the same cache line is not copied across different logical cores.
- Another approach is to use channels to communicate between goroutines, which will avoid false sharing, instead of having two goroutines share the same struct.

## 93 - Not taking into account instruction-level parallelism

- _Data hazards_ occur when an instruction depends on the result of a previous instruction (e.g., read and increment a variable).
- _Control hazards_ occur when the CPU cannot predict the next instruction to execute (e.g., conditionals).
- Sometimes, introducing a temporary variable can help the CPU predict the next instruction and parallelize the execution.
- One should remain cautious about micro-optimizations, since the Go compiler keeps evolving, and the generated assembly code may change.

## 94 - Not being aware of data alignment

- _"[...] a variable's memory address should be a multiple of its own size"_: this is the principle of _data alignment_.
- A struct size must be a multiple of the _word_ size (8 bytes on 64-bit systems).
- A struct being an atomic unit, it should be aligned to the word size, as it won't be reorganized by the compiler. The compiler only adds padding to the fields to guarantee data alignment.
- Rule of thumb: organize structs by size, from largest to smallest, to avoid padding. This leads to better spatial locality and cache usage.

## 95 - Not understanding stack vs. heap

- Stack is the default memory. LIFO. Stores all local variables for a goroutine.
- Currently, each goroutine initially gets 2 KB of stack space (contiguous memory, to preserve data locality), which can grow up to 1 GB.
- A stack frame is created for each function call, and it is destroyed when the function returns. The stack frames pile up from accessing different functions inside a given goroutine.
- A stack is self-cleaning: it requires no garbage collection. Each goroutine has its own stack.
- Using pointers, slices, and maps will allocate memory on the heap. One reason is that memory addresses from a stack frame coming from a returned function could not be accessed anymore with a stack.
- The memory heap in Go is managed by the garbage collector and is shared among all goroutines. Variables that _could_ still be referenced after exiting a function are stored on the heap.
- Allocations on the stack are trivial and faster than on the heap. The stack is also more cache-friendly.
- _Escape analysis_ is a compiler optimization that determines whether a variable can be allocated on the stack or the heap.
    - "Sharing up" escapes to the heap (need a reference from a context that is about to be destroyed).
    - "Sharing down" stays on the stack (no reference to the variable outside the function).
    - Global variables are stored on the heap, because they can be shared across goroutines.
    - A pointer sent to a channel will escape to the heap.
    - A variable referenced by a value sent to a channel.
    - When a local variable is too large to fit on the stack.
    - When building a program, the `-gcflags "-m"` flag can be used to see the escape analysis results.

## 96 - Not knowing how to reduce allocations

- The `Reader` interface takes in a slice of bytes and returns the number of bytes read and an error. If it had been the other way around, the slice would always escape to the heap.
- `sync.Pool` can be used to reduce the number of allocations. It is a pool of objects that can be reused. E.g., when writing a slice of bytes to a buffer, the buffer can be reused.
- `sync.Pool` is thread-safe.

## 97 - Not relying on inlining

- _Mid-stack inlining_ is when the compiler inlines a function call that is in the middle of the stack, not at the top (e.g., `main` calls `foo`, which calls `bar`, both functions are simple, so `bar` is inlined in `foo` and `foo` is in turn inlined in `main`).
- Slow vs. fast paths can be optimized by the compiler. The slow path can be extracted to a separate function, which will be inlined in the fast path (_"fast-path inlining technique"_).

## 98 - Not using Go diagnostics tooling

- Profiling
    - With profiling, one can see where the program is spending most of its time. `pprof` is the Go profiler.
    - There are different profiles: CPU (time spent), goroutine (stack traces of ongoing routines), heap (check memory leaks and current allocations), mutex (check time spent in locking calls), block (see where goroutines waits on synchronous operations).
    - A profile can be generated while benchmarking: `go test -bench=. -cpuprofile profile.out`. This profile can be used with `go tool pprof -http=:8080 profile.out`.
    - Heap profiling
        - It's a good idea to force garbage collection before dumping the heap profile to avoid false assumptions. This can be done via the web UI at `http://localhost/debug/pprof/heap?gc=1`.
        - Snapshots can be compared with `go tool pprof -http=:8080 -diff_base <file2> <file1>`.
    - Goroutine profiling
        - We can inspect to check for "goroutine leaks".
    - Block profiling
        - Useful to check performance affected by blocking calls. Must call `runtime.SetBlockProfileRate` to enable it. This profiler stays on until the program ends.
    - Mutex profiling
        - Useful to check performance affected by mutex locks. Must call `runtime.SetMutexProfileFraction` to enable it. This profiler stays on until the program ends.
    - A single profiler should be enabled at a time.
- Execution tracer
    - Used to check how garbage collection performs, how goroutines are scheduled, and how the scheduler behaves.
    - It can be enabled with `go test -bench=. -v -trace=trace.out` or by downloading a trace file with `/debug/pprof/trace?debug=0`.
    - The granularity of the tracer is per goroutine (unlike CPU profiling, which is per function).

## 99 - Not understanding how the GC works

- `debug.FreeOSMemory()` can be used to force the garbage collector to release memory to the OS.
- `GODEBUG=gctrace=1` can be used to see the garbage collector in action.
- One can force a large allocation of memory with something like `var min = make([]byte, 1_000_000_000)` so that the garbage collector will only trigger once the heap reaches twice the size of the allocation, which can reduce the impact on latency if otherwise many garbage collections would be triggered in a short period of time. On most systems, this leads to a _lazy allocation_ (in the virtual address space). This is useful when the heap peak is known in advance.

## 100 - Not understanding the impacts of running Go in Docker and Kubernetes

- CPU throttling can occur in Docker and Kubernetes, leading to performance degradation.
- `GOMAXPROCS` should be set to the number of CPUs available to the container.

---

# Resources and references

[100-mistakes]: https://www.manning.com/books/100-go-mistakes-and-how-to-avoid-them
[clean-code]: https://www.oreilly.com/library/view/clean-code-a/9780136083238/
[concurrency-bugs]: https://engineering.purdue.edu/WukLab/GoStudy-ASPLOS19.pdf
[costly-bugs]: https://news.synopsys.com/2021-01-06-Synopsys-Sponsored-CISQ-Research-Estimates-Cost-of-Poor-Software-Quality-in-the-US-2-08-Trillion-in-2020
[errgroup]: https://pkg.go.dev/golang.org/x/sync/errgroup
[init-go-blog]: https://cs.opensource.google/go/x/website/+/e0d934b4:blog/blog.go;l=32
[learning-from-errors]: https://pubmed.ncbi.nlm.nih.gov/27648988/
[lmax-disruptor]: https://lmax-exchange.github.io/disruptor/files/Disruptor-1.0.pdf
[mind-your-mistakes]: https://pubmed.ncbi.nlm.nih.gov/22042726/
[project-layout]: https://github.com/golang-standards/project-layout
[teivah-aoc]: https://github.com/teivah/advent-of-code
[teivah-dev]: https://teivah.dev/
[teivah-github-100-go-mistakes]: https://github.com/teivah/100-go-mistakes

- [`init` function of the Go blog][init-go-blog]
- [100 Go Mistakes and How to Avoid Them][100-mistakes]
- [Advent of Code solutions by teivah][teivah-aoc]
- [GitHub repository of 100 Go Mistakes by teivah][teivah-github-100-go-mistakes]
- [Learning from Errors][learning-from-errors]
- [Mind your errors: evidence for a neural mechanism linking growth mind-set to adaptive posterror adjustments][mind-your-mistakes]
- [Project layout][project-layout]
- [Synopsys-Sponsored CISQ Research Estimates Cost of Poor Software Quality in the US $2.08 Trillion in 2020][costly-bugs]
- [teivah.dev][teivah-dev]
- [Understanding Real-World Concurrency Bugs in Go][concurrency-bugs]
