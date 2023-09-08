Title: Book summary: Effective Java
Date: 2023-06-11 18:15
Tags: best practices, books, java
Slug: book-summary-effective-java
Authors: Sébastien Lavoie
Summary: The following are some notes I have taken while reading [Effective Java](https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/) (Third Edition), written by Joshua Bloch. Each item is an actual heading taken verbatim from the book, while the bullet points are my rehash of the original content.
Description: The following are some notes I have taken while reading Effective Java (Third Edition), written by Joshua Bloch. Each item is an actual heading taken verbatim from the book, while the bullet points are my rehash of the original content.

[TOC]

---

# Book summary

## Creating and destroying objects

### Item 1: Consider static factory methods instead of constructors

- Use static factory methods to increase readability and make classes more flexible (e.g., `Foo.withOpenBar()` instead of `new Foo(true)`).

### Item 2: Consider a builder when faced with many constructor parameters

- When a class has many parameters, use a builder instead of a "_telescoping constructor pattern_" (i.e., having a separate method to call the class with any number of parameters, which may or may not all be used, leading to confusion and difficulty to use).
- The "JavaBeans pattern" uses setters and a parameter-less constructor, allowing the use of any parameters as needed when using the code (e.g., `Foo.setMethod()`). This allows the class to enter in an inconsistent state (it is difficult to guarantee that a combination of used parameters makes sense) and makes it difficult to create an immutable class.
- This pattern allows calling code like `NutritionFacts cocaCola = new NutritionFacts.Builder(240, 8).calories(100).sodium(35).carbohydrate(27).build();`, which basically instantiate a class with optional parameters as would be the case in Python.

### Item 3: Enforce the singleton property with a private constructor or an enum type

- The recommended path forward is to use an `enum` type like so:

```{.java}
public enum MyClass {
       INSTANCE;
       public void myMethod() { ... }
   }

...

MyClass instance = MyClass.INSTANCE;
instance.myMethod();
```

### Item 4: Enforce non-instantiability with a private constructor

- Simply define the class constructor to be `private` so that the class cannot be instantiated. This is useful for utility classes that may contain a bunch of static methods where instantiating the class itself is nonsensical.

### Item 5: Prefer dependency injection to hardwiring resources

- The example given with a `SpellChecker` that depends on a `Dictionary` makes a lot of sense: instead of having a class `SpellChecker` define a `Dictionary` that won’t be reusable elsewhere or that may need to change, pass the `Dictionary` into the constructor of the class so that different dictionaries can be used with the same class, making it easier to test things independently and update an existing implementation.

### Item 6: Avoid creating unnecessary objects

- The author provides two striking examples of where creating unnecessary objects can be detrimental to performance: using `Long sum = 0L;` instead of `long sum = 0L;` when summing up positive integers and matching a regular expression on a string repeatedly instead of compiling the regular expression once for re-use. In short, avoid creating unnecessary objects and prefer primitives over boxed primitives.

### Item 7: Eliminate obsolete object references

- The author provides an example of a stack implementation that has a memory leak because the stack maintains obsolete references to objects that have been popped off the stack. The solution is to null out references once they are no longer needed, which in this case happened in a class where manual memory management was occurring. This is a problem because the garbage collector has no way of knowing that the objects it references after a certain portion of the array are no longer needed.
- The author also shows an example of a cache that uses a `WeakHashMap` to store the cache, which allows the garbage collector to remove entries from the cache when they are no longer referenced elsewhere in the program.

### Item 8: Avoid finalizers and cleaners

- "_Finalizers are unpredictable, often dangerous, and generally unnecessary._" They can lead to performance issues and resource leaks. They should be avoided. There is no guarantee that they will be called in a timely manner, or at all.

### Item 9: Prefer try-with-resources to try-finally

- The author provides an example of a class that reads the first line of a file and returns it as a string. The class uses a `BufferedReader` to read the file and a `FileReader` to open the file. The problem is that the `FileReader` is never closed, which can lead to resource leaks. The solution is to use a `try-with-resources` block, which will automatically close the `FileReader` when the block is exited.

## Methods common to all objects

### Item 10: Obey the general contract when overriding `equals`

- The `equals` method must be reflexive, symmetric, transitive, consistent, and `x.equals(null)` must return `false`.
- It is generally a bad idea to `@Override` the `equals` method when inheriting from a concrete class, as it is difficult to ensure that the contract is respected. It is better to use composition instead of inheritance in this case.

### Item 11: Always override `hashCode` when you override `equals`

- If two objects are equal according to the `equals` method, they must have the same hash code. The reverse is not true: two objects with the same hash code are not necessarily equal.
- Using the AutoValue framework in Java, it is possible to automatically generate `equals` and `hashCode` methods for a class.

### Item 12: Always override `toString`

- The `toString` method should return a concise, useful description of the object. It should be overridden in every class unless the class is a utility class or a small value class.
- The `toString` method should return all of the interesting information contained in the object when it is practical to do so. It should not return the memory address of the object.

### Item 13: Override `clone` judiciously

- The `clone` method is broken in Java. It is better to use a copy constructor or a copy factory instead of the `clone` method.
- One exception is when a class implements the `Cloneable` interface and has a final field that is a reference to an array or a final field that is a reference to an object. In this case, the `clone` method can be used to create a copy of the object.

### Item 14: Consider implementing `Comparable`

- Implement the `Comparable` interface when a class has a natural ordering. This allows the class to be used in sorted collections and provides a way to compare objects of the class.
- An example is given to compare phone numbers using the `Comparable` interface, where chaining happens in order to compare from the most significant field to the least significant field, e.g.:

```{.java}
// Comparable with comparator construction methods
   private static final Comparator<PhoneNumber> COMPARATOR =
           comparingInt((PhoneNumber pn) -> pn.areaCode)
             .thenComparingInt(pn -> pn.prefix)
             .thenComparingInt(pn -> pn.lineNum);
   public int compareTo(PhoneNumber pn) {
       return COMPARATOR.compare(this, pn);
}
```

## Classes and interfaces

### Item 15: Minimize the accessibility of classes and members

- Make each class or member as inaccessible as possible. This allows for better encapsulation and makes it easier to change the implementation of a class without breaking the code that uses it.
- In public classes, instance fields should rarely be public, as that generally makes the classes themselves non-thread-safe. Instead, use accessor methods to access the fields.
- Static final fields can be made public if they are immutable.

### Item 16: In public classes, use accessor methods, not public fields

- When a class needs to be accessed outside of its package, provide accessor methods instead of making the fields public. This allows the class to change its implementation without breaking the code that uses it.
- This does not really apply to nested or private classes that are only used within the package as long as they still represent data structures usefully, as this leads to less visual clutter.

### Item 17: Minimize mutability

- Don't allow the class to use _mutators_.
- Prevent the class from being extendable.
- Make all fields final.
- Make all fields private.
- Don't write setters when they are not needed.
- Reducing the number of states a class can find itself in makes it easier to reason about the class and reduces the number of bugs that can occur.

### Item 18: Favor composition over inheritance

