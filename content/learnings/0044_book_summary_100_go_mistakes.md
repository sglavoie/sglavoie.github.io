Title: Book summary: 100 Go Mistakes and How to Avoid Them
Date: 2024-06-13 21:26
Tags: best-practice, books, go
Slug: book-summary-100-go-mistakes-and-how-to-avoid-them
Authors: Sébastien Lavoie
Summary: ...

[TOC]

---

# Introduction

...

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
- _"the best time for brain growth is when we’re facing mistakes"_ ([source][mind-your-mistakes]).
- _"we can remember not only the error but also the context surrounding the mistake"_ ([source][learning-from-errors]).
- Categories of mistakes
    - Bugs
        - Bugs are very costly ([source][costly-bugs]).
        - Bugs can be very dangerous (e.g., in the case of a radiation therapy machine).
    - Needless complexity
        - Don't overcomplicate things.
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

## Unintended variable shadowing

- A variable name declared in a block can be redeclared in a nested block (_variable shadowing_).

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

## Unnecessary nested code

- Put the happy path first and return early on all edge cases and errors.
- Instead of using `else` blocks, use early returns.
- Instead of checking for an happy path, check for the error path and return where possible.

## Misusing init functions

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

## Overusing getters and setters

- Go has no support for automatic getters and setters, and it is idiomatic to use direct access to fields.
- When the use case justifies it, a getter should be named `FieldName` (not `GetFieldName`) and a setter should be named `SetFieldName`.

## Interface pollution

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

## Interface on the producer side

- _Producer side_ refers to an interface defined in the same package as the type that satisfies it.
- _Consumer side_ refers to an interface defined in a package that uses it and which is independent of the package that implements the interface.
- The client should determine the level of abstraction it needs.
- This relates to the _Interface segregation principle_ of SOLID.

## Returning interfaces

- In many cases, this is a bad practice in Go.
- _"Be conservative in what you do, be liberal in what you accept from others."_ — Transmission Control Protocol
    - Return structs instead of interfaces.
    - Accept interfaces if possible.
- Interfaces might be returned (e.g., `io.Reader`), but this should be done with caution. It's usually done when the interface itself is implemented on the producer side (e.g., standard library) and the consumer side (e.g., user code) is expected to use it.

## `any` says nothing

- The `interface{}` type is a placeholder for `any` type. `any` is an alias for `interface{}` since Go 1.18.
- It requires a type assertion to be used.
- Using `any` does not convey any meaningful information about the type.
- It will lead to issues compilation-wise.

## Being confused about when to use generics

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

## Not being aware of the possible problems with type embedding

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

## Not using the functional options pattern

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

# Project misorganization

...

---

# Conclusion

...

---

# Resources and references

[100-mistakes]: https://www.manning.com/books/100-go-mistakes-and-how-to-avoid-them
[clean-code]: https://www.oreilly.com/library/view/clean-code-a/9780136083238/
[concurrency-bugs]: https://engineering.purdue.edu/WukLab/GoStudy-ASPLOS19.pdf
[costly-bugs]: https://news.synopsys.com/2021-01-06-Synopsys-Sponsored-CISQ-Research-Estimates-Cost-of-Poor-Software-Quality-in-the-US-2-08-Trillion-in-2020
[init-go-blog]: https://cs.opensource.google/go/x/website/+/e0d934b4:blog/blog.go;l=32
[learning-from-errors]: https://pubmed.ncbi.nlm.nih.gov/27648988/
[mind-your-mistakes]: https://pubmed.ncbi.nlm.nih.gov/22042726/
[teivah-aoc]: https://github.com/teivah/advent-of-code
[teivah-github-100-go-mistakes]: https://github.com/teivah/100-go-mistakes

- [`init` function of the Go blog][init-go-blog]
- [100 Go Mistakes and How to Avoid Them][100-mistakes]
- [Advent of Code solutions by teivah][teivah-aoc]
- [GitHub repository of 100 Go Mistakes by teivah][teivah-github-100-go-mistakes]
- [Learning from Errors][learning-from-errors]
- [Mind your errors: evidence for a neural mechanism linking growth mind-set to adaptive posterror adjustments][mind-your-mistakes]
- [Synopsys-Sponsored CISQ Research Estimates Cost of Poor Software Quality in the US $2.08 Trillion in 2020][costly-bugs]
- [Understanding Real-World Concurrency Bugs in Go][concurrency-bugs]
