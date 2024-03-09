Title: Book summary: Dive into Design Patterns
Date: 2024-03-09 12:53
Tags: design-patterns, books, go, oop
Slug: book-summary-dive-into-design-patterns
Authors: Sébastien Lavoie
Summary: Dive into the essentials of software engineering with this excellent book by [Alexander Shvets](https://refactoring.guru). From the foundational _SOLID_ principles to _Creational_, _Structural_, and _Behavioral_ patterns, this book shines a light on the pathways to crafting robust, scalable, and maintainable software. It's ideal for both novice and seasoned developers, offering practical insights and examples to navigate the complexities of software design.

[TOC]

---

# Introduction

In the vast expanse of software engineering, design patterns and principles stand as lighthouses, guiding developers through the complex process of crafting robust, scalable, and maintainable software. Among these patterns, the Object-Oriented Programming (_OOP_) principles, Software Design Principles, and various design patterns provide a framework that seasoned and novice developers alike can leverage to solve common software design challenges. This article constitutes a book summary of [Dive into Design Patterns][dive] written by [Alexander Shvets][refactoring-guru]. Beautifully illustrated, it delves into the core aspects of OOP, explores essential software design principles, and unveils a catalog of design patterns categorized into _Creational_, _Structural_, and _Behavioral_ patterns. Here, each section is crafted to mimic the same structure as the book to offer a concise yet (hopefully) comprehensive overview, equipped with examples and analogies to illuminate these concepts further.

---

# A brief OOP overview

- Class attributes are called fields.
- Methods define the behavior of a class.
- Fields and methods are the members of their class.
- Objects are concrete instances of a class.
- Class hierarchies
    - `Parent = superclass` — inherit from parent.
- Abstraction: models the behaviors of a real-world object.
- Encapsulation
    - Hide parts of state and behaviors, interfacing with a simpler abstraction (e.g., starting a car engine doesn't require knowing anything about mechanics).
    - Private fields and methods are hidden outside of a class.
    - Protected fields and methods are also hidden outside of a class but accessible to subclasses.
- Interfaces look like classes with methods only.
- Inheritance (arrow with empty triangle head, going from subclass to parent class)
    - Build subclasses on top of superclasses.
    - Allows code reuse.
    - Subclasses automatically share the same interface as their parent class.
    - One class inherits interface and implementation of another and can extend it. It can be treated as the superclass and depends on it.
- Polymorphism
    - The real type of an object is not required to be known to use it (e.g., if a class inherits from Animal and implements an abstract method `makeSound`, then we can call `makeSound` on that class regardless of what type of animal this is).
- Relations between objects
    - Dependency (dashed lined with arrow)
    - Code that depends on interfaces or abstract classes lead to weaker dependency between classes.
    - One class can affect the code from another class.
    - Association (simple arrow pointing to the object being used, bi-direction allowed)
    - When an object uses or interacts with another.
    - One class knows about the other and uses it.
    - Aggregation (line with empty diamond at the con­tain­er end, an arrow at the end point­ing toward the component)
    - One object "has" a collection of others and serves as a container (e.g., a department has many professors).
    - One class is made of another one and depends on it.
    - The component can exist without the container.
    - Composition (drawn like an aggregation, filling in the diamond)
    - Specific kind of aggregation, where the component can only exist as part of the container.
    - Like aggregation, but the first class also manages the life cycle of the class it depends on.
    - Implementation
    - One class defines methods from an interface. The class can be treated as the interface and depends on it.

---

# Introduction to Design Patterns

- Design patterns are solutions to common problems.
- A pattern is a general concept for solving a particular problem.
- A pattern is more high-level than an algorithm.
- Architectural patterns are high-level. They are used to design the architecture of an entire application and can usually be implemented in any programming language.
- Creational patterns are a way to increase flexibility and code reuse with object creation mechanisms.
- Structural patterns are a way of assembling objects/classes into larger structures, keeping structures flexible and efficient.
- Behavioral patterns deal with effective communication and assignment of responsibilities between objects.

---

# Software Design Principles

Features of good software design include:

- Code reuse
- Extensibility

## Design Principles

- Encapsulate what varies.
    - Minimize the effect caused by changes.
- Program to an interface, not an implementation.
    - A design can be seen as flexible when it doesn't break if it can be extended without breaking existing code.
- Favor composition over inheritance.
    - Problems:
        - A subclass must implement all abstract methods from the superclass even if they're not used.
        - Behavior of overridden methods must remain compatible with the base class.
        - The superclass is not well encapsulated, because all subclasses are aware of its implementation details. Furthermore, if a subclass needs to be extended, the superclass might be modified to accommodate this need.
        - Changes in the superclass can break the subclasses, leading to tight coupling.
        - It can lead to the creation of many hierarchies of classes to combine them over multiple dimensions.
    - Inheritance represents the "is a" relationship, while composition represents a "has a" relationship.

## SOLID Principles

- **Single-responsibility principle**: _"a class should have just one reason to change"_.
- **Open-closed principle**: classes should be open for extension but closed for modification.
- **Liskov Sub­sti­tu­tion Prin­ci­ple**: when extending a class, you should be able to pass objects of the subclass in place of objects of the parent class without breaking the client code.
    - Para­me­ter types in a method of a sub­class should match or be more abstract than para­me­ter types in the method of the super­class.
    - The return type in a method of a sub­class should match or be a sub­type of the return type in the method of the super­class.
    - A method in a sub­class shouldn't throw types of exceptions which the base method isn't expect­ed to throw.
    - A sub­class shouldn't strength­en pre-conditions, e.g. if a parameter requires an `int`, the subclass shouldn't restrict the `int` to be positive.
    - A sub­class shouldn't weak­en post-conditions, e.g. if a database connection is expected to be closed in a class, don't leave it open in a subclass.
    - Invariants of a super­class must be pre­served. For this, it's safer to add fields to a class rather than modify existing ones.
    - A sub­class shouldn't change val­ues of private fields of the super­class, this is possible e.g. in Python or JavaScript where private members aren't even protected.
- **Interface Segregation Principle**
    - Clients shouldn't be forced to depend on meth­ods they do not use, trim the fat off of big interfaces.
- **Dependency Inversion Principle**
    - High-level class­es shouldn't depend on low-level class­es. Both should depend on abstractions. Abstractions shouldn't depend on details. Details should depend on abstractions.

---

# Catalog of Design Patterns

## Creational Design Patterns

These patterns deal with object creation mechanisms, trying to create objects in a manner suitable to the situation.

### Factory Method (virtual constructor)

- Analogy
    - The hiring process (factory method) of a company (client) may differ for each department (concrete creator), which will hire employees (products of the concrete creator).
- When to use it
    - _"[...] you don't know before­hand the exact types and dependencies of the objects your code should work with"_.
    - To pro­vide users of your library or frame­work with a way to extend its inter­nal components.
    - To save sys­tem resources by reusing exist­ing objects instead of rebuild­ing them each time.
- Implementation
    - Define an interface that all products will implement.
    - Add a factory method to the creator class.
    - In the creator's code, replace direct calls to product constructors with calls to the factory method.
    - The factory method might need a parameter to decide which product type to create.
    - Initially, the factory method might have a switch or similar logic to decide which product to instantiate.
    - Create subclasses of the creator for each product type, overriding the factory method to handle specific product creation.
    - Either create more subclasses or use a parameter in the factory method to specify the product type if there are many product types.
- Pros
    - No tight coupling between the creator and the concrete products.
    - **Single Responsibility Principle**: the creator is responsible for creating products, and the products are responsible for their own creation.
    - **Open/Closed Principle**: you can introduce new product types without changing the existing code.
- Cons
    - The code might become more complicated than it should be.
- Relation to other patterns
    - **Abstract Factory** is a more complex version of **Factory Method**.
    - **Factory Method** is a specialization of **Template Method**.
    - **Prototype** doesn't require subclassing, but it's not always possible to use it with a **Factory Method**.

```go
package main

import "fmt"

// Vehicle is the product
type Vehicle interface {
 Brake() string
 Drive() string
}

// VehicleFactory is the abstract factory
type VehicleFactory interface {
 CreateVehicle(vehicleType string) Vehicle
}

// CheapVehicleFactory is a concrete factory producing cheap stuff
type CheapVehicleFactory struct{}

func (f *CheapVehicleFactory) CreateVehicle(vehicleType string) Vehicle {
 switch vehicleType {
 case "Car":
  return &CheapCar{}
 case "Bike":
  return &CheapBike{}
 default:
  return nil
 }
}

// NiceVehicleFactory is a concrete factory producing nice stuff
type NiceVehicleFactory struct{}

func (f *NiceVehicleFactory) CreateVehicle(vehicleType string) Vehicle {
 switch vehicleType {
 case "Car":
  return &NiceCar{}
 case "Bike":
  return &NiceBike{}
 default:
  return nil
 }
}

// CheapCar is a concrete product implementing the Vehicle interface that's not so reliable
type CheapCar struct{}

// NiceCar is a concrete product implementing the Vehicle interface that's more likely to work
type NiceCar struct{}

// CheapBike is what it is
type CheapBike struct{}

// NiceBike is nice
type NiceBike struct{}

func (c *CheapCar) Brake() string {
 return "Squeeeeeeeak..."
}

func (c *NiceCar) Brake() string {
 return "Shhh."
}

func (c *CheapCar) Drive() string {
 return "Vroom poof poof vroom poof poof vroom"
}

func (c *NiceCar) Drive() string {
 return "VROOOOOM"
}

func (b *CheapBike) Brake() string {
 return "iiiiiiiiik"
}

func (b *NiceBike) Brake() string {
 return "(silence)"
}

func (b *CheapBike) Drive() string {
 return "kwik kwik kwik"
}

func (b *NiceBike) Drive() string {
 return "(silence)"
}

func produceVehicles(factory VehicleFactory) {
 car := factory.CreateVehicle("Car")
 fmt.Println("Car:")
 fmt.Println("drive:", car.Drive())
 fmt.Println("stop: ", car.Brake())

 bike := factory.CreateVehicle("Bike")
 fmt.Println("Bike:")
 fmt.Println("ride: ", bike.Drive())
 fmt.Println("brake:", bike.Brake())
}

func main() {
 momsGarage := &CheapVehicleFactory{}
 uncleBobsMansion := &NiceVehicleFactory{}

 fmt.Println("Cheap Vehicles\n-----------------")
 produceVehicles(momsGarage)

 fmt.Println("\nNice Vehicles\n---------------")
 produceVehicles(uncleBobsMansion)

 // Output:
 /*
   Cheap Vehicles
   -----------------
   Car:
   drive: Vroom poof poof vroom poof poof vroom
   stop:  Squeeeeeeeak...
   Bike:
   ride:  kwik kwik kwik
   brake: iiiiiiiiik

   Nice Vehicles
   ---------------
   Car:
   drive: VROOOOOM
   stop:  Shhh.
   Bike:
   ride:  (silence)
   brake: (silence)
 */
}
```

### Abstract Factory

- Analogy
    - A car manufacturing company has different (abstract) factories in different parts of the world to produce vehicle whose requirements are adapted to the local needs.
- When to use it
    - It can create families of related or dependent objects without the need to specify their concrete classes.
    - It makes the system independent from how the objects are created.
    - It can be used where the set of objects may change dynamically while keeping the same functionality.
- Implementation
    - Define the abstract factory interface.
    - Create concrete factory classes.
    - Define the product interfaces.
    - Create concrete product classes.
    - Use the factory.
- Pros
    - Isolation from concrete classes.
    - Can swap product families.
    - Makes products consistent.
- Cons
    - More complex than the **Factory Method** pattern.
    - More difficult to extend, having the need to change many interfaces.
    - Works best with sets of families that don't change too much or too often.
- Relation to other patterns
    - It can use the **Factory Method** to create the products.
    - **Builder** allows constructing more complex objects one step at a time.
    - **Prototype** can be used when creating products by cloning prototypes.

```go
package main

import "fmt"

// Product interfaces
type Car interface {
 Drive() string
}
type Bicycle interface {
 Ride() string
}

// Concrete products
type MercedesCar struct{}
type BMWCar struct{}
type CannondaleBicycle struct{}
type SpecializedBicycle struct{}

func (t *MercedesCar) Drive() string {
 return "Driving Mercedes"
}
func (t *BMWCar) Drive() string {
 return "Driving BMW"
}
func (t *CannondaleBicycle) Ride() string {
 return "Riding Cannondale"
}
func (t *SpecializedBicycle) Ride() string {
 return "Riding Specialized"
}

// Abstract factory
type VehicleFactory interface {
 CreateCar() Car
 CreateBicycle() Bicycle
}

// Concrete factories
type MercedesFactory struct{}
type BMWFactory struct{}
type SpecializedFactory struct{}

func (t *MercedesFactory) CreateCar() Car {
 return &MercedesCar{}
}

// Let's assume Mercedes make Cannondale bicycles
func (t *MercedesFactory) CreateBicycle() Bicycle {
 return &CannondaleBicycle{}
}

func (t *BMWFactory) CreateCar() Car {
 return &BMWCar{}
}

// Let's assume BMW also makes Specialized bicycles
func (t *BMWFactory) CreateBicycle() Bicycle {
 return &SpecializedBicycle{}
}

// Let's assume Specialized makes its own bicycles
func (t *SpecializedFactory) CreateBicycle() Bicycle {
 return &SpecializedBicycle{}
}

func produceVehicles(factory VehicleFactory) {
 car := factory.CreateCar()
 fmt.Println(car.Drive())

 bicycle := factory.CreateBicycle()
 fmt.Println(bicycle.Ride())
}

func main() {
 mercedesFactory := &MercedesFactory{}
 bmwFactory := &BMWFactory{}

 fmt.Println("Mercedes vehicles:")
 produceVehicles(mercedesFactory)

 fmt.Println("\nBMW vehicles:")
 produceVehicles(bmwFactory)

 // This doesn't work because SpecializedFactory doesn't implement CreateCar()
 // produceVehicles(&SpecializedFactory{})

 // Output:
 /*
  Mercedes vehicles:
  Driving Mercedes
  Riding Cannondale

  BMW vehicles:
  Driving BMW
  Riding Specialized
 */
}
```

### Builder

- Analogy
    - There are many ways to build a house, so it may be simpler and will be more flexible piecing the different requirements together rather than trying to find a pre-made house tailored to one's needs.
- When to use it
    - When there's a need for complex objects that can be built step by step (e.g., a text-to-speech [TTS] service may have dozens of options to set the pitch, speed, volume gain, etc. but many settings can be left at their default value).
    - This pattern also works well when there are many optional components. In a TTS service, this could mean hooking up the result to post-process the audio, perform a TTS on multiple services at once, etc.
- Implementation
    - Define a Product class, which must have the common construction steps among all available products.
    - There must be a Builder interface to define the methods used to construct the objects.
    - Concrete builders are needed to implement the Builder interface in different ways (e.g., a wall builder for a wooden cabin vs. a brick house).
    - There can be an optional Director class, which makes it easier to use to builders (e.g., for houses, there could be a MakeCabin method to call the appropriate builders in order to get the expected result, which is done in a single call to the Director instead of possibly chaining many invocations of a concrete builder).
    - To use it, the client creates a Builder, passes the Builder to the Director to construct the product and the product is obtained from the Builder (e.g., Builder.getResult).
- Pros
    - It is flexible.
    - It is reusable.
    - It encapsulates complex construction logic inside the Builder.
- Cons
    - For simpler objects, it can make the code unnecessarily convoluted.
    - Can be a bit painful to work with if many different products need to be created and used all at once.
- Relation to other patterns
    - **Factory Method** and **Abstract Factory** are simpler and create objects in a single step. The **Builder** is more complex but allows more control over the construction process.
    - While **Builder** builds a complex object one step at a time, **Prototype** clones objects.

```go
package main

import "fmt"

// Candy is the Product
type Candy struct {
 Sugar     int
 Flavor    string
 Color     string
 Packaging string
}

// CandyBuilder is the abstract Builder interface
type CandyBuilder interface {
 SetSugar(sugar int) CandyBuilder
 SetFlavor(flavor string) CandyBuilder
 SetColor(color string) CandyBuilder
 SetPackaging(packaging string) CandyBuilder
 Build() Candy
}

// SimpleCandyBuilder is a Concrete Builder
type SimpleCandyBuilder struct {
 candy Candy
}

func NewSimpleCandyBuilder() *SimpleCandyBuilder {
 return &SimpleCandyBuilder{candy: Candy{}}
}

func (b *SimpleCandyBuilder) SetSugar(sugar int) CandyBuilder {
 b.candy.Sugar = sugar
 return b
}

func (b *SimpleCandyBuilder) SetFlavor(flavor string) CandyBuilder {
 b.candy.Flavor = flavor
 return b
}

func (b *SimpleCandyBuilder) SetColor(color string) CandyBuilder {
 b.candy.Color = color
 return b
}

func (b *SimpleCandyBuilder) SetPackaging(packaging string) CandyBuilder {
 b.candy.Packaging = packaging
 return b
}

func (b *SimpleCandyBuilder) Build() Candy {
 return b.candy
}

type CandyDirector struct {
 builder CandyBuilder
}

func NewCandyDirector(builder CandyBuilder) *CandyDirector {
 return &CandyDirector{
  builder: builder,
 }
}

// ConstructPeppermintCandy creates a peppermint candy with green packaging.
func (d *CandyDirector) ConstructPeppermintCandy() Candy {
 return d.builder.SetSugar(10).
  SetFlavor("Peppermint").
  SetColor("White").
  SetPackaging("Green").
  Build()
}

// ConstructCaramelCandy creates a caramel candy with yellow packaging.
func (d *CandyDirector) ConstructCaramelCandy() Candy {
 return d.builder.SetSugar(15).
  SetFlavor("Caramel").
  SetColor("Brown").
  SetPackaging("Yellow").
  Build()
}

func main() {
 builder := NewSimpleCandyBuilder()
 director := NewCandyDirector(builder)

 peppermintCandy := director.ConstructPeppermintCandy()
 fmt.Printf("Peppermint Candy: %+v\n", peppermintCandy)

 caramelCandy := director.ConstructCaramelCandy()
 fmt.Printf("Caramel Candy: %+v\n", caramelCandy)

 // Output:
 // Peppermint Candy: {Sugar:10 Flavor:Peppermint Color:White Packaging:Green}
 // Caramel Candy: {Sugar:15 Flavor:Caramel Color:Brown Packaging:Yellow}
}
```

### Prototype (clone)

- Analogy
    - Copying genetic information from one cell to another is very complex, while mitotic cell division is efficient and effective.
- When to use it
    - To create new objects by copying an existing object (the prototype).
    - New instantiation of a complex object may be inconvenient.
- Implementation
    - Define an interface with a clone method.
    - Implement the prototype interface in classes that need to be cloned.
    - Use the clone method to create new objects.
- Pros
    - Cloning can be more efficient than creating new instances, especially if instantiation is resource-intensive.
    - Cloning allows for dynamic creation and composition of instances at runtime, which brings greater flexibility.
    - Prototypes can be managed and modified at runtime, which makes them dynamic.
- Cons
    - Deep cloning complex objects with intricate references can be challenging.
    - It's not always clear how cloning should behave for each object, especially in complex class hierarchies.
    - Cloning can lead to unexpected issues, such as shared references, if not handled correctly.
- Relation to other patterns
    - **Factory Method** uses a single method to create new objects, **Prototype** does it through cloning.
    - **Abstract Factory** and **Builder** can be combined with **Prototype** when complex objects are required to be built or cloned.
    - Prototypes are often at odds with **Singletons**, as the **Prototype** pattern involves creating new object instances.

```go
package main

import "fmt"

// Animal is the prototype interface that all animals must implement
type Animal interface {
 Clone() Animal
 GetInfo() string
}

// Sheep is a concrete prototype that implements the Animal interface
type Sheep struct {
 Name string
 Age  int
}

// Clone creates a new Sheep instance with the same data
func (s *Sheep) Clone() Animal {
 // Create a new Sheep instance with the same data
 return &Sheep{Name: s.Name, Age: s.Age}
}

// GetInfo returns the sheep's name and age
func (s *Sheep) GetInfo() string {
 return fmt.Sprintf("Sheep Name: %s, Age: %d", s.Name, s.Age)
}

// Dog is another concrete prototype that implements the Animal interface
type Dog struct {
 Name  string
 Breed string
}

// Clone creates a new Dog instance with the same data
func (d *Dog) Clone() Animal {
 return &Dog{Name: d.Name, Breed: d.Breed}
}

// GetInfo returns the dog's name and breed
func (d *Dog) GetInfo() string {
 return fmt.Sprintf("Dog Name: %s, Breed: %s", d.Name, d.Breed)
}

type PrototypeRegistry struct {
 items map[string]Animal
}

func NewPrototypeRegistry() *PrototypeRegistry {
 return &PrototypeRegistry{items: make(map[string]Animal)}
}

func (r *PrototypeRegistry) Register(name string, animal Animal) {
 r.items[name] = animal
}

func (r *PrototypeRegistry) Clone(name string) (Animal, error) {
 if animal, exists := r.items[name]; exists {
  return animal.Clone(), nil
 }
 return nil, fmt.Errorf("prototype not found: %s", name)
}

func main() {
 registry := NewPrototypeRegistry()
 registry.Register("sheep", &Sheep{Name: "Dolly", Age: 4})
 registry.Register("dog", &Dog{Name: "Fido", Breed: "Bulldog"})

 clonedAnimal, err := registry.Clone("sheep")
 if err != nil {
  fmt.Println("Error cloning sheep:", err)
  return
 }

 clonedSheep, ok := clonedAnimal.(*Sheep)
 if !ok {
  fmt.Println("Type assertion failed: not a *Sheep")
  return
 }
 clonedSheep.Name = "Molly"
 fmt.Println(clonedSheep.GetInfo())

 clonedAnimal2, err := registry.Clone("dog")
 if err != nil {
  fmt.Println("Error cloning dog:", err)
  return
 }

 clonedDog, ok := clonedAnimal2.(*Dog)
 if !ok {
  fmt.Println("Type assertion failed: not a *Dog")
  return
 }
 clonedDog.Name = "Rex"
 fmt.Println(clonedDog.GetInfo())

 // Output:
 /*
  Sheep Name: Molly, Age: 4
  Dog Name: Rex, Breed: Bulldog
 */
}
```

### Singleton

- Analogy
    - The government of a country is (ideally...) a singleton. There is a single group recognized to act as the Government class.
- When to use it
    - It does two things (not a single responsibility...):
        - It ensures that a class has only one instance;
        - It provides a global point of access to that instance.
    - It is often used to manage shared resources, such as a database connection.
- Implementation
    - A private variable in the package holds the instance.
    - Ensure safe access in concurrent environments (e.g., using `sync.Once`).
    - A public function provides global access to the instance.
- Pros
    - Provides controlled access to a unique instance.
    - Instance is created only when needed (lazy Initialization).
    - Easily accessible throughout the application (global access).
- Cons
    - It can introduce a global state in the application, which is generally discouraged in software design.
    - Singleton can make unit testing tricky due to its global state.
    - It needs careful handling in a concurrent environment to avoid multiple instantiations.
- Relation to other patterns
    - **Singleton** can be combined with **Factory Method**. The factory method ensures that a single instance is created and returned.
    - **Abstract Factory**, **Builder**, **Prototype**: these patterns are about creating complex objects, which is a different focus from **Singleton**'s objective of a single instance.

```go
package main

import (
 "fmt"
 "sync"
)

type ConfigurationData struct {
 DatabaseURL string
}

// ConfigurationManager is a singleton that holds the configuration for the application.
type ConfigurationManager struct {
 config *ConfigurationData
}

var (
 instance *ConfigurationManager
 once     sync.Once
)

// GetInstance returns the singleton instance of the ConfigurationManager.
func GetInstance() *ConfigurationManager {
 once.Do(func() {
  instance = &ConfigurationManager{
   config: &ConfigurationData{
    DatabaseURL: "localhost:4321", // Default value
   },
  }
 })
 return instance
}

// UpdateConfig updates configuration if needed
func (m *ConfigurationManager) UpdateConfig(newConfig *ConfigurationData) {
 m.config = newConfig
}

func main() {
 config1 := GetInstance()
 config2 := GetInstance()

 fmt.Println(config1 == config2) // true
}
```

---

## Structural Design Patterns

These patterns focus on ways to compose objects to form larger structures efficiently and flexibly.

### Adapter

- Analogy
    - An adapter may be needed when traveling abroad to charge devices. While it doesn't change the device's functionality, it allows it to work in situations where it would normally be incompatible.
- When to use it
    - To allow two incompatible interfaces to work together.
    - Use an existing class that has an incompatible interface with the rest of the code.
- Implementation
    - Implement a client interface.
    - An adaptee is a class with an incompatible interface (the one that gets adapted).
    - An adapter is a class that implements the client interface, translating calls to the adaptee's interface (the one that adapts the incompatible code).
- Pros
    - Allows otherwise incompatible interfaces to work together.
    - Enables the reuse of existing classes without altering their code.
    - Introduces only a small amount of extra code to bridge the compatibility gap.
- Cons
    - Can add complexity to the code, especially if there are many adaptions.
    - The adapter pattern involves an extra layer of abstraction, which can complicate the code and increase overhead.
- Relation to other patterns
    - While **Adapter** is used to change an interface, **Decorator** is used to add responsibilities to objects without modifying their interface.
    - The **Bridge** pattern separates an object's interface from its implementation so the two can vary independently. **Adapter** is meant to change the interface of an existing object.
    - A **Façade** provides a simplified interface to a complex subsystem, not necessarily designed for incompatible interfaces, unlike **Adapter**.

```go
package main

import "fmt"

type Outlet interface {
 InsertInOutlet() string
}

type Pluggable interface {
 InsertInUSOutlet() string
}

type USPlug struct{}

type USPlugAdapter struct {
 usPlug Pluggable
}

func (plug *USPlug) InsertInUSOutlet() string {
 return "Inserted in US Outlet"
}

func NewUSPlugAdapter(usPlug Pluggable) *USPlugAdapter {
 return &USPlugAdapter{usPlug: usPlug}
}

func (adapter *USPlugAdapter) InsertInOutlet() string {
 return adapter.usPlug.InsertInUSOutlet() + ", adapted to fit an Outlet"
}

func ChargeDevice(outlet Outlet) string {
 return outlet.InsertInOutlet()
}

func main() {
 usPlug := &USPlug{}
 adaptedPlug := NewUSPlugAdapter(usPlug)

 result := ChargeDevice(adaptedPlug)
 fmt.Println(result) // Inserted in US Outlet, adapted to fit an Outlet
}
```

### Bridge

- Analogy
    - A universal remote control bridges the functionality gap between different devices (e.g., it can turn up or down the volume on all devices) with a common interface.
- When to use it
    - Use it to separate the abstraction (high-level logic) from the implementation (low-level logic), allowing them to be developed independently.
    - When you want to avoid a permanent binding between the abstraction and its implementation, particularly when they both may vary frequently.
- Implementation
    - The abstraction interface/class is a higher-level control layer that delegates the work to the implementation layer.
    - The implementor interface defines the interface for the implementation classes.
    - Concrete implementations are classes that provide specific implementations of the implementor interface.
    - An optional refined abstraction can be used to extend the abstraction to provide more control.
- Pros
    - Abstractions and implementations can be extended independently.
    - Separates high-level and low-level logic into different classes.
    - The abstraction and its implementation can be developed and maintained separately.
- Cons
    - Can increase complexity due to the introduction of additional layers.
    - More effort is needed to set up the structure, which might not be necessary for simpler cases.
- Relation to other patterns
    - The **Bridge** pattern is often compared to the **Adapter** pattern. **Bridge** is designed to separate an interface from its implementation, while **Adapter** is meant to make unrelated classes work together.
    - **Bridge** is often used in a similar way to **Strategy**. **Strategy** typically encapsulates algorithms: **Bridge** separates an interface from its implementation.
    - **Abstract Factory** can work with **Bridge** as it can create instances of different classes that implement the abstract interface.
    - **Builder** can be combined with **Bridge**: builders are the implementations and the director is the abstraction.

```go
package main

import "fmt"

// The Device interface (the abstraction) defines the operations that all
// concrete device implementations must support.
type Device interface {
 TurnOn()
 TurnOff()
 IsEnabled() bool
 SetVolume(volume int)
 GetVolume() int
}

// TV and Radio are concrete implementations of the Device interface.
type TV struct {
 isEnabled bool
}

func (t *TV) TurnOn() {
 t.isEnabled = true
}

func (t *TV) TurnOff() {
 t.isEnabled = false
}

func (t *TV) IsEnabled() bool {
 return t.isEnabled
}

// SetVolume for TV
func (t *TV) SetVolume(volume int) {
 fmt.Printf("TV volume set to %d\n", volume)
}

// GetVolume for TV
func (t *TV) GetVolume() int {
 return 50 // Placeholder
}

type Radio struct {
 isEnabled bool
}

func (r *Radio) TurnOn() {
 r.isEnabled = true
}

func (r *Radio) TurnOff() {
 r.isEnabled = false
}

func (r *Radio) IsEnabled() bool {
 return r.isEnabled
}

// SetVolume for Radio
func (r *Radio) SetVolume(volume int) {
 fmt.Printf("🔉 Radio volume set to %d\n", volume)
}

// GetVolume for Radio
func (r *Radio) GetVolume() int {
 return 30 // Placeholder
}

type RemoteControl struct {
 device Device
 name   string
}

func NewRemoteControl(device Device, name string) *RemoteControl {
 fmt.Println("NewRemoteControl", name)
 return &RemoteControl{device: device, name: name}
}

func (r *RemoteControl) TogglePower() {
 if r.device.IsEnabled() {
  fmt.Println(r.name, "🔴 turning off")
  r.device.TurnOff()
 } else {
  fmt.Println(r.name, "🟢 turning on")
  r.device.TurnOn()
 }
}

type AdvancedRemoteControl struct {
 *RemoteControl // Embedding RemoteControl to inherit its methods
}

func NewAdvancedRemoteControl(device Device, name string) *AdvancedRemoteControl {
 return &AdvancedRemoteControl{RemoteControl: NewRemoteControl(device, name)}
}

func (a *AdvancedRemoteControl) SetDeviceVolume(volume int) {
 a.device.SetVolume(volume)
}

func NewTV() *TV {
 return &TV{isEnabled: false}
}

func NewRadio() *Radio {
 return &Radio{isEnabled: false}
}

func main() {
 // TV without advanced remote
 tv := NewTV()
 remote := NewRemoteControl(tv, "Samsung TV")
 remote.TogglePower() // Turns TV on
 remote.TogglePower() // Turns TV off

 // Radio with advanced remote
 radio := NewRadio()
 radioRemote := NewAdvancedRemoteControl(radio, "Sony Radio")
 radioRemote.TogglePower()
 radioRemote.SetDeviceVolume(30)
 radioRemote.TogglePower()

 // Output:
 /*
  NewRemoteControl Samsung TV
  Samsung TV turning on
  Samsung TV turning off
  NewRemoteControl Sony Radio
  Sony Radio turning on
  Radio volume set to 30
  Sony Radio set volume to 30
  Sony Radio turning off
 */
}
```

### Composite (object tree)

- Analogy
    - The military is a tree structure where orders come from the top, are passed down the divisions, brigades and so on where the leaves are the actual soldiers.
- When to use it
    - When you want to work with a tree structure and have to perform operations on both individual elements and groups of elements in the same way.
- Implementation
    - There is a component interface for individual objects and their compositions which defines operations that can be performed on both.
    - A leaf represents individual objects in the structure.
    - A composite represents a composite of objects (a group of `Leaf` objects) and implements the component interface.
- Pros
    - Makes it easier to work with complex tree structures by allowing you to treat individual objects and compositions uniformly.
    - Can add and remove new types of components without changing existing code.
    - Client code can treat composite structures and individual objects uniformly.
- Cons
    - Components that do not have much in common end up being overgeneralized.
    - The implementation can become overly complex if the hierarchy gets too deep or if extensive functionality is required.
- Relation to other patterns
    - **Builder** can be used with **Composite** because its construction steps can be recursive.
    - **Chain of Responsibility** passes a request along a chain of objects until one of them handles it, **Composite** arranges objects in a tree structure and works with these structures collectively.
    - **Iterators** can be used to traverse a **Composite** tree.
    - **Visitor** can be used to execute an operation on a whole tree.
    - Shared leaves from the **Composite** tree can be implemented with **Flyweights** to reduce RAM usage.
    - **Decorator** only has one component and augments it by wrapping it with new functionality while **Composite** just runs the logic on all child components.

```go
package main

import (
 "fmt"
 "strings"
)

// Command is the component interface that all commands must implement.
type Command interface {
 Execute()
 Undo()
}

type Document struct {
 content string
}

// WriteCommand is a leaf that implements the Command component interface.
type WriteCommand struct {
 document *Document
 addition string
}

// SaveCommand is another leaf.
type SaveCommand struct {
 document *Document
}

func (w *WriteCommand) Execute() {
 w.document.content += w.addition
 fmt.Printf("Document after writing: %s\n", w.document.content)
}

func (w *WriteCommand) Undo() {
 fmt.Printf("Undo writing: %s\n", w.addition)
 w.document.content = strings.TrimSuffix(w.document.content, w.addition)
}

func (s *SaveCommand) Execute() {
 fmt.Printf("Document saved: %s\n", s.document.content)
}

func (s *SaveCommand) Undo() {
 fmt.Println("Restore to the last saved point...")
}

type CommandManager struct {
 history []Command
}

func (m *CommandManager) ExecuteCommand(cmd Command) {
 cmd.Execute()
 m.history = append(m.history, cmd)
}

func (m *CommandManager) Undo() {
 if len(m.history) == 0 {
  return
 }
 cmd := m.history[len(m.history)-1]
 cmd.Undo()
 m.history = m.history[:len(m.history)-1]
}

// CompositeCommand is a composite that implements the Command component interface.
type CompositeCommand struct {
 commands []Command
}

func (c *CompositeCommand) Execute() {
 for _, cmd := range c.commands {
  cmd.Execute()
 }
}

func (c *CompositeCommand) Undo() {
 for i := len(c.commands) - 1; i >= 0; i-- {
  c.commands[i].Undo()
 }
}

func (c *CompositeCommand) AddCommand(cmd Command) {
 c.commands = append(c.commands, cmd)
}

func main() {
 doc := &Document{}
 write1 := &WriteCommand{document: doc, addition: "Hello "}
 write2 := &WriteCommand{document: doc, addition: "World"}
 save := &SaveCommand{document: doc}

 compositeCommand := &CompositeCommand{}
 compositeCommand.AddCommand(write1)
 compositeCommand.AddCommand(write2)
 compositeCommand.AddCommand(save)

 commandManager := &CommandManager{}
 commandManager.ExecuteCommand(compositeCommand)

 fmt.Println("\nUndoing Composite Command:")
 commandManager.Undo()

 fmt.Printf("\nFinal Document Content: %s\n", doc.content)

 // Output:
 /*
  Document after writing: Hello
  Document after writing: Hello World
  Document saved: Hello World

  Undoing Composite Command:
  Restore to the last saved point...
  Undo writing: World
  Undo writing: Hello

  Final Document Content:
 */
}
```

### Decorator (wrapper)

- Analogy
    - Wearing layers of clothes: without clothes, it's cold; with a jacket, it's warmer; with a raincoat on top, it's warmer and dryer. The same person is "decorated" to be comfortable under different circumstances.
- When to use it
    - Used to add new functionality to an object dynamically, without altering its structure.
    - Allows for extending an object's behavior by wrapping it with additional functionality.
- Implementation
    - The Component interface defines the interface for objects that can have responsibilities added to them dynamically (e.g., a file with `read()` and `write()` methods).
    - The Concrete component is an object to which additional responsibilities can be attached (e.g., a file with `write()` could first be compressed or encrypted).
    - Decorator classes are wrappers that add responsibilities to the component. They implement the same interface as the component they decorate (e.g., taking the `File` object, there could be EncryptionDecorator and CompressionDecorator).
- Pros
    - Provides a flexible alternative to subclassing for extending functionality.
    - Responsibilities can be added and removed at runtime.
    - Allows for the combination of behaviors by stacking decorators on top of each other.
- Cons
    - Can lead to complex code structures and debugging difficulties, especially with multiple layers of decorators (order matters!).
    - Creating an object decorated with multiple layers can require more complex setup code.
- Relation to other patterns
    - Unlike **Adapter**, which changes the behavior of an incompatible class to work with another class, **Decorator** doesn't modify the original object and stacks functionality on top of it. **Decorator** can work recursively, while an **Adapter** can't.
    - **Adapter** leads to a wrapped object with a different interface. Proxy maintains the same interface. **Decorator** enhances it.
    - **Decorator** is similar to **Chain of Responsibility**. But **Decorator** maintains consistency throughout the request, while a chain can stop at any point and handle multiple independent operations at once.
    - A **Decorator** is like a **Composite** but with a single component. **Composite** also doesn't add functionality. Prototype can be useful with these two patterns.
    - **Decorator** lets one change the surface level of an object. **Strategy** lets one change to an entirely different object.

```go
package main

import "fmt"

// Component is the common interface for both the concrete component and the
// decorators. It can have multiple layers of decorators.
type Component interface {
 Operation() string
}

// ConcreteComponent is a concrete component that implements the Component
// interface, defining all the operations that can be altered by decorators.
type ConcreteComponent struct{}

func (c *ConcreteComponent) Operation() string {
 return "ConcreteComponent"
}

// Decorator is a base decorator class. It implements the Component interface
// and has a field for storing a reference to a wrapped object. The default
// implementation of the wrapped object does the actual work, while the
// decorator merely delegates to the wrapped object.
type Decorator struct {
 component Component
}

// Operation Decorator delegates all work to the wrapped component.
func (d *Decorator) Operation() string {
 return d.component.Operation()
}

// ConcreteDecoratorA calls the wrapped object and alter its result in some way.
type ConcreteDecoratorA struct {
 Decorator
}

// Operation Decorators may call parent implementation of the operation, instead of
// calling the wrapped object directly, simplifying extension of decorator classes.
func (d *ConcreteDecoratorA) Operation() string {
 return "ConcreteDecoratorA(" + d.Decorator.Operation() + " + AddedBehaviorA)"
}

func NewConcreteDecoratorA(component Component) *ConcreteDecoratorA {
 return &ConcreteDecoratorA{Decorator{component: component}}
}

type ConcreteDecoratorB struct {
 Decorator
}

func (d *ConcreteDecoratorB) Operation() string {
 pre := "PreBehaviorB | "
 base := d.Decorator.Operation() // Delegate to base Operation
 post := " | PostBehaviorB"
 return pre + "ConcreteDecoratorB(" + base + ")" + post
}

func NewConcreteDecoratorB(component Component) *ConcreteDecoratorB {
 return &ConcreteDecoratorB{Decorator{component: component}}
}

func main() {
 var decoratedComponent Component = &ConcreteComponent{}

 decoratedComponent = NewConcreteDecoratorA(decoratedComponent)
 decoratedComponent = NewConcreteDecoratorB(decoratedComponent)

 fmt.Println(decoratedComponent.Operation())
 // Output:
 // PreBehaviorB | ConcreteDecoratorB(ConcreteDecoratorA(ConcreteComponent + AddedBehaviorA)) | PostBehaviorB
}
```

### Facade

- Analogy
    - Placing an order by phone is easy (call and get it delivered), but a bunch of operations must happen in the background (warehouse, packaging, suppliers, etc.), which the client has no direct knowledge of.
- When to use it
    - To provide a simplified interface to a complex subsystem. It doesn't encapsulate the subsystem but offers an easier or more coherent interface for clients to interact with.
    - Useful when dealing with a large body of code, such as a library or a framework.
- Implementation
    - A Facade interface defines an interface that abstracts the complex functionalities of the subsystem.
    - Subsystem classes are the complex parts of the subsystem that the facade will simplify.
    - A Facade class implements the facade interface and interacts with the subsystem classes on behalf of the client.
- Pros
    - Simplifies the interface for complex subsystems, making them easier to use.
    - Clients are isolated from the complexities of the subsystem, reducing dependencies and making the system easier to use and maintain.
    - Clients can work with a single unified interface instead of a set of complex and potentially confusing interfaces.
- Cons
    - The facade might limit access to certain features of the subsystem that advanced users might need.
    - If not designed carefully, the facade can end up doing too much, becoming overly complex (a "God Object").
- Relation to other patterns
    - The **Adapter** pattern changes the interface of an existing object; the **Facade** provides a simplified interface to a complex subsystem. The **Facade** doesn't wrap the subsystem to change its interface but provides a simpler one.
    - The **Facade** simplifies access to a complex system; the **Decorator** adds behavior to objects. They are both used to simplify client interactions but achieve this in different ways.
    - Often, a **Facade** is implemented as a **Singleton** because usually one facade object is enough to manage the underlying systems.
    - **Abstract Fac­to­ry** can be an alternative when the main goal is to hide the way the sub­sys­tem objects are cre­at­ed in the client code.
    - **Facade** makes a single object to represent a whole system while **Flyweight** makes lots of little objects.

```go
package main

// Example of a facade pattern

import (
 "fmt"
 "strings"
)

// TV is subsystem 1
type TV struct {
 isOn bool
}

func (t *TV) TurnOn() (string, error) {
 if t.isOn {
  return "", fmt.Errorf("❌ TV is already on")
 }
 t.isOn = true
 return "TV is on", nil
}

func (t *TV) TurnOff() (string, error) {
 if !t.isOn {
  return "", fmt.Errorf("❌ TV is already off")
 }
 t.isOn = false
 return "TV is off", nil
}

// SoundSystem is subsystem 2
type SoundSystem struct {
 isOn bool
}

func (s *SoundSystem) TurnOn() (string, error) {
 if s.isOn {
  return "", fmt.Errorf("❌ SoundSystem is already on")
 }
 s.isOn = true
 return "SoundSystem is on", nil
}

func (s *SoundSystem) TurnOff() (string, error) {
 if !s.isOn {
  return "", fmt.Errorf("❌ SoundSystem is already off")
 }
 s.isOn = false
 return "SoundSystem is off", nil
}

// DVDPlayer is subsystem 3
type DVDPlayer struct {
 isOn bool
}

func (d *DVDPlayer) Play() (string, error) {
 if d.isOn {
  return "", fmt.Errorf("❌ DVD is already playing")
 }
 d.isOn = true
 return "DVD is playing", nil
}

func (d *DVDPlayer) Stop() (string, error) {
 if !d.isOn {
  return "", fmt.Errorf("❌ DVD is already stopped")
 }
 d.isOn = false
 return "DVD stopped", nil
}

// HomeTheaterFacade provides a simplified interface to a complex subsystem
type HomeTheaterFacade struct {
 tv          *TV
 soundSystem *SoundSystem
 dvdPlayer   *DVDPlayer
}

// NewHomeTheaterFacade is a constructor for HomeTheaterFacade
func NewHomeTheaterFacade(tv *TV, soundSystem *SoundSystem, dvdPlayer *DVDPlayer) *HomeTheaterFacade {
 return &HomeTheaterFacade{
  tv:          tv,
  soundSystem: soundSystem,
  dvdPlayer:   dvdPlayer,
 }
}

// WatchMovie is a facade method
func (h *HomeTheaterFacade) WatchMovie() (string, error) {
 if h.tv == nil || h.soundSystem == nil || h.dvdPlayer == nil {
  return "", fmt.Errorf("❌ home theater is not properly set up")
 }

 response := NewOperationResponse()
 tvResponse, tvErr := h.tv.TurnOn()
 response.AddResponse(tvResponse, tvErr)
 soundSystemResponse, soundSystemErr := h.soundSystem.TurnOn()
 response.AddResponse(soundSystemResponse, soundSystemErr)
 dvdResponse, dvdErr := h.dvdPlayer.Play()
 response.AddResponse(dvdResponse, dvdErr)
 return response.String(), nil
}

// StopMovie is a facade method
func (h *HomeTheaterFacade) StopMovie() string {
 response := NewOperationResponse()
 dvdResponse, dvdErr := h.dvdPlayer.Stop()
 response.AddResponse(dvdResponse, dvdErr)
 soundSystemResponse, soundSystemErr := h.soundSystem.TurnOff()
 response.AddResponse(soundSystemResponse, soundSystemErr)
 tvResponse, tvErr := h.tv.TurnOff()
 response.AddResponse(tvResponse, tvErr)
 return response.String()
}

type OperationResponse struct {
 Responses []string
 Errors    []error
}

func NewOperationResponse() *OperationResponse {
 return &OperationResponse{}
}

func (o *OperationResponse) AddResponse(response string, err error) {
 if response != "" {
  o.Responses = append(o.Responses, response)
 }
 if err != nil {
  o.Errors = append(o.Errors, err)
 }
}

func (o *OperationResponse) String() string {
 // Combine all responses and errors into a single string, don't display nil errors
 var responseStrings []string
 responseStrings = append(responseStrings, o.Responses...)
 return strings.Join(responseStrings, "\n")
}

func mapErrorsToStrings(errors []error) []string {
 var errorStrings []string
 for _, err := range errors {
  errorStrings = append(errorStrings, err.Error())
 }
 return errorStrings
}

func main() {
 tv := &TV{}
 soundSystem := &SoundSystem{}
 dvdPlayer := &DVDPlayer{}

 faultyHomeTheater := NewHomeTheaterFacade(tv, soundSystem, nil)
 fmt.Println("Trying to watch a movie with a faulty home theater...")
 faultyMovie, err := faultyHomeTheater.WatchMovie()
 if err != nil {
  fmt.Println(err)
 } else {
  fmt.Println(faultyMovie)
 }

 homeTheater := NewHomeTheaterFacade(tv, soundSystem, dvdPlayer)
 fmt.Println("About to watch a movie with a properly set up home theater...")
 movie, err := homeTheater.WatchMovie()
 if err != nil {
  return
 }
 fmt.Println(movie)

 fmt.Println("Someone tries to turn on the TV while it's already on...")
 _, err = tv.TurnOn()
 if err != nil {
  fmt.Println(err)
 }

 fmt.Println("Trying to start the movie again while it's already playing...")
 watchMovie, err := homeTheater.WatchMovie()
 if err != nil {
  return
 }
 fmt.Println(watchMovie)
 fmt.Println("Stopping the movie...")
 homeTheater.StopMovie()
 fmt.Println("Trying to stop the movie again while it's already stopped...")
 homeTheater.StopMovie()

 // Output:
 /*
  Trying to watch a movie with a faulty home theater...
  ❌ home theater is not properly set up
  About to watch a movie with a properly set up home theater...
  TV is on
  SoundSystem is on
  DVD is playing
  Someone tries to turn on the TV while it's already on...
  ❌ TV is already on
  Trying to start the movie again while it's already playing...
  Stopping the movie...
  Trying to stop the movie again while it's already stopped...
 */
}
```

### Flyweight (cache)

- Analogy
    - A library (flyweight factory) lends books (flyweight objects with intrinsic state) to library members (context in which extrinsic state exists) without creating a resource nightmare (resources are shared as much as possible).
- When to use it
    - There's a need to spawn a huge number of similar objects sharing some context.
    - The intrinsic state can be extracted across different objects. E.g., actual trees of the same type may share attributes like texture and color (intrinsic state) but will have distinct attributes like their `(x, y, z)` position (extrinsic state).
- Implementation
    - Separate intrinsic and extrinsic states.
        - Get the fields that won't change (intrinsic state). These are unchanging and unique data points. They are implemented via the Flyweight interface.
        - The extrinsic state is the contextual data that is unique to each object and cannot be shared.
    - A concrete flyweight implements the Flyweight interface and stores intrinsic state that can be shared. The extrinsic state is passed as arguments to methods. Fields related to the intrinsic state must be immutable.
    - A flyweight factory class can be created to avoid re-creating existing objects with a set comprising the exact same attributes. The intrinsic state is passed to the factory.
- Pros
    - Can save a lot of memory depending on context. This is only relevant when a very large number of objects are needed.
- Cons
    - While RAM may decrease, there can be a trade off with CPU as contextual data may need to be recalculated.
    - This increases complexity substantially.
- Relation to other patterns
    - Shared leaf nodes of a **Composite** tree may be implemented as **Flyweights**.
    - **Flyweight** creates lots of smaller objects, **Facade** creates a single large object representing the whole system.

```go
package main

import (
 "fmt"
 "strings"
)

// TextStyle is the flyweight interface
type TextStyle interface {
 ApplyStyle(text string) string
}

// BoldStyle is a concrete flyweight
type BoldStyle struct{}

func (b *BoldStyle) ApplyStyle(text string) string {
 return "**" + text + "**"
}

// UrgentStyle is a concrete flyweight
type UrgentStyle struct{}

func (u *UrgentStyle) ApplyStyle(text string) string {
 return "‼️ " + text + " ‼️"
}

// ItalicStyle is a concrete flyweight
type ItalicStyle struct{}

func (i *ItalicStyle) ApplyStyle(text string) string {
 return "_" + text + "_"
}

// BulletStyle is a concrete flyweight
type BulletStyle struct{}

func (b *BulletStyle) ApplyStyle(text string) string {
 return "* " + text
}

// StyleFactory is the flyweight factory
type StyleFactory struct {
 styles          map[string]TextStyle
 compositeStyles map[string]*CompositeStyle // cache for composite styles
}

// NewStyleFactory is the flyweight factory constructor
func NewStyleFactory() *StyleFactory {
 return &StyleFactory{
  styles:          make(map[string]TextStyle),
  compositeStyles: make(map[string]*CompositeStyle),
 }
}

func (f *StyleFactory) GetStyle(styleName string) (TextStyle, error) {
 if style, exists := f.styles[styleName]; exists {
  return style, nil
 }

 var style TextStyle
 switch styleName {
 case "bold":
  style = &BoldStyle{}
 case "italic":
  style = &ItalicStyle{}
 case "bullet":
  style = &BulletStyle{}
 default:
  return nil, fmt.Errorf("unknown style: %s", styleName)
 }

 f.styles[styleName] = style
 return style, nil
}

// Extend with the Composite pattern to get multiple styles applied to a text

// CompositeStyle is the composite class
type CompositeStyle struct {
 styles []TextStyle
}

// NewCompositeStyle is the composite constructor
func NewCompositeStyle(styles ...TextStyle) *CompositeStyle {
 return &CompositeStyle{styles: styles}
}

// ApplyStyle is the composite method
func (c *CompositeStyle) ApplyStyle(text string) string {
 for _, style := range c.styles {
  text = style.ApplyStyle(text)
 }
 return text
}

// AddStyle is the composite method
func (c *CompositeStyle) AddStyle(style TextStyle) {
 c.styles = append(c.styles, style)
}

func (f *StyleFactory) GetCompositeStyle(styleNames ...string) TextStyle {
 key := strings.Join(styleNames, "+") // Create a unique key for the combination

 if composite, exists := f.compositeStyles[key]; exists {
  return composite
 }

 var composite = NewCompositeStyle()
 for _, name := range styleNames {
  style, _ := f.GetStyle(name) // Handle error as appropriate
  composite.AddStyle(style)
 }

 f.compositeStyles[key] = composite
 return composite
}

type ConditionalStyle struct {
 condition func(string) bool
 style     TextStyle
}

func NewConditionalStyle(condition func(string) bool, style TextStyle) *ConditionalStyle {
 return &ConditionalStyle{condition: condition, style: style}
}

func (c *ConditionalStyle) ApplyStyle(text string) string {
 if c.condition(text) {
  return c.style.ApplyStyle(text)
 }
 return text
}

func main() {
 factory := NewStyleFactory()

 boldStyle, _ := factory.GetStyle("bold")
 fmt.Println(boldStyle.ApplyStyle("Hello"))

 italicStyle, _ := factory.GetStyle("italic")
 fmt.Println(italicStyle.ApplyStyle("Go!"))

 // Reusing flyweights
 anotherBold, _ := factory.GetStyle("bold")
 fmt.Println(anotherBold.ApplyStyle("Flyweight bold"))

 bulletStyle, _ := factory.GetStyle("bullet")
 fmt.Println(bulletStyle.ApplyStyle("Flyweight list"))

 // Composite styles
 italicBulletStyle := factory.GetCompositeStyle("italic", "bullet")
 fmt.Println(italicBulletStyle.ApplyStyle("Italic bullet"))
 bulletItalicStyle := factory.GetCompositeStyle("bullet", "italic")
 fmt.Println(bulletItalicStyle.ApplyStyle("Bullet italic that's incorrect..."))

 // Apply bold style only if the text contains "important"
 importantCondition := func(text string) bool {
  return strings.Contains(text, "important")
 }
 importantBoldStyle := NewConditionalStyle(importantCondition, &BoldStyle{})

 // Apply urgent style to text that contains "urgent"
 urgentCondition := func(text string) bool {
  return strings.Contains(text, "urgent")
 }
 urgentStyle := NewConditionalStyle(urgentCondition, &UrgentStyle{})

 fmt.Println(importantBoldStyle.ApplyStyle("This is important and should be bold"))
 fmt.Println(urgentStyle.ApplyStyle("This is important but not bold"))
 fmt.Println(urgentStyle.ApplyStyle("This is urgent"))
 fmt.Println(importantBoldStyle.ApplyStyle("This is urgent but not emphasized"))

 // Output:
 /*
  **Hello**
  _Go!_
  **Flyweight bold**
  * Flyweight list
  * _Italic bullet_
  _* Bullet italic that's incorrect..._
  **This is important and should be bold**
  This is important but not bold
  ‼️ This is urgent ‼️
  This is urgent but not emphasized
 */
}
```

### Proxy

- Analogy
    - Cash and credit cards are two ways of handling payment.
- When to use it
    - For lazy initialization (virtual proxy). A heavy service can be instantiated as needed instead of leaving it running.
    - Similarly, for smart referencing (smart reference proxy). This means that if a heavy service needs to be up and running all the time but no clients are using it, it could be shut down until a client connects.
    - For access control (protection proxy). For instance, a library implements the Spotify API but needs to limit access to non-paying users. A proxy interface can be used and internal logic can determine which customers can access the API at a given time. The Spotify API remains the same, but custom logic can run before and after its use.
    - For logging requests. Instead of just calling an API, the proxy can implement logging and then call the API.
    - For caching purposes. Instead of downloading a video over and over again via an API, the result can be cached.
- Implementation
    - Create a service Proxy interface that is used by the client (Subject interface). The proxy implements the same interface as the service (RealSubject) and can do stuff on top of it (e.g., data caching or logging).
    - In most cases, the proxy object does some work and delegates the actual use of the service to the service itself from a field that references that service. The proxy class is instantiated with a reference to the service.
    - Optionally, a factory method can be used.
    - Also in option, lazy initialization can be implemented for the service object.
- Pros
    - The proxy transparently controls all aspects of the service and is indistinguishable from the service from the client's perspective.
    - The lifecycle of the service can be managed by the proxy class when appropriate, e.g. to reduce system resources.
    - The proxy works even when the actual service could be down.
    - New proxies can be added without changing existing code.
- Cons
    - Complexity increases as new proxies are added.
    - It may cause delay in the response from the service if the proxy performs heavy operations.
- Relation to other patterns
    - **Adapter** provides a different interface, **Proxy** provides the same interface and **Decorator** provides an enhanced version of the interface.
    - **Proxy** is indistinguishable from the original service, whereas **Facade** may be a simplified interface.
    - **Decorator** is controlled by the client, while **Proxy** manages the whole lifecycle of the service.

```go
package main

import "fmt"

// RealDocument is the real object that the proxy will represent
type RealDocument struct {
 content string
}

type Displayable interface {
 Display() string
}

type Editable interface {
 Edit(newContent string)
}

// Display is the method that the proxy and the real object both implement, implementing the Displayable interface
func (d *RealDocument) Display() string {
 return "Displaying Document: " + d.content
}

// NewRealDocument is a factory method that creates a new RealDocument
func NewRealDocument(content string) *RealDocument {
 return &RealDocument{content: content}
}

// ProtectedDocument is the proxy object that will control access to the real object
type ProtectedDocument struct {
 content  string
 document *RealDocument
 userRole string
}

// Display is the version that the proxy implements
func (p *ProtectedDocument) Display() string {
 fmt.Printf("Access attempt by %s role\n", p.userRole)
 if p.userRole != "admin" {
  fmt.Println("❌ Access Denied: Insufficient permissions")
  return "Access Denied"
 }
 fmt.Println("✅ Document access granted")
 if p.document == nil {
  fmt.Println("⌛ Loading document content...")
  p.document = NewRealDocument(p.content)
 }
 return p.document.Display()
}

// NewProtectedDocument is a factory method that creates a new ProtectedDocument
func NewProtectedDocument(content string, userRole string) *ProtectedDocument {
 return &ProtectedDocument{content: content, userRole: userRole}
}

func ShowDocument(doc Displayable) {
 fmt.Println(doc.Display())
}

func main() {
 doc := NewRealDocument("Top secret stuff.")

 adminProxy := NewProtectedDocument(doc.content, "admin")
 ShowDocument(adminProxy)

 userProxy := NewProtectedDocument(doc.content, "read-only")
 ShowDocument(userProxy)

 // Whoever has access to the real object can bypass the proxy
 fmt.Println("By-passing the proxy:")
 ShowDocument(doc)

 // Output:
 /*
  Access attempt by admin role
  ✅ Document access granted
  ⌛ Loading document content...
  Displaying Document: Top secret stuff.
  Access attempt by read-only role
  ❌ Access Denied: Insufficient permissions
  Access Denied
  By-passing the proxy:
  Displaying Document: Top secret stuff.
 */
}
```

---

## Behavioral Design Patterns

These patterns deal with algorithms and the assignment of responsibilities between objects.

### Chain of Responsibility  (CoR, chain of command)

- Analogy
    - A call center answers with a machine, then a generalist tries to solve the issue, then the engineer comes to the rescue.
- When to use it
    - When an action must pass a series of checks, such that a handler may process the request or pass it down the chain of handlers.
- Implementation
    - A Handler interface defines the interface for handling requests and may also have a method to set the next handler of the chain.
    - Concrete handlers implement the Handler interface. These either process the request if they can or pass it down the chain until no more handler is available.
    - The Client initiates the request to a chain of handlers. The chain can either be pre-defined or the client might do the chaining.
- Pros
    - Can control the order of request handling.
    - Can decouple unrelated operations (single responsibility principle). It decouples the sender from the receiver.
    - New handlers can be added without breaking existing code (open/closed principle).
- Cons
    - Some requests may not be handled if there are no suitable handlers in the chain.
        - When all requests should be handled, a default "catch-all" handler can be implemented to be used at the end of the chain.
        - Another approach could be to disqualify any request that does not match certain criteria if possible, and stop the chain right at the beginning.
    - Performance could be an issue if the chain of handlers is lengthy.
- Relation to other patterns
    - **Chain of Responsibility** passes a requests in a sequential manner until a handler deals with it.
    - It is often used with the **Composite** pattern, e.g. in a GUI application where clicking on a button inside a dialog, which itself is inside a panel, may produce a chain reaction. This is suitable when the data structure forms a tree.
    - The handlers may be implemented as **Commands**. Or the request itself may arrive as a Command object, where the same operation could be executed in a series of different contexts.
    - Like **Decorator**, this pattern relies on recursive composition. But a **Decorator** doesn't stop at any point in the chain and adds behavior on top of an existing object (adds responsibilities) while **Chain of Responsibility** can execute any operation in any of its handlers (passes responsibility along).

```go
package main

import "fmt"

// BaseLogger is the base struct for all loggers
type BaseLogger struct {
 next Logger
}

// Logger is the interface that all loggers must implement
type Logger interface {
 Log(message string, severity int)
 SetNext(logger Logger)
}

// Different types of log levels
const (
 INFO  = 1
 DEBUG = 2
 ERROR = 3
)

func (l *BaseLogger) SetNext(next Logger) {
 l.next = next
}

func (l *BaseLogger) Next(message string, severity int) {
 if l.next != nil {
  l.next.Log(message, severity)
 }
}

type LoggerImpl struct {
 BaseLogger
 levels map[int]bool // Map to hold allowed log levels
}

func NewLogger(levels ...int) *LoggerImpl {
 levelMap := make(map[int]bool)
 for _, level := range levels {
  levelMap[level] = true
 }
 return &LoggerImpl{levels: levelMap}
}

func (l *LoggerImpl) Log(message string, severity int) {
 if l.levels[severity] {
  fmt.Printf("[%s] %s\n", severityToString(severity), message)
  return
 }
 l.Next(message, severity)
}

func severityToString(severity int) string {
 switch severity {
 case INFO:
  return "INFO"
 case DEBUG:
  return "DEBUG"
 case ERROR:
  return "ERROR"
 default:
  return "UNKNOWN"
 }
}

// DefaultLogger is a logger that logs all unhandled messages
type DefaultLogger struct{}

// Log logs the message and severity level for all unhandled messages
func (l *DefaultLogger) Log(message string, severity int) {
 fmt.Printf("[DEFAULT] %s (severity: %d)\n", message, severity)
}

// SetNext does nothing for the default logger
func (l *DefaultLogger) SetNext(next Logger) {
 // default catch-all handler with no next logger
}

func BuildChain(loggers ...Logger) Logger {
 for i := 0; i < len(loggers)-1; i++ {
  loggers[i].SetNext(loggers[i+1])
 }
 return loggers[0] // Return the head of the chain
}

func main() {
 infoLogger := NewLogger(INFO)
 debugLogger := NewLogger(DEBUG)
 errorLogger := NewLogger(ERROR)
 defaultLogger := &DefaultLogger{}

 // Build the chain
 headLogger := BuildChain(debugLogger, infoLogger, errorLogger, defaultLogger)

 // Test the chain
 headLogger.Log("Info message", INFO)
 headLogger.Log("Debug message", DEBUG)
 headLogger.Log("Error message", ERROR)
 headLogger.Log("Unhandled severity message", 0)

 // Output:
 /*
  [INFO] Info message
  [DEBUG] Debug message
  [ERROR] Error message
  [DEFAULT] Unhandled severity message (severity: 0)
 */
}
```

### Command (action, transaction)

- Analogy
    - A kitchen chef receives a command.
- When to use it
    - To encapsulate a request as an object, allowing for the parameterization of clients with queues, requests, and operations.
    - Support of undoable operations. It turns a request into a stand-alone object that contains all information about the request. This transformation lets one parameterize methods with different requests, delay or queue a request's execution, and support undoable operations.
- Implementation
    - Command Interface: This defines a method for executing a command.
    - Concrete Command: Implements the command interface and defines the binding between a Receiver object and an action.
    - Receiver: Performs the actual work when the command's Execute method is called.
    - Invoker: Asks the command to carry out the request.
    - Client: Creates a ConcreteCommand object and sets its receiver.
- Pros
    - Decouples the classes that invoke the operation from the object that knows how to execute the operation.
    - New commands can be added without changing existing code (Open/Closed Principle).
    - Multiple commands can be composed into one by using the Composite pattern.
- Cons
    - Can introduce additional layers of abstraction, which might complicate simpler operations.
    - Each new command might require a new concrete class, increasing the number of classes in the system.
- Relation to other patterns
    - **Memento** can be used in conjunction with the **Command** pattern to implement undo/redo functionalities, where **Command** stores the state of the Receiver.
    - **Commands** can be composed into a **Composite** command, a macro command that consists of several simpler commands.
    - **Command** encapsulates a request as an object, whereas **Strategy** encapsulates an algorithm.

```go
package main

import "fmt"

// Command is the command interface: Redo() is implicit
type Command interface {
 Execute()
 Undo()
}

// BankAccount is the receiver
type BankAccount struct {
 Balance    float64
 Difference float64
 Operation  string
}

// DepositCommand and WithdrawCommand are the concrete commands
type DepositCommand struct {
 account *BankAccount
 amount  float64
}

// Execute adds the amount to the account balance
func (d *DepositCommand) Execute() {
 d.account.Balance += d.amount
 d.account.Difference = d.amount
 d.account.Operation = "deposit"
}

type WithdrawCommand struct {
 account *BankAccount
 amount  float64
}

// Execute subtracts the amount from the account balance
func (w *WithdrawCommand) Execute() {
 if w.account.Balance >= w.amount {
  w.account.Balance -= w.amount
  w.account.Difference = w.amount
 } else {
  w.account.Difference = 0
 }
 w.account.Operation = "withdrawal"
}

// Undo reverses the DepositCommand operation
func (d *DepositCommand) Undo() {
 d.account.Balance -= d.amount
 d.account.Difference = d.amount
 d.account.Operation = "undo deposit"
}

// Undo reverses the WithdrawCommand operation
func (w *WithdrawCommand) Undo() {
 w.account.Balance += w.amount
 w.account.Difference = w.amount
 w.account.Operation = "undo withdrawal"
}

// CommandManager is the invoker
type CommandManager struct {
 history   []Command
 redoStack []Command
}

// ExecuteCommand adds the command to the history and executes it
func (cm *CommandManager) ExecuteCommand(cmd Command) {
 cmd.Execute()
 cm.history = append(cm.history, cmd)
}

// Undo reverses the last command
func (cm *CommandManager) Undo() {
 if len(cm.history) == 0 {
  return
 }
 cmd := cm.history[len(cm.history)-1]
 cmd.Undo()
 cm.history = cm.history[:len(cm.history)-1] // Remove the last command from history
 cm.redoStack = append(cm.redoStack, cmd)    // Add it to the redo stack
}

// Redo re-executes the last undone command
func (cm *CommandManager) Redo() {
 if len(cm.redoStack) == 0 {
  return
 }
 cmd := cm.redoStack[len(cm.redoStack)-1]
 cmd.Execute()
 cm.redoStack = cm.redoStack[:len(cm.redoStack)-1] // Remove the last command from redoStack
 cm.history = append(cm.history, cmd)              // Add it back to the history
}

// PrintSummary shows the account balance and the difference after the operation
func (b *BankAccount) PrintSummary() {
 if b.Operation == "" {
  fmt.Printf("Account balance: $%.2f\n", b.Balance)
  return
 }

 if b.Operation == "withdrawal" && b.Difference == 0 {
  fmt.Printf("Withdrawal not successful. Account balance: $%.2f\n", b.Balance)
  return
 }

 if b.Operation == "deposit" && b.Difference == 0 {
  fmt.Printf("Deposit not successful. Account balance: $%.2f\n", b.Balance)
  return
 }

 if b.Operation == "withdrawal" {
  fmt.Printf("Account balance after %s: $%.2f ($%.2f - $%.2f)\n", b.Operation, b.Balance, b.Balance+b.Difference, b.Difference)
  return
 }

 if b.Operation == "deposit" {
  fmt.Printf("Account balance after %s: $%.2f ($%.2f + $%.2f)\n", b.Operation, b.Balance, b.Balance-b.Difference, b.Difference)
  return
 }

 if b.Operation == "undo withdrawal" {
  fmt.Printf("Account balance after %s: $%.2f ($%.2f + $%.2f)\n", b.Operation, b.Balance, b.Balance-b.Difference, b.Difference)
  return
 }

 if b.Operation == "undo deposit" {
  fmt.Printf("Account balance after %s: $%.2f ($%.2f - $%.2f)\n", b.Operation, b.Balance, b.Balance+b.Difference, b.Difference)
  return
 }
}

func main() {
 account := &BankAccount{Balance: 100.0}
 manager := CommandManager{}

 deposit := &DepositCommand{account: account, amount: 50}
 withdraw := &WithdrawCommand{account: account, amount: 30}

 account.PrintSummary()

 manager.ExecuteCommand(deposit)
 account.PrintSummary()

 manager.ExecuteCommand(withdraw)
 account.PrintSummary()

 fmt.Println("Undoing the last operation...")
 manager.Undo()
 account.PrintSummary()

 fmt.Println("Redoing the last operation...")
 manager.Redo()
 account.PrintSummary()

 fmt.Println("Undoing the last operation...")
 manager.Undo()
 account.PrintSummary()

 fmt.Println("Undoing the last operation...")
 manager.Undo()
 account.PrintSummary()

 // Output:
 /*
  Account balance: $100.00
  Account balance after deposit: $150.00 ($100.00 + $50.00)
  Account balance after withdrawal: $120.00 ($150.00 - $30.00)
  Undoing the last operation...
  Account balance after undo withdrawal: $150.00 ($120.00 + $30.00)
  Redoing the last operation...
  Account balance after withdrawal: $120.00 ($150.00 - $30.00)
  Undoing the last operation...
  Account balance after undo withdrawal: $150.00 ($120.00 + $30.00)
  Undoing the last operation...
  Account balance after undo deposit: $100.00 ($150.00 - $50.00)
 */
}
```

### Iterator

- Analogy
    - All roads lead to Rome. There's more than one way of iterating one's path through the city.
- When to use it
    - When there's a need to provide a way to access a collection of objects in a sequential manner without the need to understand or expose the underlying structure of the collection.
- Implementation
    - The **Iterator Interface** defines the operations required for iterating over a collection, such as `getNext()`, `hasNext()`, and sometimes `remove()`.
    - The **Concrete Iterator** implements the **Iterator Interface** and keeps track of the current position in the collection.
    - The **Aggregate Interface** defines the method to create an iterator.
    - The **Concrete Aggregate** implements the **Aggregate Interface** and returns an instance of the **Concrete Iterator**.
- Pros
    - Allows the traversal of elements without exposing the underlying structure (array, tree, graph, etc.).
    - Enables multiple simultaneous traversals of a collection.
    - Provides a uniform interface for traversing different types of collections.
- Cons
    - Can increase the complexity of an application by requiring additional classes and interfaces.
    - Introduces some overhead to the traversal process, especially if the iterator is feature-rich (like supporting bidirectional traversal).
- Relation to other patterns
    - **Iterators** are often used to traverse **Composite** trees.
    - With **Factory Method**, it can be used to define a method in the **Aggregate Interface** for creating an iterator.
    - An **Iterator** can use a **Memento** to capture the state of an iteration.

```go
package main

import (
 "fmt"
 "slices"
 "strconv"
)

// Book struct represents a book in a collection
type Book struct {
 Title string
 Pages int
 Index string // shows the index of the book in the collection
}

// BookIterator defines the interface for iterating over books
type BookIterator interface {
 HasNext() bool
 Next() *Book
 HasPrevious() bool             // not always there: could be added
 Previous() *Book               // not always there: could be added
 Count() int                    // The number of books iterated over
 CurrentIndex() int             // The current index
 Remove(direction string) error // implement safe removal
 Reset()                        // Reset the iterator
}

// BookCollection holds a collection of books
type BookCollection struct {
 Books []*Book
}

// Iterator returns a new BookIterator to iterate over the collection
func (bc *BookCollection) Iterator() BookIterator {
 return &BookCollectionIterator{
  bookCollection: bc,
  currentIndex:   -1,
  count:          0,
 }
}

// BookCollectionIterator is the concrete iterator for BookCollection
type BookCollectionIterator struct {
 bookCollection   *BookCollection
 currentIndex     int
 count            int  // The number of books iterated over
 iterationStarted bool // Flag to indicate if iteration has started
}

// HasNext checks if there is a next book in the collection
func (it *BookCollectionIterator) HasNext() bool {
 if !it.iterationStarted {
  it.currentIndex = -1
  it.iterationStarted = true
 }
 return it.currentIndex+1 < len(it.bookCollection.Books)
}

// HasPrevious checks if there is a previous book in the collection
func (it *BookCollectionIterator) HasPrevious() bool {
 if !it.iterationStarted {
  it.currentIndex = len(it.bookCollection.Books) // Set to length for backward iteration start
  it.iterationStarted = true
 }
 return it.currentIndex-1 >= 0
}

// Next returns the next book in the collection
func (it *BookCollectionIterator) Next() *Book {
 if it.bookCollection == nil || len(it.bookCollection.Books) == 0 {
  fmt.Println("No books in the collection")
  return nil
 }
 if it.HasNext() {
  it.currentIndex++
  it.count++
  return it.bookCollection.Books[it.currentIndex]
 }
 return nil
}

// Previous returns the previous book in the collection
func (it *BookCollectionIterator) Previous() *Book {
 if it.bookCollection == nil || len(it.bookCollection.Books) == 0 {
  fmt.Println("No books in the collection")
  return nil
 }
 if it.currentIndex < 0 {
  it.currentIndex = len(it.bookCollection.Books)
 }
 if it.HasPrevious() {
  it.currentIndex--
  it.count++
  return it.bookCollection.Books[it.currentIndex]
 }
 return nil
}

// Count returns the number of books iterated over
func (it *BookCollectionIterator) Count() int {
 return it.count
}

// CurrentIndex returns the current index
func (it *BookCollectionIterator) CurrentIndex() int {
 return it.currentIndex
}

// Remove safely removes the current element from the collection
func (it *BookCollectionIterator) Remove(direction string) error {
 if it.currentIndex < 0 || it.currentIndex >= len(it.bookCollection.Books) {
  return fmt.Errorf("remove operation out of bounds")
 }

 // Remove the element at currentIndex
 it.bookCollection.Books = slices.Delete(it.bookCollection.Books, it.currentIndex, it.currentIndex+1)

 if direction == "backward" {
  // Stay at the same index after removal
 } else if direction == "forward" {
  // Decrement currentIndex to adjust for the shift in elements after removal
  it.currentIndex--
 } else {
  panic("Invalid direction")
 }
 return nil
}

func (it *BookCollectionIterator) Reset() {
 fmt.Println("Resetting the iterator")
 it.currentIndex = -1
 it.iterationStarted = false
}

func main() {
 collection := &BookCollection{
  Books: []*Book{
   {Title: "The Go Programming Language", Pages: 380, Index: "0"},
   {Title: "Go in Action", Pages: 325, Index: "1"},
   {Title: "Go Design Patterns", Pages: 246, Index: "2"},
  },
 }

 fmt.Println("Book collection:")
 for i, book := range collection.Books {
  index := strconv.Itoa(i + 1)
  fmt.Println(index+".", book.Title, "-", book.Pages, "pages")
 }

 iterator := collection.Iterator()

 fmt.Println("\nIterating forward, removing big books")
 for iterator.HasNext() {
  book := iterator.Next()
  fmt.Println("➡️", "("+book.Index+")", book.Title, "has", book.Pages, "pages, count:", iterator.Count())

  if book.Pages > 350 {
   fmt.Println("‼️", book.Title, "is a large book")
   if err := iterator.Remove("forward"); err != nil {
    fmt.Println("Remove operation failed:", err)
   } else {
    fmt.Println("❌ ", book.Title, "removed")
   }
  }
 }
 iterator.Reset()

 fmt.Println("\nIterating backward, removing small books")
 for iterator.HasPrevious() {
  book := iterator.Previous()
  fmt.Println("⬅️", "("+book.Index+")", book.Title, "still has", book.Pages, "pages, count:", iterator.Count())

  if book.Pages < 250 {
   fmt.Println("‼️", book.Title, "is a small book")
   if err := iterator.Remove("backward"); err != nil {
    fmt.Println("Remove operation failed:", err)
   } else {
    fmt.Println("❌", book.Title, "removed")
    iterator.Next() // Go forward one step, so we don't skip a book
   }
  }
 }
 iterator.Reset()

 fmt.Println("\nIterating forward again")
 for iterator.HasNext() {
  book := iterator.Next()
  fmt.Println("➡️", "("+book.Index+")", book.Title, "has", book.Pages, "pages, count:", iterator.Count())
 }

 fmt.Println("\nIterating forward once again without having reset")
 for iterator.HasNext() {
  book := iterator.Next()
  fmt.Println("➡️", "("+book.Index+")", book.Title, "has", book.Pages, "pages, count:", iterator.Count())
 }
 fmt.Println("\nTotal iteration count:", iterator.Count())

 // Output:
 /*
  Book collection:
  1. The Go Programming Language - 380 pages
  2. Go in Action - 325 pages
  3. Go Design Patterns - 246 pages

  Iterating forward, removing big books
  ➡️ (0) The Go Programming Language has 380 pages, count: 1
  ‼️ The Go Programming Language is a large book
  ❌ The Go Programming Language removed
  ➡️ (1) Go in Action has 325 pages, count: 2
  ➡️ (2) Go Design Patterns has 246 pages, count: 3
  Resetting the iterator

  Iterating backward, removing small books
  ⬅️ (2) Go Design Patterns still has 246 pages, count: 4
  ‼️ Go Design Patterns is a small book
  ❌ Go Design Patterns removed
  ⬅️ (1) Go in Action still has 325 pages, count: 5
  Resetting the iterator

  Iterating forward again
  ➡️ (1) Go in Action has 325 pages, count: 6

  Iterating forward once again without having reset

  Total iteration count: 6
 */
}
```

### Mediator (Intermediary, Controller)

- Analogy
    - The control tower acts as a mediator for aircraft pilots.
- When to use it
    - To provide a centralized communication medium between different objects in a system.
    - To promote loose coupling by keeping objects from referring to each other explicitly, allowing their interaction to be managed by the **Mediator**.
    - Reduce complexities and dependencies between tightly coupled objects communicating directly.
- Implementation
    - The **Mediator Interface** defines the interface for communication that the concrete mediator will implement.
    - The **Concrete Mediator** implements the **Mediator Interface** and coordinates communication between colleague objects. It knows and maintains its colleagues.
    - The Colleague Classes are objects that communicate with each other through the **Mediator**. Each colleague class knows its mediator object and communicates with it, instead of communicating directly with other colleagues.
- Pros
    - Allows reducing the coupling between classes of objects by centralizing communication in the **Mediator**.
    - Simplifies maintenance and interaction between classes by having a central point that controls and manages communication.
    - Centralizes control over how objects interact, making it easier to understand and manage complex communication networks.
- Cons
    - The mediator can become overly complex (a "God" object) if too many responsibilities are added.
    - Centralizing too much logic and control in the mediator can introduce a single point of failure in the system.
    - Finding the right balance in responsibilities between the mediator and its colleagues can be challenging.
- Relation to other patterns
    - The **Mediator** pattern can be implemented using the **Observer** pattern, where the mediator acts as an observer and the colleagues as subjects.
    - The **Mediator** can be seen as a counterpart of the **Facade** pattern. **Facade** defines a simplified interface to a subsystem, **Mediator** centralizes communication between components of the system.
    - **Mediator** can work closely with the **Command** pattern to orchestrate complex operations involving multiple objects.

```go
package main

import (
 "fmt"
 "math/rand"
)

// Mediator interface defines the method for sending messages between colleagues
type Mediator interface {
 Send(message string, colleague Colleague)
 Subscribe(senderName string, receiver []Colleague)
 Unsubscribe(senderName string, receiver []Colleague)
}

// Colleague interface represents a colleague in the mediator pattern
type Colleague interface {
 Notify(message string)
 Name() string
}

// ConcreteMediator implements the Mediator interface and coordinates communication between colleagues
type ConcreteMediator struct {
 colleagues    map[string]Colleague
 subscriptions map[string][]Colleague
}

// RegisterColleague adds colleagues to the mediator's list
func (m *ConcreteMediator) RegisterColleague(name string, colleague Colleague) {
 if m.colleagues == nil {
  m.colleagues = make(map[string]Colleague)
 }
 m.colleagues[name] = colleague
}

// Subscribe adds receiver(s) to the list of subscribers for a particular sender
func (m *ConcreteMediator) Subscribe(senderName string, receiver []Colleague) {
 if m.subscriptions == nil {
  m.subscriptions = make(map[string][]Colleague)
 }
 for _, r := range receiver {
  m.subscriptions[senderName] = append(m.subscriptions[senderName], r)
 }
}

// Unsubscribe removes receiver(s) from the list of subscribers for a particular sender
func (m *ConcreteMediator) Unsubscribe(senderName string, receiver []Colleague) {
 // print the list of receivers about to be removed, converting the receiver slice to a string
 unsub := ""
 for _, r := range receiver {
  unsub += r.Name() + ", "
 }
 unsub = unsub[:len(unsub)-2] // remove the trailing comma and space
 fmt.Println("❌  Unsubscribing", unsub, "from", senderName)

 if m.subscriptions == nil {
  return
 }
 for _, r := range receiver {
  for i, v := range m.subscriptions[senderName] {
   if v == r {
    m.subscriptions[senderName] = append(m.subscriptions[senderName][:i], m.subscriptions[senderName][i+1:]...)
   }
  }
 }
}

// Send sends messages between colleagues, avoiding notifying the sender
func (m *ConcreteMediator) Send(message string, sender Colleague) {
 senderName := sender.Name()
 for _, receiver := range m.subscriptions[senderName] {
  if receiver != sender { // Avoid sending message to self
   receiver.Notify(message)
  }
 }
}

// ComponentAlice is a colleague that can send and receive messages through the mediator
type ComponentAlice struct {
 mediator Mediator
}

// Notify handles messages sent to ComponentAlice
func (c *ComponentAlice) Notify(message string) {
 fmt.Println("👂 Alice heard:", message)
}

// Send sends a message via the mediator
func (c *ComponentAlice) Send(message string) {
 fmt.Println("🔉 Alice talks:", message)
 c.mediator.Send(message, c)
}

func (c *ComponentAlice) Name() string {
 return "Alice"
}

// ComponentBob is another colleague similar to ComponentAlice
type ComponentBob struct {
 mediator Mediator
}

// Notify handles messages sent to ComponentBob
func (c *ComponentBob) Notify(message string) {
 fmt.Println("🦻 Bob heard:", shuffleString(message))
}

// Send sends a message via the mediator
func (c *ComponentBob) Send(message string) {
 fmt.Println("📣 Bob talks:", shuffleString(message))
 c.mediator.Send(message, c)
}

func (c *ComponentBob) Name() string {
 return "Bob"
}

// ComponentCharlie is another colleague similar to ComponentAlice
type ComponentCharlie struct {
 mediator Mediator
}

// Notify handles messages sent to ComponentCharlie
func (c *ComponentCharlie) Notify(message string) {
 fmt.Println("👂 Charlie heard:", message)
}

// Send sends a message via the mediator
func (c *ComponentCharlie) Send(message string) {
 fmt.Println("🔉 Charlie talks:", message)
 c.mediator.Send(message, c)
}

func (c *ComponentCharlie) Name() string {
 return "Charlie"
}

// ComponentDave is another colleague similar to the others
type ComponentDave struct {
 mediator Mediator
}

// Notify handles messages sent to ComponentDave
func (c *ComponentDave) Notify(message string) {
 fmt.Println("👂 Dave heard:", message)
}

// Send sends a message via the mediator
func (c *ComponentDave) Send(message string) {
 fmt.Println("🔉 Dave talks:", message)
 c.mediator.Send(message, c)
}

func (c *ComponentDave) Name() string {
 return "Dave"
}

func shuffleString(s string) string {
 // Convert string to a slice of runes to handle multi-byte characters
 r := []rune(s)

 rand.Shuffle(len(r), func(i, j int) {
  r[i], r[j] = r[j], r[i]
 })

 return string(r)
}

func main() {
 mediator := &ConcreteMediator{}

 alice := &ComponentAlice{mediator}
 bob := &ComponentBob{mediator}
 charlie := &ComponentCharlie{mediator}
 dave := &ComponentDave{mediator}

 mediator.RegisterColleague("Alice", alice)
 mediator.RegisterColleague("Bob", bob)
 mediator.RegisterColleague("Charlie", charlie)
 mediator.RegisterColleague("Dave", dave)

 // Nobody is subscribed to anyone yet, so no messages will be received
 alice.Send("Anyone here?")

 mediator.Subscribe("Alice", []Colleague{bob, charlie, dave}) // Alice sends to them
 mediator.Subscribe("Bob", []Colleague{alice, charlie})       // Bob sends to them
 mediator.Subscribe("Charlie", []Colleague{alice, bob})       // Charlie sends to them
 mediator.Subscribe("Dave", []Colleague{alice})               // Dave sends to Alice

 alice.Send("Hi, I'm Alice!")
 bob.Send("Hi, I'm Bob!")
 charlie.Send("Hi, I'm Charlie!")
 dave.Send("Hi, I'm Dave!")

 mediator.Unsubscribe("Alice", []Colleague{bob, charlie}) // Alice no longer sends to them
 alice.Send("I'm outta here!")

 // Output:
 /*
  🔉 Alice talks: Anyone here?
  🔉 Alice talks: Hi, I'm Alice!
  🦻 Bob heard: ,ciAleI'H mi !
  👂 Charlie heard: Hi, I'm Alice!
  👂 Dave heard: Hi, I'm Alice!
  📣 Bob talks: i B'!bIHmo,
  👂 Alice heard: Hi, I'm Bob!
  👂 Charlie heard: Hi, I'm Bob!
  🔉 Charlie talks: Hi, I'm Charlie!
  👂 Alice heard: Hi, I'm Charlie!
  🦻 Bob heard: ' aiemH !CIli,hr
  🔉 Dave talks: Hi, I'm Dave!
  👂 Alice heard: Hi, I'm Dave!
  ❌ Unsubscribing Bob, Charlie from Alice
  🔉 Alice talks: I'm outta here!
  👂 Dave heard: I'm outta here!
 */
}
```

### Memento (Snapshot)

- Analogy
    - The "undo" and "redo" buttons of a text editor (save and restore state) or the "rollback" feature of a database.
- When to use it
    - When there is a need to restore an object back to its previous state (e.g. "undo" or "rollback" operations), without violating encapsulation.
- Implementation
    - **Originator**: The object whose state needs to be saved and restored.
    - **Memento**: An object that encapsulates the state of the originator at a particular time, which is usually immutable once constructed.
    - **Caretaker**: An object that keeps track of the mementos but does not operate on or examine the contents of a memento. It is responsible for knowing when and why to save and restore the originator's state.
    - In languages supporting nested classes, the **Memento** can be nested inside the **Originator**.
        - This way, the caretaker can't access the memento directly, and the originator can access the memento's fields directly.
    - In other languages like Go which don't even have classes, the implementation can be based on an intermediate interface.
        - This makes the fields of the memento struct public.
        - There is another approach to restrict access:
            - **Originator Interface**: This defines the high-level interface for creating a memento and restoring the Originator's state from a memento. However, it does not expose internal state details.
            - **ConcreteOriginator**: Implements the Originator interface and contains the internal state that needs to be saved and restored. It knows how to save its internal state to a **Memento** and restore it, but these Mementos are opaque to the outside world. In Go, this would be defined in a separate package to restrict access to the internal state.
            - **Memento Interface**: Provides a very restricted interface that might only allow the **Memento** to be passed around but not altered or viewed (no getters for the state, for instance). In Go, this would be an empty struct to prevent any access to the internal state.
            - **ConcreteMemento**: Implements the **Memento** interface and stores the internal state of the **ConcreteOriginator**. The **ConcreteMemento** is typically a private or inner class of the **ConcreteOriginator**, ensuring that only the **ConcreteOriginator** can access the internal state stored within the **Memento**. In Go, this would be a struct with unexported fields and it would be present in the same package as the **ConcreteOriginator**.
            - **Caretaker**: Manages the mementos without knowing their content or structure. It can request a **Memento** from the **Originator** and store it, and it can pass a Memento back to the Originator for state restoration, but it cannot access the state stored inside the Memento.
- Pros
    - The internal state of the originator is saved externally without breaking encapsulation.
    - The originator doesn't need to keep versions of its state, simplifying its code.
    - It enables the implementation of undo mechanisms in a relatively straightforward manner.
- Cons
    - It can be resource-intensive if the originator's state is large or if there are many mementos stored (_think of GIMP or Photoshop when working with large images and a growing undo stack_!).
    - It adds complexity to the code, particularly in managing the lifecycle and permissions of mementos.
    - The caretaker must manage the lifetimes of mementos carefully to avoid excessive memory use (hidden implementation costs).
- Relation to other patterns
    - **Memento** can be used in conjunction with the **Command** pattern to store state for undoable commands.
    - It can store the state of an **Iterator**, allowing it to return to a specific point in the iteration.
    - Both **Memento** and **Prototype** involve creating a copy of an object, but for different purposes: Prototype for creating a duplicate object; Memento for saving state.

```go
package main

import "fmt"

// Memento is a snapshot of the originator's state
type Memento struct {
 state string
}

// Originator is the object whose state needs to be saved
type originator struct {
 state string
}

// setState updates the state of the originator
func (o *originator) setState(state string) {
 o.state = state
}

// saveStateToMemento saves the current state to a memento
func (o *originator) saveStateToMemento() *Memento {
 return &Memento{state: o.state}
}

// restoreStateFromMemento restores the state from a memento
func (o *originator) restoreStateFromMemento(m *Memento) {
 o.state = m.state
}

// Caretaker could also be a single stack with an index to move back and forth
type Caretaker struct {
 undoStack []*Memento
 redoStack []*Memento
}

// saveState saves the current state of the originator to the undoStack of the caretaker
func (c *Caretaker) saveState(o *originator) {
 m := o.saveStateToMemento()
 c.undoStack = append(c.undoStack, m) // Save the current state before changing it
}

// changeState changes the state of the originator and saves the current state to the undoStack of the caretaker
func (c *Caretaker) changeState(o *originator, newState string) {
 c.saveState(o) // Save the current state before making a change
 o.setState(newState)
}

// undo restores the state of the originator to the previous state, if any
func (c *Caretaker) undo(o *originator) {
 if len(c.undoStack) == 0 {
  return
 }

 lastIndex := len(c.undoStack) - 1
 memento := c.undoStack[lastIndex]
 c.undoStack = c.undoStack[:lastIndex] // Pop from undoStack

 c.redoStack = append(c.redoStack, o.saveStateToMemento()) // Save the current state to redoStack before undoing
 o.restoreStateFromMemento(memento)
}

// redo restores the state of the originator to the next state, if any
func (c *Caretaker) redo(o *originator) {
 if len(c.redoStack) == 0 {
  return
 }

 lastIndex := len(c.redoStack) - 1
 memento := c.redoStack[lastIndex]
 c.redoStack = c.redoStack[:lastIndex] // Pop from redoStack

 c.undoStack = append(c.undoStack, o.saveStateToMemento()) // Save the current state to undoStack before redoing
 o.restoreStateFromMemento(memento)
}

func main() {
 originator := &originator{}
 caretaker := &Caretaker{}

 // Initial state is saved
 caretaker.saveState(originator)

 // Changes to the originator are made through the Caretaker to ensure states are saved
 caretaker.changeState(originator, "State #1")
 caretaker.changeState(originator, "State #2")
 caretaker.changeState(originator, "State #3")

 fmt.Println("Current State:", originator.state)

 caretaker.undo(originator)
 fmt.Println("State after undo:", originator.state)

 caretaker.undo(originator)
 fmt.Println("State after second undo:", originator.state)

 caretaker.undo(originator)
 fmt.Println("State after third undo:", originator.state)

 caretaker.redo(originator)
 fmt.Println("State after redo:", originator.state)

 caretaker.redo(originator)
 fmt.Println("State after second redo:", originator.state)

 caretaker.redo(originator)
 fmt.Println("State after third redo:", originator.state)

 caretaker.redo(originator)
 fmt.Println("State after fourth redo:", originator.state)

 caretaker.undo(originator)
 fmt.Println("State after undo:", originator.state)

 // Output:
 /*
  Current State: State #3
  State after undo: State #2
  State after second undo: State #1
  State after third undo:
  State after redo: State #1
  State after second redo: State #2
  State after third redo: State #3
  State after fourth redo: State #3
  State after undo: State #2
 */
}
```

### Observer (Event-Subscriber, Listener)

- Analogy
    - A newspaper publisher (subject) has a list of subscribers (observers) who want to be notified when a new issue is published.
- When to use it
    - To create a subscription mechanism that allows multiple objects to listen and react to events happening in another object, known as the _subject_.
    - For implementing distributed event handling systems, in scenarios where an object needs to notify other objects about its state changes without being dependent on them.
- Implementation
    - **Subject Interface (Publisher)**: Defines the interface for attaching, detaching, and notifying observers. It contains a list of subscribers with methods like `subscribe`, `unsubscribe`, and `notify`.
        - **Concrete Subject**: Maintains the state of the object and notifies observers when the state changes.
    - **Observer Interface (Subscriber)**: Defines the interface for receiving updates from the _subject_ (usually just an `update` method).
        - **Concrete Observers**: Implements the _observer interface_ and keeps a reference to the _subject_ so that they can automatically update themselves in response to state changes.
- Pros
    - The _subject_ doesn't need to know anything about the _observers_, other than they implement the **Observer interface** (loose coupling).
    - Subscribers/observers can be managed at runtime by the client.
    - Changes in the _subject_ are effectively broadcasted to all interested observers.
- Cons
    - If there are many observers or if the updates are frequent, the system can become overwhelmed. Besides, the order of updates could be unpredictable.
    - Care must be taken to properly manage observer registration and deregistration to avoid memory leaks.
- Relation to other patterns
    - **Observer** resembles closely to the **Mediator** pattern. While it can be used to implement distributed event handling systems, **Mediator** is more focused on centralizing communication between objects.
    - The **Observer** pattern can use the **Singleton** pattern to implement a central registry of observers.

```go
package main

import (
 "fmt"
 "strconv"
 "sync"
)

// Subject is implemented implicitly by WeatherData: it's not needed here
type Subject interface {
 RegisterObserver(o Observer)
 RemoveObserver(o Observer)
 NotifyObservers()
}

// WeatherConditions is the data that will be sent to the observers
type WeatherConditions struct {
 Humidity    float64
 Pressure    float64
 Temperature float64
}

// WeatherData is the subject/publisher that will notify the observers/subscribers
type WeatherData struct {
 observers  []Observer
 conditions WeatherConditions
}

// RegisterObserver adds an observer to the list of observers
func (w *WeatherData) RegisterObserver(o Observer) {
 w.observers = append(w.observers, o)
}

// RemoveObserver removes an observer from the list of observers
func (w *WeatherData) RemoveObserver(o Observer) {
 for i, observer := range w.observers {
  if observer == o {
   w.observers = append(w.observers[:i], w.observers[i+1:]...)
   break
  }
 }
}

// NotifyObservers sends the data to all the observers
// Using goroutines, this will notify in random order
func (w *WeatherData) NotifyObservers() {
 var wg sync.WaitGroup
 for _, observer := range w.observers {
  wg.Add(1)
  go func(o Observer) {
   defer wg.Done() // Ensure the WaitGroup counter decrements
   o.Update(w.conditions)
  }(observer)
 }
 wg.Wait()
}

// SetMeasurementsAndNotify sets the weather conditions and notifies the observers
func (w *WeatherData) SetMeasurementsAndNotify(conditions WeatherConditions) {
 w.conditions = conditions
 w.NotifyObservers()
}

// Observer is the interface that observers must implement
type Observer interface {
 Update(conditions WeatherConditions)
}

// CurrentConditionsDisplay is an observer that displays the current conditions
type CurrentConditionsDisplay struct {
 weatherData *WeatherData
}

// NewCurrentConditionsDisplay creates a new CurrentConditionsDisplay and registers it with the WeatherData
func NewCurrentConditionsDisplay(weatherData *WeatherData) *CurrentConditionsDisplay {
 display := &CurrentConditionsDisplay{weatherData: weatherData}
 weatherData.RegisterObserver(display)
 return display
}

// Update is called by the WeatherData when the conditions change
func (c *CurrentConditionsDisplay) Update(conditions WeatherConditions) {
 fmt.Printf("[fancy display] Current conditions: %.2fF degrees, %.2f%% humidity, %.2f pressure\n",
  conditions.Temperature,
  conditions.Humidity,
  conditions.Pressure,
 )
}

// TemperatureDisplay is an observer that displays only the temperature
type TemperatureDisplay struct {
 weatherData *WeatherData
}

// NewTemperatureDisplay creates a new TemperatureDisplay and registers it with the WeatherData
func NewTemperatureDisplay(weatherData *WeatherData) *TemperatureDisplay {
 display := &TemperatureDisplay{weatherData: weatherData}
 weatherData.RegisterObserver(display)
 return display
}

// Update is called by the WeatherData when the conditions change
func (t *TemperatureDisplay) Update(conditions WeatherConditions) {
 fmt.Printf("[simple display] Temperature: %s degrees\n", strconv.FormatFloat(conditions.Temperature, 'f', 0, 32))
}

func main() {
 weatherData := &WeatherData{}

 NewCurrentConditionsDisplay(weatherData)
 NewTemperatureDisplay(weatherData)

 weatherData.SetMeasurementsAndNotify(WeatherConditions{Temperature: 70, Humidity: 65, Pressure: 30.4})
 weatherData.SetMeasurementsAndNotify(WeatherConditions{Temperature: 68, Humidity: 70, Pressure: 29.2})

 // Output:
 /*
  [fancy display] Current conditions: 70.00F degrees, 65.00% humidity, 30.40 pressure
  [simple display] Temperature: 70 degrees
  [simple display] Temperature: 68 degrees
  [fancy display] Current conditions: 68.00F degrees, 70.00% humidity, 29.20 pressure
 */
}
```

### State

- Analogy
    - A smartphone can be in different states: locked, unlocked, charging, etc. For example, when it's locked, pressing the home button doesn't do anything, but when it's unlocked, pressing it goes to the home screen.
- When to use it
    - To allow an object to alter its behavior when its internal state changes. This pattern encapsulates state-specific behavior within state objects, making an object's behavior dependent on its state.
    - For implementing finite state machines in a more organized and maintainable way (i.e., refactor large `if-else`/`switch` constructs).
    - When the number of states is large, and the state-specific behavior changes frequently.
- Implementation
    - **State Interface**: Defines a common interface for all concrete state classes, encapsulating the state-specific behavior.
    - **Concrete State Classes**: Implement the **State interface** and provide the implementation for the state-specific behavior.
    - **Context Class**: Maintains an instance of a **ConcreteState** subclass that defines the current state and delegates state-specific behavior to the current state object.
- Pros
    - **Single Responsibility Principle**: Each state is encapsulated in its own class.
    - **Open/Closed Principle**: It is easy to add new states without changing the context or other states.
    - Reduces complex conditional logic in the context by encapsulating state-specific behavior.
- Cons
    - Can lead to an increase in the number of classes and boilerplate code.
    - The context must carefully manage state objects and transitions, which can get complex.
    - Overkill for a simple state machine which doesn't change much.
- Relation to other patterns
    - While **Strategy** usually changes the algorithm used by the context (objects being unaware of each other), **State** changes the behavior of the context based on its internal state.
    - **State** can be used to change the behavior of **Commands** based on the state of the system.

```go
package main

import (
 "fmt"
 "sync"
 "time"
)

// State is the interface for the vending machine states
type State interface {
 CancelTransaction()
 DispenseItem()
 InsertMoney(amount int)
}

// ReadyState allows item dispensing if there's sufficient balance
type ReadyState struct {
 machine *VendingMachine
}

// InsertMoney adds money to the vending machine balance
func (rs *ReadyState) InsertMoney(amount int) {
 fmt.Printf("🪙 Inserted $%d\n", amount)
 rs.machine.balance += amount
}

// DispenseItem dispenses an item if there's sufficient balance
// and the machine has items in stock
func (rs *ReadyState) DispenseItem() {
 if rs.machine.balance < rs.machine.itemPrice {
  fmt.Println("🚨 Tried to dispense... Insufficient balance!")
  return
 }

 rs.machine.setState(rs.machine.busyDispensingState)
 fmt.Println("🥫 Dispensing $2 item...")

 time.Sleep(1 * time.Second / 5) // Simulate the dispensing process

 rs.machine.balance -= rs.machine.itemPrice
 rs.machine.itemCount--

 fmt.Println("✅ Item dispensed.")

 if rs.machine.balance > 0 {
  fmt.Println("💵 Returning change of $" + fmt.Sprint(rs.machine.balance))
  rs.machine.balance = 0
 }

 if rs.machine.itemCount == 0 {
  fmt.Println("0️⃣ Out of stock!")
  rs.machine.setState(rs.machine.outOfStockState)
 } else {
  rs.machine.setState(rs.machine.readyState)
 }
}

// CancelTransaction does nothing when the machine is ready
// and there's no transaction to cancel, and it refunds the balance
// when there's a pending transaction
func (rs *ReadyState) CancelTransaction() {
 if rs.machine.balance > 0 {
  fmt.Printf("❌ Cancelling transaction, returning $%d\n", rs.machine.balance)
  rs.machine.balance = 0
  return
 }
 fmt.Println("⚠️ No transaction to cancel.")
}

// OutOfStockState prevents item dispensing
type OutOfStockState struct {
 machine *VendingMachine
}

// InsertMoney does nothing when the machine is out of stock
func (oos *OutOfStockState) InsertMoney(amount int) {
 fmt.Println("🔴 Machine out of stock. Money insertion is futile.")
}

// DispenseItem does nothing when the machine is out of stock
func (oos *OutOfStockState) DispenseItem() {
 fmt.Println("🔴 Machine out of stock. Unable to dispense.")
}

// CancelTransaction does nothing when the machine is out of stock
func (oos *OutOfStockState) CancelTransaction() {
 fmt.Println("🔴 Machine out of stock. No transaction to cancel.")
}

// BusyDispensingState prevents further item dispensing and money insertion
type BusyDispensingState struct {
 machine *VendingMachine
}

func (bd *BusyDispensingState) BusyDispensing() {
 fmt.Println("🛑 Dispensing...")
}

// InsertMoney returns the money when the machine is busy dispensing
func (bd *BusyDispensingState) InsertMoney(amount int) {
 fmt.Println("🛑 Busy dispensing. Money insertion is futile.")
}

// DispenseItem does nothing when the machine is busy dispensing
func (bd *BusyDispensingState) DispenseItem() {
 fmt.Println("🛑 Already dispensing, be patient!")
}

// CancelTransaction does nothing when the machine is busy dispensing
func (bd *BusyDispensingState) CancelTransaction() {
 fmt.Println("🛑 Busy dispensing. No transaction to cancel.")
}

// VendingMachine is the context for the state pattern
// in which all states are defined
type VendingMachine struct {
 busyDispensingState State
 readyState          State
 outOfStockState     State
 currentState        State
 itemCount           int
 balance             int
 itemPrice           int
}

// NewVendingMachine creates a new vending machine
func NewVendingMachine(itemCount, itemPrice int) *VendingMachine {
 vm := &VendingMachine{
  itemCount: itemCount,
  itemPrice: itemPrice,
 }
 readyState := &ReadyState{machine: vm}
 outOfStockState := &OutOfStockState{machine: vm}
 busyDispensingState := &BusyDispensingState{machine: vm}

 vm.busyDispensingState = busyDispensingState
 vm.readyState = readyState
 vm.outOfStockState = outOfStockState
 vm.setState(readyState)

 return vm
}

// InsertMoney adds money to the vending machine balance
func (vm *VendingMachine) InsertMoney(amount int) {
 vm.currentState.InsertMoney(amount)
}

// DispenseItem dispenses an item if there's sufficient balance
func (vm *VendingMachine) DispenseItem() {
 vm.currentState.DispenseItem()
 if vm.itemCount == 0 {
  vm.setState(vm.outOfStockState)
 }
}

// setState changes the current state of the vending machine
func (vm *VendingMachine) setState(state State) {
 vm.currentState = state
}

func (vm *VendingMachine) CancelTransaction() {
 fmt.Println("❌ Cancelling transaction...")
 vm.currentState.CancelTransaction()
}

func main() {
 vendingMachine := NewVendingMachine(10, 2) // 10 items, $2 each

 fmt.Println("Buying 3 items...")
 vendingMachine.InsertMoney(2)
 vendingMachine.DispenseItem()
 vendingMachine.InsertMoney(2)
 vendingMachine.DispenseItem()
 vendingMachine.InsertMoney(5)
 vendingMachine.DispenseItem()

 fmt.Println("\nTrying to buy an item with insufficient balance...")
 vendingMachine.InsertMoney(1)
 vendingMachine.DispenseItem() // Fails
 vendingMachine.CancelTransaction()

 fmt.Println("\nBuying 1 item with extra money...")
 vendingMachine.InsertMoney(5)
 vendingMachine.DispenseItem()

 fmt.Println("\nTrying to dispense multiple times in quick succession won't break the machine...")
 vendingMachine.InsertMoney(5)
 var wg sync.WaitGroup
 for i := 0; i < 3; i++ {
  wg.Add(1)
  go func() {
   defer wg.Done()
   vendingMachine.InsertMoney(5)
   vendingMachine.DispenseItem()
   vendingMachine.CancelTransaction()
  }()
  wg.Wait()
 }

 // Output:
 /*
  Buying 3 items...
  🪙 Inserted $2
  🥫 Dispensing $2 item...
  ✅ Item dispensed.
  🪙 Inserted $2
  🥫 Dispensing $2 item...
  ✅ Item dispensed.
  🪙 Inserted $5
  🥫 Dispensing $2 item...
  ✅ Item dispensed.
  💵 Returning change of $3

  Trying to buy an item with insufficient balance...
  🪙 Inserted $1
  🚨 Tried to dispense... Insufficient balance!
  ❌ Cancelling transaction...
  ❌ Cancelling transaction, returning $1

  Buying 1 item with extra money...
  🪙 Inserted $5
  🥫 Dispensing $2 item...
  ✅ Item dispensed.
  💵 Returning change of $3

  Trying to dispense multiple times in quick succession won't break the machine...
  🪙 Inserted $5
  🪙 Inserted $5
  🥫 Dispensing $2 item...
  ✅ Item dispensed.
  💵 Returning change of $8
  ❌ Cancelling transaction...
  ⚠️ No transaction to cancel.
  🪙 Inserted $5
  🥫 Dispensing $2 item...
  ✅ Item dispensed.
  💵 Returning change of $3
  ❌ Cancelling transaction...
  ⚠️ No transaction to cancel.
  🪙 Inserted $5
  🥫 Dispensing $2 item...
  ✅ Item dispensed.
  💵 Returning change of $3
  ❌ Cancelling transaction...
  ⚠️ No transaction to cancel.
 */
}
```

### Strategy

- Analogy
    - Choosing a transportation method in Google Maps: walking; driving; cycling or public transport. Each method is a strategy selected via a button in the UI. The goal is to reach a given destination, but the method of transportation can vary, and so will the algorithm calculating the route.
- When to use it
    - To define a family of algorithms, encapsulate each one, and make them interchangeable (e.g., different text parsers classes implementing the same methods but providing different results).
    - Strategy lets the algorithm vary independently from clients that use it.
    - When there are multiple ways of doing something and there's a need to switch between these methods easily at runtime.
- Implementation
    - **Strategy Interface**: This defines a common interface for all concrete strategies to implement.
    - **Concrete Strategies**: Implement the **Strategy Interface** with specific algorithmic implementations.
    - **Context Class**: Maintains a reference to a strategy object and delegates it the responsibility of executing the algorithm. The context is configured with a **ConcreteStrategy** object and may define an interface that lets the strategy access its data.
- Pros
    - Allows dynamically changing the behavior of an object.
    - Encapsulates algorithm implementations from the core business logic.
    - Promotes the reuse of individual strategies across different contexts.
- Cons
    - Introduces multiple classes and interfaces, which increases complexity.
    - Clients must understand how strategies differ (and be aware of their existence) to select the appropriate one.
- Relation to other patterns
    - **Factory Method** is often used with **Strategy** to instantiate the appropriate _ConcreteStrategy_.
    - **State** has a similar structure to **Strategy**. While Strategy changes the behavior of a context, State's behavior change is more intrinsic to the context's state.
    - **Command** can be seen as a specialization of **Strategy**, with the strategy being parameterized with actions to execute.

```go
package main

import "fmt"

// Formatter is the strategy interface
type Formatter interface {
 Format(text string) string
}

// MarkdownFormatter formats text with Markdown syntax
type MarkdownFormatter struct{}

// Format formats text with Markdown syntax
func (m *MarkdownFormatter) Format(text string) string {
 return fmt.Sprintf("**%s**", text)
}

// HTMLFormatter formats text with HTML tags
type HTMLFormatter struct{}

// Format formats text with HTML tags
func (h *HTMLFormatter) Format(text string) string {
 return fmt.Sprintf("<strong>%s</strong>", text)
}

// CustomFormatter formats text with custom syntax
type CustomFormatter struct{}

// Format formats text with custom syntax
func (c *CustomFormatter) Format(text string) string {
 return fmt.Sprintf("[[[ %s ]]]", text)
}

// TextEditor is the context inside which the strategy is used
type TextEditor struct {
 formatter Formatter
}

// SetFormatter sets the formatter
func (t *TextEditor) SetFormatter(formatter Formatter) {
 t.formatter = formatter
}

// PublishText publishes the text using the selected formatter
func (t *TextEditor) PublishText(text string) {
 fmt.Println(t.formatter.Format(text))
}

func main() {
 editor := &TextEditor{}

 // Using Markdown formatter
 markdownFormatter := &MarkdownFormatter{}
 editor.SetFormatter(markdownFormatter)
 editor.PublishText("Choosing the Markdown strategy")

 // Switching to HTML formatter
 htmlFormatter := &HTMLFormatter{}
 editor.SetFormatter(htmlFormatter)
 editor.PublishText("Choosing the HTML strategy")

 // Switching to Custom formatter
 customFormatter := &CustomFormatter{}
 editor.SetFormatter(customFormatter)
 editor.PublishText("Choosing the Custom strategy")

 // Output:
 /*
  **Choosing the Markdown strategy**
  <strong>Choosing the HTML strategy</strong>
  [[[ Choosing the Custom strategy ]]]
 */
}
```

### Template method

- Analogy
    - A recipe for baking a cake: the steps are roughly the same for all cakes, but the ingredients and some steps can vary.
- When to use it
    - To define the skeleton of an algorithm in the superclass while letting subclasses override specific steps of the algorithm without changing its structure.
    - When multiple subclasses should implement a similar algorithm with some slight differences in certain steps. Hooks can be used to provide optional parts of the algorithm that subclasses might or might not override.
- Implementation
    - **Abstract Class** / **Interface** with **Template Method**: Defines the template method, which is a method that outlines the algorithm's steps, some of which can be default implementations (_concrete methods_) or abstract methods (_hooks_) that subclasses will override.
    - **Concrete Class**: Implements the abstract methods (hooks) defined in the abstract class, thereby providing specific behavior for the steps that vary between different subclasses.
- Pros
    - Promotes reusing code by extracting common behavior into a superclass.
    - Subclasses can override certain steps of the algorithm without changing its structure.
    - The superclass can control the algorithm's structure while allowing subclass-specific behavior.
- Cons
    - Requires _inheritance_. This is not a problem in languages like Java, but it can be a limitation in languages that don't have classes, such as Go.
    - Subclasses can only change certain parts of the algorithm, not the overall structure or order of steps.
- Relation to other patterns
    - Both **Template Method** and **Strategy** can encapsulate algorithms. The key difference is that Strategy uses composition to change parts of the algorithm, while Template Method uses inheritance.
    - **Factory Method** is often used as a step in a **Template Method**, particularly when creating objects that need to vary by subclass.

```go
package main

import "fmt"

type GameAI interface {
 TakeTurn()
 CollectResources()
 BuildStructures()
 BuildUnits()
 Attack()
}

// BaseAI provides default implementations for some methods and leaves others as hooks.
type BaseAI struct {
 GameAI // Embedding the interface for polymorphism
}

func (ai *BaseAI) TakeTurn() {
 ai.CollectResources()
 ai.BuildStructures()
 ai.BuildUnits()
 ai.Attack()
}

func (ai *BaseAI) CollectResources() {
 fmt.Println("Collecting resources...")
}

func (ai *BaseAI) BuildStructures() {
 // Default implementation: Do nothing.
 // This acts as a hook method that can be overridden.
}

func (ai *BaseAI) BuildUnits() {
 // Hook method
}

type WolfAI struct {
 BaseAI
}

func (orc *WolfAI) BuildStructures() {
 fmt.Println("Building Wolf structures...")
}

func (orc *WolfAI) Attack() {
 fmt.Println("Wolves attacking!")
}

func (orc *WolfAI) BuildUnits() {
 fmt.Println("Training Wolf units...")
}

func main() {
 wolfAI := &WolfAI{}
 wolfAI.BaseAI.GameAI = wolfAI // Link for polymorphism

 wolfAI.TakeTurn() // Executes the algorithm, with some steps overridden by WolfAI

 // Output:
 /*
  Collecting resources...
  Wolves attacking!
 */
}
```

### Visitor

- Analogy
    - A tax auditor visiting different businesses to calculate their taxes.
- When to use it
    - To separate algorithms from the objects on which they operate, allowing for new operations to be added to these objects without modifying their classes.
    - When dealing with a fixed set of object structures but needing to extend their functionality dynamically.
- Implementation
    - **Element Interface**: Defines an `Accept` method that takes a _visitor_ and allows the visitor to perform some operation on the _element_.
    - **Concrete Element Classes**: Implement the **Element Interface** and define the `Accept` method. The `Accept` method calls the _visitor_'s method that's designed to handle the _element_.
    - **Visitor Interface**: Defines a method for each type of concrete _element_ in the object structure that the _visitor_ can operate on.
    - **Concrete Visitor Classes**: Implement the **Visitor interface**, providing the implementation for each operation on the concrete _elements_.
- Pros
    - Keeps algorithm implementations separate from the classes of the objects they operate on.
    - Makes it easy to add new operations without modifying the classes of the elements.
    - Each visitor class encapsulates related operations, adhering to the _Single Responsibility Principle_.
- Cons
    - Requires changing all visitor classes when a new _Element_ class is added, which can be intrusive.
    - _Visitors_ often need access to the private internals of _Elements_, which can break encapsulation.
- Relation to other patterns
    - **Visitor** can be used to apply operations over **Composite** structures, making it easy to perform operations on complex tree structures.
    - **Visitor** and **Iterator** can be used together to traverse a complex data structure and perform operations on its elements.
    - **Visitor** is like a powerful version of **Command** pattern, where the visitor can perform multiple operations on the _element_.

```go
package main

import (
 "fmt"
 "math"
)

// Shape is the interface that all shapes must implement, which is done
// implicitly here.
type Shape interface {
 Accept(visitor Visitor)
}

// Circle is a shape that has a radius.
type Circle struct {
 Radius float64
}

// Accept allows a visitor to visit the circle.
func (c *Circle) Accept(visitor Visitor) {
 visitor.VisitCircle(c)
}

// Rectangle is a shape that has a width and height.
type Rectangle struct {
 Width, Height float64
}

// Accept allows a visitor to visit the rectangle.
func (r *Rectangle) Accept(visitor Visitor) {
 visitor.VisitRectangle(r)
}

// Visitor is the interface that all visitors must implement
type Visitor interface {
 VisitCircle(*Circle)
 VisitRectangle(*Rectangle)
}

// DrawVisitor is a visitor that can draw shapes.
type DrawVisitor struct{}

// VisitCircle draws a circle.
func (d *DrawVisitor) VisitCircle(c *Circle) {
 fmt.Printf("Drawing a circle with radius: %.2f\n", c.Radius)
}

// VisitRectangle draws a rectangle.
func (d *DrawVisitor) VisitRectangle(r *Rectangle) {
 fmt.Printf("Drawing a rectangle with width: %.2f and height: %.2f\n", r.Width, r.Height)
}

// AreaVisitor is a visitor that can calculate the area of shapes.
type AreaVisitor struct {
 Area float64
}

// VisitCircle calculates the area of a circle.
func (a *AreaVisitor) VisitCircle(c *Circle) {
 a.Area = math.Pi * c.Radius * c.Radius
}

// VisitRectangle calculates the area of a rectangle.
func (a *AreaVisitor) VisitRectangle(r *Rectangle) {
 a.Area = r.Width * r.Height
}

func main() {
 circle := &Circle{Radius: 5}
 rectangle := &Rectangle{Width: 3, Height: 4}

 drawVisitor := &DrawVisitor{}
 circle.Accept(drawVisitor)
 rectangle.Accept(drawVisitor)

 areaVisitor := &AreaVisitor{}
 circle.Accept(areaVisitor)
 fmt.Printf("Circle Area: %.2f\n", areaVisitor.Area)

 rectangle.Accept(areaVisitor)
 fmt.Printf("Rectangle Area: %.2f\n", areaVisitor.Area)

 // Output:
 /*
  Drawing a circle with radius: 5.00
  Drawing a rectangle with width: 3.00 and height: 4.00
  Circle Area: 78.54
  Rectangle Area: 12.00
 */
}
```

---

# Conclusion

Embarking on the journey through Object-Oriented Programming principles, Software Design Principles, and an array of design patterns, we've traversed the most common landscape of structured software design. From the encapsulation and abstraction of _OOP_ to the _SOLID_ foundations of software design, and through the diverse territories of _Creational_, _Structural_, and _Behavioral_ patterns, this book summary serves as a compass for developers navigating the complexities of software architecture. Whether you're refining your craft or laying the cornerstone of your development career, the insights and patterns presented by Alexander offer a blueprint for building software that stands the test of time, adaptable to the ever-evolving demands of technology and user needs. That was a very enjoyable read: recommended!

---

# Resources and references

[design-martin]: https://staff.cs.utu.fi/~jounsmed/doos_06/material/DesignPrinciplesAndPatterns.pdf
[dive]: https://refactoring.guru/design-patterns/book
[gang-of-four]: https://en.wikipedia.org/wiki/Design_Patterns
[patterns-fowler]: https://martinfowler.com/books/eaa.html
[refactoring-guru]: https://refactoring.guru

- [Design Patterns: Elements of Reusable Object-Oriented Software][gang-of-four].
- [Design Principles and Design Patterns][design-martin].
- [Dive into Design Patterns][dive].
- [Patterns of Enterprise Application Architecture][patterns-fowler].
- [Refactoring Guru][refactoring-guru].