- Inheritance is often overused and can lead to fragile code. It is better to use composition instead of inheritance where appropriate.
- When a class takes a reference to another class as a parameter in its constructor while extending the interface for the class it is taking as a parameter via a forwarding class, it is using composition, as it calls `super(otherClass)` in its constructor. This allows the class passed as a parameter to be extended without having to change the class itself. In this way, the class using composition becomes a wrapper that can add functionality on top of the class it is wrapping. The books gives an example of a `ForwardingSet` that extends `Set` and takes a `Set` as a parameter in its constructor. The `ForwardingSet` can then add functionality on top of the `Set` it is wrapping, in this case by counting the number of times the `add` method is called.
- The main, appropriate use case for inheritance is when a class is a subtype of another class and satisfies the _is-a_ relationship.

### Item 19: Design and document for inheritance or else prohibit it

- To test a class for inheritance, try to extend it. If it is not possible to extend the class, it is not designed for inheritance.
- No _overridable_ methods should be called in the constructor, because the superclass runs before the subclass, and the subclass will not have been initialized yet.
- It is better to prohibit inheritance by declaring a class to be `final` and ensuring that no constructors are accessible.

### Item 20: Prefer interfaces to abstract classes

- Interfaces are better than abstract classes because they allow for multiple inheritance, they allow for the creation of mixins, and they allow for the creation of _tag interfaces_.
- Interfaces can define types that do not need to be represented hierarchically. For instance, a `DirectorPhotographer` interface can be created that extends both the `Director` and `Photographer` interfaces.

### Item 21: Design interfaces for posterity

- Multiple programmers should implement interfaces in different ways, and multiple client programs should use the interfaces to ensure they satisfy all intended uses. Flaws in interfaces are easier to correct before release.
- The moral is to be cautious when adding methods to existing interfaces using default methods and to thoroughly test and design interfaces to avoid issues and flaws in the long term.

### Item 22: Use interfaces only to define types

- Interfaces serve as types that define what a client can do with instances of a class that implements the interface.
- Constant interfaces consist solely of static final fields, exporting constants. They are a poor use of interfaces as they expose implementation details and confuse users.
  - Implementing a constant interface leaks implementation details into the class's API and creates a commitment to maintain binary compatibility. Subclasses of a class implementing a constant interface are also affected.
  - If constants are tied to an existing class or interface, add them directly to that class or interface. If constants are best viewed as members of an enumerated type, use an enum type. Otherwise, use a noninstantiable utility class to export the constants.
- Interfaces should be designed to define types and not used solely for the purpose of exporting constants.

### Item 23: Prefer class hierarchies to tagged classes

- Tagged classes are verbose, error-prone, and inefficient. They have boilerplate code, mix multiple implementations in a single class, increase memory footprint, require careful initialization, and make it difficult to add new flavors.
  - Instead, abstract classes can be used as the root of the hierarchy, with concrete subclasses representing each flavor.
- Class hierarchies eliminate the shortcomings of tagged classes. They are simpler, clearer, have no boilerplate, ensure field initialization, prevent missing cases, support independent extensibility, and provide distinct data types for each flavor.
  - Class hierarchies can reflect natural relationships among types. For example, a square can be represented as a subclass of a rectangle in the hierarchy.

### Item 24: Favor static member classes over nonstatic

- There are four kinds of nested classes in Java: static member classes, nonstatic member classes (inner classes), anonymous classes, and local classes.
  - Static member classes are ordinary classes declared inside another class and have access to all members of the enclosing class. They are static members of their enclosing class and serve as public helper classes. They obey the same accessibility rules as other static members.
  - Nonstatic member classes are implicitly associated with an instance of the enclosing class and can access methods and fields of the enclosing instance. They require an enclosing instance to be created and cannot exist independently.
  - Private static member classes are used to represent components of the object represented by their enclosing class. They don't require access to the enclosing instance and avoid unnecessary memory usage compared to nonstatic member classes.
- If a member class doesn't require access to an enclosing instance, it should be declared as a static member class to avoid the overhead of an extra reference and potential memory leaks.
- Static member classes are preferred over nonstatic member classes unless access to the enclosing instance is necessary.

### Item 25: Limit source files to a single top-level class

- The risks stem from the possibility of providing multiple definitions for a class, and the order in which source files are passed to the compiler determines which definition is used.
- If there is a need to group related classes, consider using static member classes as an alternative. Static member classes enhance readability and allow for reduced accessibility by declaring them private.

## Generics

### Item 26: Don't use raw types

