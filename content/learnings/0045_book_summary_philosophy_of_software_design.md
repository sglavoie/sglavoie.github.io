Title: Reading notes: A Philosophy of Software Design, 2nd Edition
Date: 2025-03-30 11:18
Tags: books, design, software, skimming-notes
Slug: book-summary-philosophy-software-design-2nd-edition
Authors: Sébastien Lavoie
Summary: _A Philosophy of Software Design, 2nd Edition_ by [John Osterhout](https://en.wikipedia.org/wiki/John_Ousterhout) beautifully covers the nature of complexity in software. It provides clear strategies to keep complexity as low as possible while giving real-world examples along the way from his own work (e.g., [RAMCloud](https://ramcloud.atlassian.net/wiki/spaces/RAM/overview) or the [Tcl](https://en.wikipedia.org/wiki/Tcl) programming language). He also gathered, for instance, interesting sources of various designs for a GUI text editor from his students, highlighting essential points to keep in mind while designing software.

[TOC]

---

## Nature of complexity

- _"Change amplification: The first symptom of complexity is that a seemingly simple change requires code modifications in many different places."_ (e.g., refactoring a project to inject dependencies in tests, because the system was hard to test in the first place)
- _"Cognitive load: The second symptom of complexity is cognitive load, which refers to how much a developer needs to know in order to complete a task."_ (e.g., close a file where it is opened whenever possible, instead of leaking context and pushing the responsibility onto the caller)
- _"Unknown unknowns: The third symptom of complexity is that it is not obvious which pieces of code must be modified to complete a task, or what information a developer must have to carry out the task successfully."_
- _"One of the most important goals of good design is for a system to be obvious."_

## Strategic vs. tactical programming

- _"it's worth taking a little extra time to find a simple design for each new class; rather than implementing the first idea that comes to mind, try a couple of alternative designs and pick the cleanest one. Try to imagine a few ways in which the system might need to be changed in the future and make sure that will be easy with your design"_

## Modules should be deep

- Modular design
    - _"In general, if a developer needs to know a particular piece of information in order to use a module, then that information is part of the module's interface."_
- Abstractions
    - _"The key to designing abstractions is to understand what is important, and to look for designs that minimize the amount of information that is important"_
- A deep module is one in which the interface is small and the implementation is large.
    - _"Deep modules such as Unix I/O and garbage collectors provide powerful abstractions because they are easy to use, yet they hide significant implementation complexity."_
- Shallow modules
    - _"A shallow module is one whose interface is complicated relative to the functionality it provides."_

## Information hiding

- _"If a piece of information is hidden, there are no dependencies on that information outside the module containing the information, so a design change related to that information will affect only the one module"_
- Information leakage
    - _"If the affected classes are relatively small and closely tied to the leaked information, it may make sense to merge them into a single class."_
    - _"When designing modules, focus on the knowledge that's needed to perform each task, not the order in which tasks occur."_
    - _"it's important to avoid exposing internal data structures as much as possible"_
- _"The best features are the ones you get without even knowing they exist."_
- _"As a software designer, your goal should be to minimize the amount of information needed outside a module; for example, if a module can automatically adjust its configuration, that is better than exposing configuration parameters"_
- _"think about the different pieces of knowledge that are needed to carry out the tasks of your application, and design each module to encapsulate one or a few of those pieces of knowledge. This will produce a clean and simple design with deep modules."_

## General-Purpose Modules are Deeper

- _"specialization leads to complexity"_
- Generality leads to better information hiding
- _"Eliminate special cases in code"_

## Different Layer, Different Abstraction

- _"A pass-through method is one that does nothing except pass its arguments to another method, usually with the same API as the pass-through method. This typically indicates that there is not a clean division of responsibility between the classes."_

## Pull Complexity Downwards

- Figure out complexity in the library instead of pushing it up to the user.
- _"[...] you should avoid configuration parameters as much as possible. Before exporting a configuration parameter, ask yourself: will users (or higher-level modules) be able to determine a better value than we can determine here?"_

## Better Together Or Better Apart?

- _"Bring together if information is shared"_
- _"Bring together if it will simplify the interface"_
- _"Bring together to eliminate duplication"_
    - Use `goto` to exit nested code blocks early as long as it's not too complex.
- On Splitting long methods: _"If you make a split of this form and then find yourself flipping back and forth between the parent and child to understand how they work together, that is a red flag ("Conjoined Methods") indicating that the split was probably a bad idea."_
- _"If the caller has to invoke each of the separate methods, passing state back and forth between them, then splitting is not a good idea."_

## Define Errors Out Of Existence

- _"The key overall lesson from this chapter is to **reduce the number of places where exceptions must be handled**; in some cases the semantics of operations can be modified so that the normal behavior handles all situations and there is no exceptional condition to report [...]."_
- _"The best way to eliminate exception handling complexity is to **define your APIs so that there are no exceptions to handle**: define errors out of existence"_
- E.g., the Java `substring` method could remove its `IndexOutOfBoundsException` by automatically rounding the index to the nearest valid value.
- _"**Exception masking** doesn't work in all situations, but it is a powerful tool in the situations where it works. It results in deeper classes, since it reduces the class's interface (fewer exceptions for users to be aware of) and adds functionality in the form of the code that masks the exception. Exception masking is an example of pulling complexity downward."_
- _"The idea behind exception aggregation is to handle many exceptions with a single piece of code; rather than writing distinct handlers for many individual exceptions, handle them all in one place with a single handler."_ (e.g., a web server dispatching different types of requests and catching all sorts of errors).
- _"In most applications there will be certain errors that are not worth trying to handle. Typically, these errors are difficult or impossible to handle and don't occur very often. The simplest thing to do in response to these errors is to print diagnostic information and then abort the application."_ (e.g., out-of-memory errors).

## Design it Twice

- _"The initial design experiments will probably result in a significantly better design, which will more than pay for the time spent designing it twice"_
- _"The process of devising and comparing multiple approaches will teach you about the factors that make designs better or worse. Over time, this will make it easier for you to rule out bad designs and hone in on really great ones."_

## Why Write Comments? The Four Excuses

- _Good code is self-documenting._ Comments serve as precisions on abstractions.
- _I don't have time to write comments._ The benefits of having documentation quickly offset the cost of writing it.
- _Comments get out of date and become misleading._ Keep the documentation close to where it needs to be, so you update it.
- _All the comments I have seen are worthless._ Be the change you want to see.
- Benefits of well-written comments
    - _"The overall idea behind comments is to capture information that was in the mind of the designer but couldn't be represented in the code."_
    - _"One of the purposes of comments is to make it it unnecessary to read the code."_

## Comments Should Describe Things that Aren't Obvious from the Code

- Don't repeat the code
- _"Lower-level comments add precision"_
    - Focus on what the variable represents, not how it is modified (the latter is explained by the code).
- _"Higher-level comments enhance intuition"_
    - _"What is the simplest thing you can say that explains everything in the code? What is the most important thing about this code?"_
- Interface documentation
- _"Implementation comments: what and why, not how"_
    - Describe at a more abstract level to help understand what is happening and why. The code tells the how.
- Cross-module design decisions
    - One possible solution is to use a `designNotes.md` file or similar to jot down all major decisions, and point to it from the code (e.g., _See `topic` in designNotes_).

## Choosing names

- Great names are _"precise, unambiguous, and intuitive."_
- Use names consistently: make it so that a concept is expressed in the same words regardless of the context in which it is found if it makes sense to do so.
- Avoid extra words: no more Hungarian Notation with modern IDEs.

## Use comments as part of the design process

- Delayed comments are bad comments
    - You won't remember exactly what you had in mind and why you did things if you delay writing documentation: design decisions will get lost.
- Write the comments first
    - No backlog of unwritten comments.
    - _"it produces better comments."_
- Comments are a design tool
    - Writing them at the beginning _"improves the system design."_
    - _"If a method or variable requires a long comment, it is a red flag that you don't have a good abstraction."_
- Early comments are fun comments
    - _"If you are programming strategically, where your main goal is a great design rather than just writing code that works, then writing comments should be fun, since that's how you identify the best designs."_
    - _"I'm looking for the design that can be expressed completely and clearly in the fewest words. The simpler the comments, the better I feel about my design."_
- Are early comments expensive?
    - _"Writing the comments first will mean that the abstractions will be more stable before you start writing code."_
    - _"In contrast, if you write the code first, the abstractions will probably evolve as you code, which will require more code revisions than the comments-first approach."_

## Modifying existing code

- _"Whenever you modify any code, try to find a way to improve the system design at least a little bit in the process. If you're not making the design better, you are probably making it worse."_
- Maintaining comments: keep the comments near the code
    - _"The farther a comment is from its associated code, the less likely it is that it will be updated properly."_
    - _"In general, the farther a comment is from the code it describes, the more abstract it should be (this reduces the likelihood that the comment will be invalidated by code changes)."_
- Comments belong in the code, not the commit log
    - _"An example is a commit message describing a subtle problem that motivated a code change. If this isn't documented in the code, then a developer might come along later and undo the change without realizing that they have re-created a bug."_
- Maintaining comments: avoid duplication
- Maintaining comments: check the diffs
    - Review changes during the pre-commit phase to make sure documentation stays up-to-date with the code changes.
- Higher-level comments are easier to maintain
    - Most helpful comments do not repeat the code, they provide an abstraction that can't be expressed easily by the code alone.

## Consistency

- Similar things are done in a similar way.
- _"Consistency creates cognitive leverage: once you have learned how something is done in one place, you can use that knowledge to immediately understand other places that use the same approach."_
- Ensuring consistency
    - Document most important conventions.
    - _"the value of consistency over inconsistency is almost always greater than the value of one approach over another."_

## Code should be obvious

- _"the best way to determine the obviousness of code is through code reviews"_
- _"If someone reading your code says it's not obvious, then it's not obvious, no matter how clear it may seem to you"_
- Things that make code more obvious
    - Good names
    - Consistency
    - Judicious use of white space
    - Blank lines
    - Comments
- Things that make code less obvious
    - Event-driven programming
    - Generic containers
    - Different types for declaration and allocation

## Software trends

- Object-oriented programming and inheritance
    - _"In order for an interface to have many implementations, it must capture the essential features of all the underlying implementations while steering clear of the details that differ between the implementations; this notion is at the heart of abstraction."_
    - _"Class hierarchies that use implementation inheritance extensively tend to have high complexity."_
    - _"Before using implementation inheritance, consider whether an approach based on composition can provide the same benefits."_
- Agile development
    - May encourage a more tactical approach to programming. Balance is required.
- Test-driven development
    - _"it focuses attention on getting specific features working, rather than finding the best design"_
    - _"One place where it makes sense to write the tests first is when fixing bugs. Before fixing a bug, write a unit test that fails because of the bug."_
- Design patterns
    - _"As with many ideas in software design, the notion that design patterns are good doesn’t necessarily mean that more design patterns are better."_
- Getters and setters
    - _"It’s better to avoid getters and setters (or any exposure of implementation data) as much as possible."_

## Designing for performance

- How to think about performance
    - _"The key is to develop an awareness of which operations are fundamentally expensive."_
- Measure before (and after) modifying
    - _"the goal is to identify a small number of very specific places where the system is currently spending a lot of time, and where you have ideas for improvement."_
    - _"If the changes didn’t make a measurable difference in performance, then back them out (unless they made the system simpler)."_
- Design around the critical path
    - _"When redesigning for performance, try to minimize the number of special cases you must check."_
- _"Complicated code tends to be slow because it does extraneous or redundant work."_

# Decide what matters

- Minimize what matters
- How to emphasize things that matter
    - _"important things should appear in places where they are more likely to be seen, such as interface documentation, names, or parameters to heavily used methods."_
    - _"repetition: key ideas appear over and over again."_
    - _"The things that matter the most should be at the heart of the system, where they determine the structure of things around them."_
- Mistakes
    - _"treat too many things as important. When this happens, unimportant things clutter up the design, adding complexity and increasing cognitive load."_
    - _"fail to recognize that something is important. This mistake leads to situations where important information is hidden, or important functionality is not available so developers must continually recreate it."_
- Thinking more broadly
    - _"the best way to make a document easy to read is to identify a few key concepts at the beginning and structure the remainder of the document around them. When discussing the details of a system, it helps to tie them back to the overall concepts."_
    - _"Focusing on what is important is also a great life philosophy: identify a few things that matter most to you, and try to spend as much of your energy as possible on those things."_

# Conclusion

- _"The reward for being a good designer is that you get to spend a larger fraction of your time in the design phase, which is fun. Poor designers spend most of their time chasing bugs in complicated and brittle code."_