- Raw types are generic types used without specifying any type parameters.
- Using raw types can lead to errors at runtime (the compiler doesn't provide type safety) and should be avoided.
- Instead of using raw types, it is recommended to use parameterized types to ensure type safety and expressiveness.
- Unbounded wildcard types (e.g., `Set<?>`) can be used when the actual type parameter is unknown or doesn't matter: they offer flexibility while still maintaining type safety.

### Item 27: Eliminate unchecked warnings

- Some unchecked warnings are easy to eliminate by specifying the type parameter or using the diamond operator (`<>`).
- Treat unchecked warnings seriously and make efforts to eliminate them, ensuring type safety and reducing the potential for ClassCastException at runtime.

### Item 28: Prefer lists to arrays

- Arrays are covariant, which means if `Sub` is a subtype of `Super`, then the array type `Sub[]` is a subtype of the array type `Super[]`. Generics, on the other hand, are invariant.
- Arrays are reified, meaning they enforce their element type at runtime, while generics use erasure, enforcing their type constraints only at compile time.
- Arrays do not provide compile-time type safety, and errors may only be discovered at runtime, which is undesirable.
- Generic collections should be used instead of arrays to ensure better type safety and interoperability.
- Using lists instead of arrays allows for better compile-time type safety, even if it sacrifices some conciseness or performance.

### Item 29: Favor generic types

- The use of generic types eliminates the need for explicit casts and ensures type safety at compile time.
- Bounded type parameters can be used to restrict the permissible values of type parameters in generic types, allowing for more specific behavior without explicit casting.
- It is recommended to use generic types whenever possible to avoid casting and improve type safety. Existing non-generic types should be _generified_, making them easier to use without breaking existing clients.

### Item 30: Favor generic methods

- To write a generic method, add type parameters to its declaration and use those type parameters throughout the method.
- Generic methods provide type safety and ease of use by eliminating the need for explicit casts.
- Bounded wildcard types can be used in generic methods to make them more flexible and allow for different types of arguments.

### Item 31: Use bounded wildcards to increase API flexibility

- Parameterized types are invariant, meaning that `List<String>` is not a subtype of `List<Object>`.
- Wildcard types allow you to specify that a parameter can be a subtype of a certain type, using `? extends Type` for producers and `? super Type` for consumers.
- Wildcard types should not be used as return types.
- Wildcard types are particularly useful when working with comparables and comparators.

### Item 32: Combine generics and `varargs` judiciously

- `Varargs` methods and generics do not interact well due to the nature of `varargs` creating arrays to hold the arguments.
- Alternatively, using a List parameter instead of a generic `varargs` parameter can provide type safety, relying on the `List.of` method to handle a variable number of arguments. The code may be slightly more verbose and slower.

### Item 33: Consider typesafe heterogeneous containers

- Common uses of generics involve parameterizing the container itself, such as `Set<E>` and `Map<K,V>`, which limits the number of type parameters per container.
- Runtime type safety can be achieved by checking the type relationship between the key and the instance being stored using a dynamic cast.
- Bounded type tokens can be used to restrict the types that can be passed as keys by using a bounded type parameter or a bounded wildcard.

## Enums and annotations

### Item 34: Use enums instead of `int` constants

- Some variants use String constants instead of int constants, but this approach has even more disadvantages. It can lead to errors, performance issues, and lacks type safety.
- Enum types in Java are full-fledged classes and offer type safety, expressive power, and additional benefits.
- Enum types consist of a fixed set of constants, each represented as an instance of the enum class. Enum constants are exported via public static final fields. Enum types are effectively final and can't be extended or instantiated outside the declared constants.
- Enum types provide compile-time type safety. If you declare a parameter or variable of an enum type, the compiler ensures that only valid enum constants can be assigned or passed as arguments.
- Each enum type has its own namespace, allowing identically named constants in different enum types without conflicts.
- Enum types can have methods, fields, and can implement interfaces.
- Enum types have comparable performance to int constants. The space and time cost of loading and initializing enum types is usually negligible.

### Item 35: Use instance fields instead of ordinals

- While it's possible to derive associated int values from the ordinal, it is strongly discouraged. Using ordinal-based calculations for associated values can lead to maintenance issues and limitations.
- The recommended solution is to store associated int values in instance fields instead of deriving them from the ordinal. By assigning each enum constant a specific value in the constructor, you can avoid the pitfalls of relying on the ordinal.

### Item 36: Use `EnumSet` instead of bit fields

- Traditionally, if the elements of an enumerated type are used primarily in sets, the int enum pattern (Item 34) is used. Each constant is assigned a different power of 2, allowing bitwise OR operations to combine multiple constants into a set.
  - It is harder to interpret a bit field when printed as a number compared to a simple int enum constant.
  - There is no easy way to iterate over all the elements represented by a bit field.
  - Bit fields require choosing a specific type (int or long) with a fixed width, which limits the maximum number of bits that can be used without changing the API.
- `EnumSet` provides type safety and interoperability, just like any other set implementation.
  - Built-in operations: Bulk operations like removeAll and retainAll are implemented efficiently using bitwise arithmetic.

### Item 37: Use `EnumMap` instead of ordinal indexing

- Ordinal indexing involves using an enum's ordinal value as an index to access elements in an array or list. Problems:
  - Using ordinals directly lacks the type safety provided by enums.
  - Due to the incompatibility of arrays with generics, the program requires an unchecked cast, resulting in a compile-time warning.
  - If the ordinal values change, the code breaks, and there's no compile-time checking to ensure correct indexing.
  - When using a two-dimensional array indexed by ordinals, the size of the table grows quadratically, even if some entries are null.
- The `EnumMap` is a specialized map implementation designed to work efficiently with enum keys.
  - They provide type safety, eliminating the need for unchecked casts. They also allow for cleaner code with no manual labeling of output.

### Item 38: Emulate extensible enums with interfaces

- Enum types in Java are not extensible by design.
- The basic idea is to define an interface for the opcode type and an enum that implements this interface.
- Emulating extensible enums with interfaces provides flexibility but has limitations. Implementations cannot be inherited from one enum type to another, and some code duplication may occur. Shared functionality can be encapsulated in a helper class or static helper method to reduce duplication.

### Item 39: Prefer annotations to naming patterns

- Annotations offer a superior alternative to naming patterns. They address the shortcomings of naming patterns by providing compile-time checking, better enforcement of usage constraints, and support for associating parameter values with program elements (e.g., `@Test`).
- While most programmers may not need to define their own annotation types, they should use predefined annotations provided by Java and consider using annotations provided by IDEs or static analysis tools. These annotations can enhance code quality and diagnostic information.

### Item 40: Consistently use the `Override` annotation

- The `@Override` annotation is used on method declarations to indicate that the annotated method overrides a declaration in a supertype (class or interface).
- Consistently using `@Override` protects against bugs by ensuring that overridden methods are correctly implemented. It helps catch errors where a method is intended to override a superclass method but ends up overloading it instead.
- In abstract classes and interfaces, it is worth annotating all methods that are believed to override superclass or super-interface methods, regardless of their nature (concrete or abstract). This helps ensure correctness and prevents accidental additions of new methods.

### Item 41: Use marker interfaces to define types

- A marker interface is an interface that contains _no method declarations_ but serves as a marker to designate a class implementing it as having a specific property. An example is the Serializable interface, which marks a class as serializable.
- Marker interfaces define a type that is implemented by instances of the marked class, allowing compile-time error detection. They provide stronger type checking compared to marker annotations, which cannot define a type.
- If the marker applies only to classes and interfaces, and there is a possibility of writing methods that accept only objects with the marking, a marker interface should be used. This enables compile-time type checking. If there is no need for such methods or if the marker is part of a framework heavily using annotations, a marker annotation is more appropriate.

## Lambdas and streams

### Item 42: Prefer lambdas to anonymous classes

- Lambdas are concise expressions that can be used to create instances of functional interfaces, providing a more compact alternative to anonymous classes.
- Lambdas lack names and documentation, making them less suitable for complex computations or those exceeding a few lines.
- Anonymous classes are still necessary for creating instances of abstract classes or interfaces with multiple abstract methods. Lambdas cannot obtain a reference to themselves, unlike anonymous classes.

### Item 43: Prefer method references to lambdas

- Method references offer a more concise alternative to lambdas. They allow you to refer to a method by name instead of providing a lambda expression. This is particularly useful when the lambda expression only calls a method without any additional logic. E.g.:
  - Method reference: `map.merge(key, 1, Integer::sum);`
  - Lambda expression: `service.execute(() -> action());`
- By using method references, you can eliminate the need to declare parameter names explicitly in the lambda expression.

### Item 44: Favor the use of standard functional interfaces

- Instead of using the Template Method pattern, which involves sub-classing and overriding methods, the modern approach is to provide static factories or constructors that accept function objects as parameters.
- The `java.util.function` package provides a collection of standard functional interfaces for various use cases. When choosing a functional parameter type, it is recommended to use the standard functional interfaces instead of creating custom interfaces.
- Functional interfaces should be annotated with the `@FunctionalInterface` annotation. This annotation serves as documentation, enforces the single abstract method requirement, and prevents accidental addition of abstract methods in the interface.
- In API design, it's important to avoid overloading methods that take different functional interfaces in the same argument position. This can create ambiguity for clients, and it's best to design the API to prevent this situation.

### Item 45: Use streams judiciously

- Streams were introduced in Java 8 as a way to perform bulk operations on sequences of data elements. A stream represents a sequence of elements, and a stream pipeline consists of a source stream, intermediate operations, and a terminal operation.
- The streams API provides a fluent API, allowing multiple operations to be chained together in a single expression. This enables concise and readable code.
- Overusing streams can make code harder to read and maintain.
- They have restrictions on accessing and modifying local variables and limited control flow capabilities.
- Streams are well-suited for tasks such as transforming elements, filtering, combining elements, accumulating into collections, and searching. If a computation requires access to corresponding elements from multiple stages of the pipeline, streams might not be the best choice.

### Item 46: Prefer side-effect-free functions in streams

- The fundamental aspect of the streams paradigm is structuring computations as a sequence of transformations where each stage's result is a pure function of the previous stage's result. A pure function depends only on its input and does not have any side effects or modify any state.
- When using stream operations, both intermediate and terminal, it's important to ensure that the function objects passed to them are free of side effects. This means they should not depend on mutable state or update any state.
- The correct usage of streams involves utilizing collectors, which encapsulate reduction strategies. Collectors can be used to gather elements into collections or create maps based on grouping or other criteria (e.g., `toList`, `toSet`, `toMap`, `groupingBy`).
- There are parallel and concurrent variants of collectors, such as `groupingByConcurrent` and `toConcurrentMap`, which efficiently handle parallel execution and produce `ConcurrentHashMap` instances.

### Item 47: Prefer Collection to Stream as a return type

- A `for` loop cannot be used to iterate over a stream, and it's not possible to add elements to a stream. This makes streams less flexible than collections.
  - To enable iteration over a stream with a for-each loop, an adapter method can be created. The method converts a Stream to an Iterable, allowing for the use of for-each loops.
- When designing a public API that returns a sequence, it is important to consider users who may prefer stream pipelines or for-each loops. The Collection interface, being a subtype of Iterable and providing a stream method, is often the best choice for a return type. Arrays can also be used when appropriate.

### Item 48: Use caution when making streams parallel

- Simply adding the `parallel` method to a stream pipeline does not guarantee improved performance. In some cases, it can lead to liveness failures, incorrect results, and unpredictable behavior.
- Performance gains from parallelism are most significant when working with data structures like `ArrayList`, `HashMap`, `HashSet`, `ConcurrentHashMap`, `arrays`, `int` ranges, and `long` ranges. These data structures can be easily split into sub-ranges, enabling efficient work division among parallel threads.
- Parallelization should only be used as a performance optimization.
- Certain domains, such as machine learning and data processing, are well-suited for parallel speedups.

## Methods

### Item 49: Check parameters for validity

- Clearly document the restrictions on parameter values in the method's documentation. Enforce these restrictions by performing parameter checks at the beginning of the method body. Detecting errors as soon as possible is crucial for maintaining code integrity.
- If a method fails to check its parameters, it may result in confusing exceptions, incorrect results, or compromised object states.
- For public and protected methods, use the `@throws` tag in Javadoc to document the exception that will be thrown if a parameter value violates a restriction.
- Use the `Objects.requireNonNull` method, introduced in Java 7, to check for null values. It is flexible and convenient, allowing you to specify your own exception detail message if desired. It returns the non-null value, enabling simultaneous null check and usage.
- Nonpublic methods can use assertions to check parameters since the package author controls the method's usage. Assertions throw AssertionError if the condition fails. Enabling assertions with the `-ea` flag is necessary for assertions to take effect.
- While it's important to check parameter validity, avoid imposing unnecessary restrictions on parameters. Design methods to be as general as possible, accepting a wide range of valid parameter values.

### Item 50: Make defensive copies when needed

- To protect against ill-behaved clients or honest mistakes, it is crucial to write robust classes that can handle unexpected behavior.
- Classes that contain mutable objects can be vulnerable to attacks that exploit their mutability.
- make defensive copies of each mutable parameter in the constructor. Use these copies as components of the class instance instead of the original objects. This ensures that changes to the original objects do not affect the class's internal state.
- Accessor methods that provide access to mutable internal fields should also return defensive copies of the fields.
- Whenever possible, use immutable objects as components of your classes to eliminate the need for defensive copying. Immutable objects are inherently safe and can simplify your code.

### Item 51: Design method signatures carefully

- Choose method names carefully.
- Avoid excessive convenience methods. Convenience methods are useful, but they can make the API more difficult to learn and maintain.
- Limit parameter list length.
- Prefer interfaces over classes for parameter types. Use interfaces to define parameters instead of specific classes whenever possible. This allows for more flexibility and enables the use of different implementations. For example, use the `Map` interface instead of the `HashMap` class to allow different `Map` implementations to be used.
- Use enums instead of boolean parameters. Enums allow for future expansion by adding more options without changing method signatures.

### Item 52: Use overloading judiciously

- Overloading can lead to unexpected behavior: If overloaded methods have the same number of parameters and the same compile-time type of the arguments, the selection of the method is ambiguous.
- Overloaded methods should have "radically different" parameter types.
- Generics can create situations where two overloadings with different functional interfaces in the same argument position cause confusion. It's recommended not to overload methods that take different functional interfaces in the same argument position.

### Item 53: Use varargs judiciously

- Varargs allow methods to accept a variable number of arguments of a specified type. They work by creating an array internally and passing the array to the method.
- Use varargs when you want a method with a variable number of arguments. For example, when calculating the sum of integers or finding the minimum of a set of integers.
- Declare the method to take two parameters: one normal parameter and one varargs parameter. This ensures that the method can handle both cases when at least one argument is passed and when more than one argument is passed.
- Be aware that every invocation of a varargs method causes an array allocation and initialization, so consider the performance implications in performance-critical situations.
  - To optimize performance while still using varargs, you can provide overloaded methods with a fixed number of parameters and a single varargs method for cases when the number of arguments exceeds a certain threshold.

### Item 54: Return empty collections or arrays, not nulls

- Returning null to indicate an empty collection or array is unnecessary and error-prone. It requires extra code in the client to handle the null return value and increases the risk of null pointer errors.
- Instead of returning null, return empty collections or arrays. This can be achieved by creating a new instance of the appropriate collection or array type. For example, returning `new ArrayList<>(cheesesInStock)` will return an empty `ArrayList` if `cheesesInStock` is empty.

### Item 55: Return optionals judiciously

- Exceptions should be reserved for exceptional conditions, and returning null requires special-case code to handle it and increases the risk of null pointer errors.
- The `Optional<T>` class represents an immutable container that can hold either a single non-null value of type `T` or nothing at all (empty). It provides a more flexible and less error-prone alternative to exceptions or null returns.
- Avoid using `Optional<T>` for container types like collections, maps, streams, arrays, and other optionals. Return the empty container directly instead of wrapping it in an optional.

### Item 56: Write doc comments for all exposed API elements

- Javadoc is a utility that generates API documentation automatically from specially formatted doc comments in the source code.
- Precede every exported class, interface, constructor, method, and field declaration with a doc comment. It describes the contract between the API element and its client.
- Document the preconditions, post-conditions, and side effects of methods. Use the `@param` tag to describe parameters, `@return` tag for the return value (if not void), and `@throws` tag for exceptions thrown.
- Use HTML tags in doc comments to format and structure the generated documentation.
- Use `{@code}` tag to render code fragments in code font and to suppress processing of HTML markup and nested Javadoc tags within the code fragment.
- Write summary descriptions as _verb_ phrases for _methods and constructors_, and _noun_ phrases for _classes_, _interfaces_, and _fields_. The first sentence becomes the summary description.
- Use `{@literal}` tag to include HTML metacharacters in documentation, such as `<`, `>`, and `&`.
- Document self-use patterns in classes designed for inheritance using the `@implSpec` tag. It describes the contract between the method and its subclass.
- Package-level doc comments should be placed in `package-info.java` file. Similarly, module-level comments should be placed in `module-info.java` file.
- Document thread-safety and serializability of classes.
- Read the generated documentation to ensure clarity and make any necessary improvements to the doc comments.

## General programming

### Item 57: Minimize the scope of local variables

- Declare variables where they are first used, rather than at the beginning of a block. This approach eliminates clutter and helps readers understand the purpose and type of the variable when it is used.
- Avoid prematurely declaring variables outside of the block in which they are used. By doing so, you ensure that the variable's scope begins at the appropriate point and ends when it is no longer needed.
- Take advantage of the scope-limiting capabilities of for loops.
- Prefer for loops over while loops when the loop variable is not needed after the loop terminates.
- Minimizing the scope of local variables helps prevent copy-and-paste errors.
- Consider using multiple loop variables within a for loop to avoid redundant computations. This approach can improve performance by storing the limit of the first variable in a second variable, eliminating the need for redundant computations in each iteration.
- Keep methods small and focused to minimize the scope of local variables.

### Item 58: Prefer `for-each` loops to traditional `for` loops

- Traditional `for` loops for iteration over collections and arrays can be cluttered and prone to errors. They require explicit use of an iterator or an index variable.
- The for-each loop (enhanced for statement) solves these issues by eliminating the need for explicit iterators or index variables: `for (Element e : elements) { ... }`
- For-each loops can be used with both collections and arrays, making it easy to switch the implementation type of a container without changing the loop syntax.
- For nested iteration, for-each loops offer greater clarity and simplicity compared to traditional for loops. They avoid common bugs that can occur when using multiple iterators or index variables.
- There are certain situations where for-each loops cannot be used, such as when performing destructive filtering, transforming values, or iterating in parallel. In these cases, traditional for loops or other approaches may be necessary.
- The `Iterable` interface allows objects to be iterated over using the for-each loop. By implementing the `Iterable` interface and providing an iterator method, your custom types can be used with for-each loops.

### Item 59: Know and use the libraries

- Libraries, such as `Random`, offer well-designed and thoroughly tested methods for common tasks.
- The use of libraries saves time and effort. You can focus on your application logic instead of spending time on low-level implementations.
- Standard libraries tend to improve over time in terms of performance and functionality.
- While the libraries are extensive, every programmer should be familiar with the basics of `java.lang`, `java.util`, `java.io`, and their sub-packages. Additional knowledge can be acquired on an as-needed basis.
- Certain libraries, such as the collections framework, streams library, and concurrency utilities in `java.util.concurrent`, should be part of every programmer's toolkit.
- Avoid reinventing the wheel. If a common task can be accomplished using existing library facilities, utilize them instead of writing your own code. Library code is often more robust and undergoes more scrutiny than individual developers can afford.

### Item 60: Avoid float and double if exact answers are required

- `float` and `double` types are designed for scientific and engineering calculations and provide fast but approximate results using binary floating-point arithmetic.
- The inherent imprecision of float and double types makes them unsuitable for applications where exact results are necessary, such as monetary calculations.
- Performing arithmetic operations with float and double types can lead to unexpected rounding errors and inaccuracies.
- Rounding the results before printing is not a reliable solution to the imprecision issue.
- To achieve accurate results in monetary calculations, it is recommended to use alternative data types like `BigDecimal`, `int`, or `long`.
- `BigDecimal` is a precise data type that can handle exact decimal calculations. It is suitable for situations where accuracy is paramount, such as monetary calculations. However, it is less convenient to use than primitive types and slower in performance.
- An alternative approach is to perform calculations in cents using int or long types, keeping track of the decimal point manually. This approach is more efficient and convenient than using `BigDecimal` but has limitations in handling large quantities.
- Use BigDecimal when precision is critical, int or long when performance and convenience are important, and float or double when approximate results are acceptable.
- `BigDecimal` offers full control over rounding, which is useful in business calculations with legally mandated rounding behavior.

### Item 61: Prefer primitive types to boxed primitives

- Java has two types: primitives (e.g., `int`, `double`, `boolean`) and reference types (e.g., `String`, `List`). Each primitive type has a corresponding boxed primitive type (e.g., `Integer`, `Double`, `Boolean`).
- Primitives only have values, while boxed primitives have both values and identities.
- Boxed primitives have an additional nonfunctional value: `null`.
- Primitives are more time- and space-efficient compared to boxed primitives.
- Comparing boxed primitives with the `==` operator performs an identity comparison, not a value comparison.
- Auto-unboxing a null boxed primitive results in a NullPointerException.
- Auto-boxing and auto-unboxing operations can lead to unnecessary object creations and performance issues.
- Use primitives whenever possible, especially when comparing values or performing computations.
- Boxed primitives are necessary in specific situations:
  - When using collections, as primitives cannot be directly added to collections;
  - As type parameters in parameterized types and methods;
  - When making reflective method invocations.

### Item 62: Avoid strings where other types are more appropriate

- Strings should be used to represent text and should not be used as substitutes for other value types.
- Avoid using strings to represent numeric data. Translate numeric data into the appropriate numeric type, such as `int`, `float`, or `BigInteger`, to ensure accuracy and enable numerical operations.
- Enum types are better suited for enumerated type constants than strings. Use enums to represent a fixed set of values with distinct identities and behaviors.

### Item 63: Beware the performance of string concatenation

- The string concatenation operator is convenient for combining a few strings but does not scale well. When using the concatenation operator repeatedly, the time required is quadratic in the number of strings being concatenated because the contents of both strings are copied each time.
- To achieve better performance, use a `StringBuilder` instead of the string concatenation operator when constructing a string from multiple components. `StringBuilder` provides efficient appending of strings, and its performance is linear in the number of strings being concatenated.
- The `StringBuilder` approach can significantly outperform the string concatenation operator, especially when the number of strings or the size of the resulting string is large. Preallocating a `StringBuilder` with an appropriate capacity further improves performance by avoiding automatic growth.
- Consider alternatives to string concatenation, such as using a character array or processing strings individually instead of combining them if performance is a concern.

### Item 64: Refer to objects by their interfaces

- Favor using interfaces as types over classes when referring to objects. Parameters, return values, variables, and fields should all be declared using interface types if appropriate interfaces exist.
- By using interfaces as types, your code becomes more flexible. If you decide to switch implementations, you can simply change the class name in the constructor (or use a different static factory) without affecting the surrounding code.
- It is appropriate to refer to objects by their class rather than an interface when no appropriate interface exists, such as with value classes like `String` or `BigInteger`.
- Classes implementing an interface but providing additional methods not found in the interface should be referred to by their class only if the program relies on those extra methods.

### Item 65: Prefer interfaces to reflection

- Reflection provides programmatic access to arbitrary classes and allows manipulation of their constructors, methods, and fields. However, it comes with several drawbacks:
  - Loss of compile-time type checking and exception checking;
  - Clumsy and verbose code required for reflective access;
  - Poor performance compared to normal method invocation.
- Reflection is rarely needed in most applications.

### Item 66: Use native methods judiciously

- The use of native methods has serious disadvantages:
  - Native languages are not memory safe, so applications using native methods are susceptible to memory corruption errors;
  - Native methods make programs less portable as they are more platform-dependent than Java;
  - Debugging native code is more challenging compared to Java code;
  - Garbage collection and memory management become more complex since the garbage collector cannot track or automate native memory usage;
  - Native methods require writing and maintaining "glue code," which can be difficult to read and tedious to write.
- Use as little native code as possible.
- Thoroughly test the native code to avoid bugs that could corrupt the entire application.

### Item 67: Optimize judiciously

- Premature optimization is often counterproductive. More computing sins are committed in the name of efficiency than for any other reason. Optimization without necessarily achieving it can lead to software that is neither fast nor correct and can be difficult to fix.
- Good programs should prioritize sound architectural principles over performance. Write good programs first, and if necessary, optimize them later. Good programs are designed with information hiding, allowing individual components to be changed without affecting the rest of the system.
- Performance should be considered during the design process. Avoid design decisions that limit performance, especially in APIs, wire-level protocols, and persistent data formats. API design can have a significant impact on performance, so be mindful of decisions such as mutability, inheritance, and interface usage.
- API design and architectural decisions can have real performance consequences. Consider the trade-offs and implications of your design choices. For example, returning mutable objects may result in unnecessary defensive copying, and using implementation types instead of interfaces can limit future performance improvements.
- Before optimizing, ensure that your program has a clear, concise, and well-structured implementation. Measure performance before and after each attempted optimization. Profiling tools can help identify performance bottlenecks and guide optimization efforts. Be aware that Java's performance model is less well-defined compared to lower-level languages, making it essential to measure the effects of optimizations on different implementations and hardware platforms.
- Algorithmic changes should be prioritized over low-level optimizations. If a quadratic or inefficient algorithm exists, no amount of tuning will fix the underlying problem.
- Performance measurement and optimization are iterative processes. Measure performance, identify bottlenecks, optimize relevant parts, and repeat until satisfied.

### Item 68: Adhere to generally accepted naming conventions

- Typographical Naming Conventions:
  - Package and module names should be hierarchical, separated by periods, and consist of lowercase alphabetic characters and digits. The name should begin with the organization's Internet domain name, with the components reversed;
  - Class and interface names should consist of one or more words, with the first letter of each word capitalized. Abbreviations should be avoided, except for acronyms and common abbreviations.
  - Method and field names should follow the same typographical conventions as class and interface names, with the first letter lowercase for methods and fields. Acronyms occurring as the first word should be lowercase;
  - Constant field names should consist of uppercase words separated by underscores;
  - Local variable names follow similar conventions to member names, with abbreviations and short sequences of characters permitted.
- Grammatical Naming Conventions:
  - Instantiable classes are generally named with a singular noun or noun phrase. Non-instantiable utility classes are often named with a plural noun;
  - Interfaces are named like classes or with an adjective ending in "able" or "ible";
  - Methods that perform actions are named with a verb or verb phrase. Methods returning boolean values usually begin with "is" or "has";
  - Methods returning non-boolean values or attributes of the object are usually named with a noun, noun phrase, or a verb phrase beginning with "get";
  - Field names typically follow the same conventions as class and interface names, using nouns or noun phrases.

## Exceptions

### Item 69: Use exceptions only for exceptional conditions

- Exceptions should be used for exceptional circumstances, situations that are uncommon and unexpected. They should not be used for regular control flow.
- Exceptions are not designed to be as fast as explicit tests, so using them for control flow can result in slower code execution.
- Placing code inside a try-catch block inhibits certain optimizations that JVM implementations may perform.
- The exception-based loop, which relies on throwing and catching exceptions for loop termination, is slower, obfuscates the code's purpose, and can hide bugs in the code.
- Exceptions used for control flow can mask bugs, making debugging more complicated. Bugs that would generate uncaught exceptions in a standard loop idiom may be caught and misinterpreted as normal loop termination in an exception-based loop.
- An alternative to a state-testing method is to have the state-dependent method return an empty optional or a distinguished value (such as null) if it cannot perform the desired computation.

### Item 70: Use checked exceptions for recoverable conditions and runtime exceptions for programming errors

- Checked exceptions should be used for conditions from which the caller can reasonably be expected to recover. By throwing a checked exception, the API designer mandates the caller to handle the exception or propagate it.
- Checked exceptions indicate recoverable conditions, and the API user should make an effort to handle them appropriately.
- Unchecked throwables, which include runtime exceptions and errors, needn't and generally shouldn't be caught. They indicate situations where recovery is impossible, and continued execution would do more harm than good.
- Runtime exceptions are typically used to indicate programming errors, such as precondition violations.
- It may not always be clear whether a condition is recoverable or a programming error. In such cases, it is a matter of judgment for the API designer. If recovery is likely, use a checked exception; if not, use a runtime exception.
- Checked exceptions should provide methods that aid in recovery from the exceptional condition.

### Item 71: Avoid unnecessary use of checked exceptions

- Overuse of checked exceptions can make APIs difficult to use.
- The burden on the programmer increases when dealing with checked exceptions, as they must be handled in catch blocks or propagated outward, placing a burden on the API user.
- Another approach is to refactor the method that throws the checked exception into two methods: one that returns a boolean indicating whether the exception would be thrown and another that performs the action. This allows the caller to check the state before invoking the action method.
- Use checked exceptions sparingly, consider returning optionals, and throw unchecked exceptions if recovery is not possible or meaningful for the caller.

### Item 72: Favor the use of standard exceptions

- Reusing standard exceptions in your APIs and programs provides several benefits, including easier learning and usage, improved readability, and reduced memory footprint and class loading time.
- The most commonly reused exception types are `IllegalArgumentException` and `IllegalStateException`. `IllegalArgumentException` is used when the caller passes an _inappropriate argument value_, while `IllegalStateException` is used when the invocation is _illegal due to the state of the receiving object_.
- It is recommended to use specific standard exceptions like `NullPointerException` and `IndexOutOfBoundsException` for certain kinds of illegal arguments and states instead of using `IllegalArgumentException`.
- ConcurrentModificationException is a reusable exception used to indicate concurrent modification of an object that was designed for single-threaded use or with external synchronization.
- `UnsupportedOperationException` is another reusable exception used to indicate that an object does not support a particular operation, typically because it is an optional operation defined by an interface that the object implements.It is advised not to reuse the `Exception`, `RuntimeException`, `Throwable`, or `Error` classes directly. Treat them as abstract and avoid testing for them directly because they are superclasses of other exceptions.
- When reusing exceptions, ensure that the conditions under which you would throw them align with their documented semantics. You can subclass a standard exception to add more detail if needed.
- Choosing which exception to reuse can be challenging when multiple exceptions seem applicable. In such cases, follow the rule to throw `IllegalStateException` if no argument values would have worked, otherwise throw `IllegalArgumentException`.

### Item 73: Throw exceptions appropriate to the abstraction

- Higher layers should catch lower-level exceptions and throw exceptions that are meaningful and can be explained in terms of the higher-level abstraction. This is known as _exception translation_.
- _Exception translation_ is achieved by catching the lower-level exception and throwing a higher-level exception that encapsulates the lower-level exception and provides a more meaningful explanation of the problem.
- Exception chaining is a special form of exception translation where the lower-level exception is passed to the higher-level exception as the cause. This allows for easy access to the lower-level exception and integration of its stack trace into the higher-level exception's stack trace.
- Exception translation should not be overused. Whenever possible, exceptions from lower layers should be prevented or handled within the higher layer itself.
- If exceptions from lower layers cannot be prevented or handled, it may be appropriate for the higher layer to silently work around these exceptions, log them using an appropriate logging facility, and insulate the caller from lower-level problems.
- Exception translation allows for better encapsulation, clearer APIs, and the ability to investigate the underlying cause of failures while insulating clients from lower-level exceptions.

### Item 74: Document all exceptions thrown by each method

- Documenting the exceptions thrown by a method is a critical part of the documentation required to use the method correctly.
- Always declare checked exceptions individually and document the specific conditions under which each exception is thrown using the Javadoc `@throws` tag.
- While the language does not require documenting unchecked exceptions, it is wise to document them carefully as they often represent programming errors. Familiarizing programmers with all the possible errors helps them avoid making these mistakes.
- Do not use the `throws` keyword on unchecked exceptions.
- It is ideal to document all unchecked exceptions that each method can throw, but in practice, it may not always be achievable due to dependencies on other classes that may throw additional unchecked exceptions.
- If an exception is thrown by many methods in a class for the same reason, you can document the exception in the class's documentation comment instead of documenting it individually for each method.
- Failing to document the exceptions that your methods can throw can make it difficult or impossible for others to effectively use your classes and interfaces.

### Item 75: Include failure-capture information in detail messages

- The detail message of an exception should capture as much information as possible concerning the cause of the failure. It should contain the values of all parameters and fields that contributed to the exception.
- Including pertinent data in the detail message aids in diagnosing the cause of the failure. It helps identify specific errors such as incorrect index values, boundary violations, or invariant failures.
- It is crucial to avoid including security-sensitive information like passwords or encryption keys in exception detail messages as stack traces may be seen by multiple individuals during the debugging and issue-fixing process.
- Do not write lengthy prose descriptions.
- The detail message of an exception is primarily intended for programmers or site reliability engineers, not end users. Therefore, information content is more important than readability.
- Requiring failure-capture information as parameters in the constructors of exceptions can ensure that the detail message automatically includes the necessary information. This centralizes the code for generating a high-quality detail message in the exception class itself.

### Item 76: Strive for failure atomicity

- Failure atomicity means that after an object throws an exception, it should still be in a well-defined, usable state, even if the failure occurred in the midst of performing an operation.
- Immutable objects naturally achieve failure atomicity because their state is consistent when they are created and cannot be modified thereafter.
- For methods that operate on mutable objects, one way to achieve failure atomicity is to check parameters for validity before performing the operation. This ensures that most exceptions are thrown before object modification commences.
- Another approach to achieving failure atomicity is to order the computation so that any part that may fail takes place before any part that modifies the object. This ensures that failure occurs before any modification to the object.
- A third approach is to perform the operation on a temporary copy of the object and replace the contents of the object with the temporary copy once the operation is complete. This is useful when the computation can be performed more efficiently on a temporary data structure.
- Recovery code can be written to intercept a failure and roll back the object's state to the point before the operation began. This approach is mainly used for durable data structures.
- Failure atomicity is not always achievable, especially in cases of concurrent modification without proper synchronization. In such cases, objects may be left in an inconsistent state.
- It is not always desirable or practical to achieve failure atomicity, as it can increase cost and complexity. However, it is often easy to achieve once the issue is understood.
- API documentation should clearly indicate whether failure atomicity is achieved and what state the object will be left in after a method invocation.

### Item 77: Don't ignore exceptions

- When an API declares a method to throw an exception, it is indicating that there may be exceptional conditions that need to be handled.
- Ignoring exceptions by surrounding a method invocation with an empty catch block defeats the purpose of exceptions and can lead to disastrous results.
- Ignoring exceptions is like ignoring a fire alarm and preventing others from addressing the problem. It is important to handle exceptional conditions appropriately.
- There are situations where it may be appropriate to ignore an exception, such as when closing a file input stream where no recovery action is needed and the operation can proceed without issues.
- If an exception is intentionally ignored, the catch block should contain a comment explaining the reason for ignoring it, and the variable used to catch the exception should be named `ignored` to indicate that it is intentionally disregarded.
- Ignoring exceptions can lead to a program that continues silently despite errors, potentially causing failures at unexpected points in the code.
- Letting exceptions propagate outward can at least result in a swift failure, preserving information for debugging purposes.

## Concurrency

### Item 78: Synchronize access to shared mutable data

- Synchronization ensures that only one thread can execute a synchronized method or block at a time, preventing an object from being seen in an inconsistent state by other threads.
- Synchronization not only guarantees mutual exclusion but also ensures that changes made by one thread are visible to other threads. It provides reliable communication between threads.
- Reading and writing a variable (other than long or double) is atomic, but it does not guarantee that changes made by one thread will be immediately visible to other threads without synchronization.
- Failing to synchronize access to shared mutable data can have dire consequences, even if the data is atomically readable and writable. It can lead to liveness failures and data corruption.
- The `java.util.concurrent.atomic` package provides lock-free, thread-safe primitives, such as `AtomicLong`, for performing atomic operations on single variables, which can be used as a more efficient alternative to synchronized methods.
- The best approach to avoid synchronization issues is to minimize sharing of mutable data. Either use immutable data or confine mutable data to a single thread. If sharing is necessary, ensure proper synchronization or use safe publication techniques.
- Safe publication involves ensuring that an object reference is safely shared with other threads by using techniques such as storing it in a static field during class initialization or using volatile or final fields.

### Item 79: Avoid excessive synchronization

- Excessive synchronization can lead to reduced performance, deadlocks, or nondeterministic behavior.
- Excessive synchronization should be avoided for performance reasons. Excessive locking can lead to contention and limit parallelism, as well as hinder the VM's ability to optimize code execution.
- Avoid unnecessary synchronization for mutable classes and document that they are not thread-safe if synchronization is omitted.
- If a method modifies a static field and can be called from multiple threads, synchronize access to the field internally to prevent data corruption and ensure deterministic behavior.
- Consider advanced synchronization techniques such as lock splitting, lock striping, and nonblocking concurrency control to achieve high concurrency when internal synchronization is necessary.

### Item 80: Prefer executors, tasks, and streams to threads

- The `java.util.concurrent` package introduced the `Executor` Framework, which provides a flexible interface-based task execution facility. It is recommended to use executors instead of writing your own work queues.
- Creating an executor service is as simple as calling a static factory method. For example, `Executors.newSingleThreadExecutor()` creates an executor service with a single background thread.
- Tasks can be submitted for execution using the `execute()` method of the executor service. The executor service takes care of managing the execution of tasks.
- To gracefully terminate the executor service, the `shutdown()` method should be called. This ensures that the executor service will complete any pending tasks before exiting.
- The executor service provides various additional functionalities, such as waiting for specific tasks or collections of tasks to complete, scheduling tasks to run at specific times, retrieving task results, and more.
- Java provides static factory methods in the `Executors` class that offer different types of executor services, such as cached thread pools, fixed thread pools, and scheduled thread pools. These cover most use cases, but the `ThreadPoolExecutor` class allows fine-grained control over thread pool configuration.
- Choosing the right executor service depends on the specific requirements of the application. For small programs or lightly loaded servers, `Executors.newCachedThreadPool()` is often sufficient. For heavily loaded production servers, `Executors.newFixedThreadPool()` or ThreadPoolExecutor with custom configuration is recommended.
- The executor framework separates the unit of work (tasks) from the mechanism of executing it (executor service). This separation provides flexibility in selecting appropriate execution policies and allows easy changes if requirements evolve.
- Working directly with threads is discouraged. Instead, think in terms of tasks and let the executor service execute them. This approach allows you to leverage the flexibility and control provided by the executor framework.
- For a comprehensive understanding of the Executor Framework, it is recommended to refer to the book [Java Concurrency in Practice](https://jcip.net/) by Brian Goetz.

### Item 81: Prefer concurrency utilities to `wait` and `notify`

- The higher-level concurrency utilities fall into three categories: the Executor Framework (covered in Item 80), concurrent collections, and synchronizers.
- Concurrent collections are high-performance implementations of standard collection interfaces that internally manage their own synchronization. They provide high concurrency and state-dependent modify operations, making them ideal for concurrent applications.
- Synchronizers are objects that enable threads to coordinate their activities. Examples include `CountDownLatch`, `Semaphore`, `CyclicBarrier`, and `Phaser`.
- The concurrent utilities provide high-level abstractions that simplify common concurrency scenarios. For example, a `ConcurrentHashMap` can be used to implement a thread-safe canonicalizing map, and a `BlockingQueue` can be used as a work queue for producer-consumer scenarios.

### Item 82: Document thread safety

- Thread safety, or how a class behaves when its methods are used concurrently, is an important part of its contract with clients.
- Failing to document the thread safety aspect of a class can lead to incorrect assumptions about synchronization, resulting in serious errors.
- The private lock object should be declared final to prevent accidental un-synchronized access and is particularly useful for classes designed for inheritance.

### Item 83: Use lazy initialization judiciously

- Lazy initialization can be used to optimize the cost of initializing a class or creating an instance by deferring the initialization of a field until it is accessed.
- Lazy initialization should only be used when necessary, as it can increase the cost of accessing the lazily initialized field.
- Measure the performance impact of lazy initialization to determine whether it is beneficial for a specific scenario.
- In the presence of multiple threads, lazy initialization requires synchronization to avoid bugs.
- Normal initialization with the final modifier is usually preferable to lazy initialization for most fields.

### Item 84: Don't depend on the thread scheduler

- The thread scheduler determines which threads get to run and for how long when many threads are runnable. However, the thread-scheduling policy can vary between operating systems, so relying on specific details of the policy can lead to non-portable programs.
- To write a robust, responsive, and portable program, aim to keep the average number of runnable threads close to the number of processors. This minimizes variations in behavior caused by different thread-scheduling policies.
- To keep the number of runnable threads low, ensure that each thread does some useful work and then waits for more. Thread pools should be sized appropriately, and tasks should be neither too short nor too long to avoid dispatch overhead.
- Avoid busy-waiting, where threads repeatedly check a shared object waiting for its state to change. Busy-waiting puts unnecessary load on the processor and reduces the amount of useful work that can be accomplished. It also makes the program vulnerable to the thread scheduler's behavior.

## Serialization

### Item 85: Prefer alternatives to Java serialization

- Serialization in Java has proven to be risky, with problems related to correctness, performance, security, and maintenance.
- The attack surface of serialization is significant and constantly growing. Deserializing objects can execute code from any type on the classpath, making it vulnerable to exploits.
- Security researchers have discovered and exploited vulnerabilities in deserialization, leading to serious attacks, such as the SFMTA Muni ransomware attack.
- Deserialization bombs can be used to mount denial-of-service attacks by causing deserialization of byte streams that take a long time to process.
- The best defense against serialization exploits is to avoid deserializing untrusted data altogether. Serialization should be replaced with alternative mechanisms for translating objects to byte sequences.
- Cross-platform structured-data representations like JSON and Protocol Buffers offer advantages such as portability, high performance, tooling support, and a large community.

### Item 86: Implement `Serializable` with great caution

- Implementing Serializable has long-term costs, as the serialized form of a class becomes part of its exported API. Changing the class's internal representation while maintaining compatibility with the serialized form can be challenging and may limit the class's evolution.
- Serialization introduces the risk of bugs and security vulnerabilities. Deserialization acts as a "hidden constructor" and must guarantee invariants established by constructors, while also preventing unauthorized access to object internals.

### Item 87: Consider using a custom serialized form

- When the default serialized form is inappropriate for a class, it can result in several disadvantages, such as permanently tying the API to the current internal representation, consuming excessive space and time during serialization, and potentially causing stack overflows.
- Regardless of the serialized form chosen, any synchronization imposed on the object's methods should also apply to the `writeObject` method to prevent resource-ordering deadlocks.
- Taking the time to design a custom serialized form that accurately represents the logical data and excludes unnecessary implementation details can lead to more flexible, efficient, and maintainable serialization. The default serialized form should only be accepted if it aligns well with the class's logical state.

### Item 88: Write `readObject` methods defensively

- The `readObject` method is similar to a public constructor for deserializing objects, and it requires the same care as any other constructor to ensure the object's validity and invariants.
- To prevent invalid objects from being deserialized, the `readObject` method should perform validity checks after calling `defaultReadObject`.

### Item 89: For instance control, prefer enum types to `readResolve`

- When a class is serialized and deserialized, the `readResolve` method can be used to substitute another instance for the one created during deserialization.
- The `readResolve` method can be implemented in a singleton class to return the original singleton instance and maintain the singleton property during deserialization.
- The preferred approach for instance control is to use an enum type. Enum types guarantee that only the declared constants are the instances of the class, preventing any additional instances from being created during deserialization.

### Item 90: Consider serialization proxies instead of serialized instances

- The serialization proxy pattern involves designing a private static nested class, called the serialization proxy, that represents the logical state of the enclosing class in a concise manner.
- The serialization proxy should have a single constructor that takes the enclosing class as a parameter and copies its data without performing any consistency checking or defensive copying.
- Both the enclosing class and its serialization proxy should implement the `Serializable` interface.
- The serialization proxy pattern eliminates the need for explicit field-level validation during deserialization and ensures that the invariants of the enclosing class are maintained.

---

# Conclusion

While I did not find this book to be particularly entertaining, it is a very useful reference for Java developers. It covers a wide range of topics and provides a lot of useful information. I would recommend this book to anyone who is interested in learning more about the Java language and its best practices.

## Resources and references

- [Effective Java, Third Edition](https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/) - Joshua Bloch.
- [Java Concurrency in Practice](https://jcip.net/) - Brian Goetz.
