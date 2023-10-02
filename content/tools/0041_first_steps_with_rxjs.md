Title: First Steps with RxJS
Date: 2023-10-01 19:45
Tags: functional-programming, reactive-programming, rxjs, typescript
Slug: first-steps-with-rxjs
Authors: Sébastien Lavoie
Summary: An introduction to [RxJS](https://rxjs.dev/), a library for reactive programming in JavaScript/TypeScript. We'll cover core concepts like observables, operators, testing, and tips for managing asynchronous data flows.
Description: An introduction to RxJS, a library for reactive programming in JavaScript/TypeScript. We'll cover core concepts like observables, operators, testing, and tips for managing asynchronous data flows.

[TOC]

---

# Introduction

While building an [Excel add-in](https://learn.microsoft.com/en-us/office/dev/add-ins/excel/?view=excel-js-preview), I came across the need for a more reactive style of programming due to the asynchronous nature of the APIs and the unpredictability of some events occurring in the spreadsheet. RxJS is one of those frameworks that can help with that. It's a library for composing asynchronous and event-based programs by using observable sequences. It provides a set of operators to transform and combine streams of data. It's a powerful tool that can be used to manage complex flows of data in a declarative fashion. It's also a bit of a beast to learn, so I thought I'd share some of my notes and learnings along the way.

We'll first go over some basic concepts and terminology, move on to an attempt at depicting those various concepts, present common operators, touch upon reactive testing and then cover some tips and tricks.

---

# Basic concepts

- This is a push-based approach as opposed to a more common pull-based approach.
- The **Observer** design pattern is implemented.
- **Observables** are the **producers** of a **stream** (the **Subject**) that you can **subscribe** (listen) to.
    - They are "*cold*" by default, meaning they don't emit values until they are subscribed to.
    - They can deliver values *synchronously* and *asynchronously*.
    - They can be cancelled by *unsubscribing*.
- **Observers** are the **consumers** of data produced by observables. They "*subscribe*" via a **subscription** to the stream of events emitted by the observable.
    - They execute some code when a new value is received.
    - They implement `next`, `error` and/or `complete`.
    - The `next` method is called whenever a new value is emitted.
    - The `error` method is called whenever an error occurs with an emission from the observable.
    - The `complete` method is called whenever the observable is done, i.e. when no more values will be emitted from the stream in the future.
    - By default, this leads to **unicasting**, where a single subscription gets values from the producer.
- In the context of an Excel spreadsheet, we could think of the values from cells `A1` and `B1` as the producers of a stream of values that can be subscribed to by a cell `C1` -- the consumer -- to perform some calculations based on the values from `A1` and `B1` which could be updated over time (i.e., emitting new values in the stream of data).

In an imperative programming paradigm, we would write code that executes a series of steps to produce a result. In a reactive programming paradigm, we would write code that reacts to events as they occur. Here's a simple example to illustrate this:

```typescript
// Imperative approach
let a = 2;
let b = 3;
let c = a + b;
console.log(c); // 5

a = a + 1;
console.log(c); // 5: `a` was updated but `c` was not

c = a + b;
console.log(c); // 6: `c` was updated after `a` was updated

b = 5;
c = a + b;
console.log(c); // 8: `c` was updated after `b` was updated


// Reactive approach
import { Subject, combineLatest, map } from "rxjs";
const a$ = new Subject();
const b$ = new Subject();
const c$ = combineLatest([a$, b$]).pipe(map(([a, b]) => a + b));
c$.subscribe((c) => console.log(c));
a$.next(3); // logs nothing because b$ has not emitted yet
b$.next(4); // logs 7 at this point (latest a + b)
a$.next(4); // logs 8 at this point (latest a + b)
```

---

## Everything is a stream

What follows is a metaphorical drawing designed (as best as I could...) to help you understand the complex world of reactive programming with RxJS. It's not a one-to-one mapping but aims to give a general feel of how things interconnect.

Think of reactive programming as managing a complex water supply system for a bustling town and a high-tech factory. Water from the glacier (`Producer`) flows as a river (`Stream`) through a landscape filled with dams, turbines, and filters (`Operators`).

Town residents and the factory subscribe to this river to fulfill their water needs. A subscription is like turning on a valve at the pumping station to let the water flow into your pipeline.

Meanwhile, the factory refines the water and feeds it back into the system, acting like a `Subject` in RxJS. Natural calamities (or dirty, unfiltered water) disrupting the flow signify errors, while the dam's control room (`Schedulers`) regulates the rhythm of the entire system.

<div class="image">
<img src="{static}/images/posts/0041_first_steps_with_rxjs/everything_is_a_stream.svg" alt="Drawing representing most major concepts found in  RxJS" />
</div>

A simple drawing like that won't do justice to the complexity of the RxJS ecosystem. Let's nevertheless try to break down a bit more how concepts relate to each other.

- The **Producer** (glacier) is the source of the stream. It can be a user action, a network request, a timer, etc. There can be multiple sources of data emitting different types of values. In this example, there is a tributary (a smaller river) that feeds into the main river. By merging the two streams, we can get a single stream of data from both sources.
    - While it may be useful to merge different streams of data and transform them along the way, it is not necessary or always needed. In this drawing, the **ReplaySubject** merely captures raw data as it arrives from the river and makes it available to late subscribers.
- The **Stream** is the flow of data. It can be a single value or a sequence of values over time. Here, it may represent the flow of data throughout the whole application, where different events (mouse click, keyboard, etc.) are emitted from different sources (or components) and may be consumed in a modified fashion (e.g., keeping a single property from an object, filtering out some values, etc.).
    - Here, we have the town which subscribes to different streams that have been transformed already (electricity and water subscriptions). The town might be considered a **Consumer** of the stream and is the data that ends up being displayed in the UI or sent back to a server.
- **Operators** are functions that transform the stream. They can be used to filter, combine, or modify the data.
    - Our metaphor contains a couple of them. There's a water turbine -- representing a **transformation operator** -- that transforms water into electricity (maybe it's a `mergeMap` that creates a new observable and maps it to a different structure) or water filters -- representing the **filtering operators** -- that filter out unwanted particles (maybe it's a `filter` that removes some values from the stream).
- **Subscriptions** are the consumers of the stream. They can be used to listen to the stream and perform actions when new values are emitted.
    - For instance, when the water bottling company receives water via its pipe, it may modify the stream by adding minerals to it (e.g., `map` operator) and then bottle it up to deliver water. This creates a dependency chain where the bottling company is a consumer of the stream and a producer of a new stream that can be consumed by the town.
    - If we zoom in on the water bottling company section, we can see that the water delivery truck "subscribes" to the product of the company and will likely want to deliver a truckload of water bottles once it is full (e.g., `buffer` operator). If we look at the case where the truck delivers water with a giant container that happens to have a small leak, then we know that once the container starts filling with water, it will start leaking. This is akin to a **hot observable** where the stream starts emitting values immediately, even if there are no subscribers. We could say this is also a stream that uses the `throttleTime` operator to only emit values every 5 seconds, dropping a small amount of water in the process. Whether the container is nearly empty or full, it will still leak water every 5 seconds. This is different from a **cold observable** where the stream only starts emitting values once a subscriber is listening to it, such as when a well-functioning container is plugged into a destination to deliver water.
- **Subjects** are both producers and consumers. They can be used to multicast values to multiple subscribers.
    - The water purification factory consumes water from the stream: as such, it is an **observer** as it reacts to the input stream (`next`, `error`, `complete`), but it is also a **producer** (because it can `pipe` and consumers can `subscribe` to it) as it emits a new stream of data that can be consumed by the town. This is akin to a **multicast** where a single producer can emit values to multiple consumers. The factory processes the incoming stream and may re-process values (`retryWhen`) or discard them (`filter`) before emitting a new stream of purified data.
- **Schedulers** are used to control the timing of the stream. They can be used to delay, throttle, or debounce emissions.
    - In this thirsty scenario, we can see that if the dam's control room blocks the flow of water entirely, this will affect the whole system downstream. If the control room were to stop the flow of water at night and schedule it to resume in the morning, this would be akin to a **scheduler** that controls the timing of the stream. This is useful to avoid flooding the system with too much data at once, such as when a user types in a search box and we want to avoid making too many network requests at once. We can use a scheduler to throttle the stream of data to only emit values every 500 milliseconds, for instance, although in many cases we can directly rely on [time-based operators](#time-based).
- **Unicast** is a one-to-one mapping between the producer and the consumer. It's the default behavior of RxJS.
    - Assuming our dam blocks and redirects the entire stream coming from the glacier, then the initial part of the diagram would be a unicast with a single producer emitting values to a single consumer.
- **Multicast** is a one-to-many mapping between the producer and the consumers. It's the behavior of RxJS when using **Subjects**.
    - If we take each resident of the town to be a subscriber of the water purification factory, then we have a multicast where a single producer emits values to multiple consumers. Likewise, the power utility company is a consumer of the electricity stream and a producer of a new stream that can be consumed by the town.
- **Cold** observables are lazy and only start emitting values when subscribed to.
    - In the case of the pond, it is a cold observable that only starts emitting values when a subscriber is listening to it, such as when a pump is plugged into it or someone fills a bucket of water from it.
    - In the diagram, a person acts as an `AsyncSubject`: it will work for a time to get water from the pond, but once it's done, it will emit a single value (the last value, i.e., the bucket) to all subscribers (let's pretend for the sake of simplicity and for this metaphor to keep working that all subscribers effectively receive the exact same stream/value when it is emitted all at once). This is different from a `BehaviorSubject` where the last value is emitted to late subscribers upon subscription. Subscribers will not receive any values from an `AsyncSubject` until it completes and, as depicted, can also unsubscribe before the stream emits any value.
- **Hot** observables are eager and start emitting values immediately, even if there are no subscribers.
  - There is a part of the river that's identified near the bottom-left corner as a `hot observable`, because whether there are subscribers or not, it will keep emitting values. A `ReplaySubject` -- the cameraman -- was added to capture the values emitted from the river and make them available to late subscribers right upon subscription (e.g., when they watch it live on TV at some point).

My representation of the world may be flawed as I haven't gone out much since the pandemic. Yet, that drawing tried to encapsulate most of the RxJS ecosystem and to some extent, that of reactive programming.

---

# Operators

- Operators allow to hook into a stream, operate on it and even combine it with other streams.

## Creation

- They are standalone functions to create observables, such as `of`, `from`, `fromEvent`, `interval`, `timer` or `range`.
- You should always clean up subscriptions by unsubscribing when they're no longer needed to avoid memory leaks and unintended consequences.
- `fromEvent`
    - Can create observables from DOM events or Node.js streams.
- `of`
    - Values are emitted synchronously, one at a time.
- `from`
    - Values are emitted synchronously, looping through a provided iterable (i.e., object with a `length` property). Also works with promises (e.g., `from(fetch(url))`) or generators (`function* () { yield … }`).
- `interval` and `timer`
    - They can emit values over time as a timer, where `timer` is useful to specify a different delay on the first value being emitted (e.g., specifying the first argument to `timer` to be `0` to emit the first value immediately).
- `mapTo`
    - This is a shortcut to remap an input to a different output (e.g., a constant string).
- `filter`
    - It returns values when the evaluate to `true` from a function that itself returns a boolean value.
- `reduce`
    - It works exactly like `Array.reduce`. It will emit the final value once the observable completes. That means it needs a stop condition in the pipeline, such as reaching the end of a synchronous stream or taking a few values only from an infinite stream (e.g., `interval(1000).pipe(take(3), reduce((acc, curr) => acc + curr) …)`) to take the the sum of the first three values emitted after 3 seconds.
- `scan`
    - Just like `reduce` but emits every time the stream receives a new value, not just once the stream completes.
- `tap`
    - Used to *spy* on the observable source to perform side effects without affecting the underlying stream, which is useful when debugging to observe output values at different steps of the pipeline.

## Pipe

- Operators are comma-separated inside the `pipe` method that's called on the observable. Then, the `subscribe` method is called on the assembled pipeline with a given observer to start producing the values from the stream.
- The operators create a new observable at each step in a "pure" fashion, so that the original observable does not change. Each operator in the pipe is akin to a different step in an assembly line.
- When `subscribe` is called, each operator in the pipe in turn subscribe to the observable and pass its value(s) along to the next operator in the pipeline.
- `map`
    - It's similar to `Array.map` but it works on every element emitted from the stream, not on the stream as a whole.
- `finalize`
    - It is called once on the completion of the observable, which could be used to perform some cleanup logic after an action completes, such as updating a status field.

## Filtering

- `take`
    - Accepts a given number of items from the source before completing.
- `first`
    - To `take` a single value based on a filtering condition.
- `takeWhile`
    - Emits values from the source observable as long as a predicate condition is met. A value of `true` can be passed to the second argument of the function signature of `takeWhile` to also emit the value that caused the stream to stop emitting. It is used to limit the lifetime of an observable based on a known condition to apply.
- `takeUntil`
    - It takes a value until another stream emits a value. It accepts as an argument another observable for this purpose.
- `distinctUntilChanged`
    - It will emit values only if they are distinct from the previously emitted value from the stream.
- `distinctUntilKeyChanged`
    - Will compare the previous value emitted with the current value to evaluate whether a given key of an object has changed.

## Time-based

- `debounceTime`
    - Useful when you need the last value emitted within a short period of time, discarding all previously emitted values until enough delay has passed.
- `debounce`
    - Does the same thing as `debounceTime`, but allows passing a function so that variables can be used to determine the emission of results.
- `throttleTime`
    - Ignore values after the last emission for a specified duration, creating a "silence window". It can help ignore spammy events by reacting after a certain time has passed only, such as listening for scroll events (e.g., do not process values instantly but rather every 20-30 ms).
    - We can use `asyncScheduler` as the second parameter to `throttleTime`, and give it a config object as the third argument to specify whether we're interested in emitting the `leading` (first) or `trailing` (last) event from the stream within the silence window (e.g., for a scroll event, we want to know the last position).
- `sampleTime`
    - It "samples" a time window to emit only the last value from that window, doing so at precise intervals.
- `auditTime`
    - This is like `sampleTime`, but starting a counter once the stream emits at least one value, keeping the last value emitted within the desired time window. This is the same as `throttleTime` where `leading` is set to `false` and `trailing` is set to `true`.

## Transformation

- One type of transformation operator is a flattening operator. This type of operator takes an observable that emits an observable to which RxJS internally subscribes to, simplifying the pipeline management. One such operator is `mergeAll`. Instead of mapping an emitted value to a new observable (e.g., with `Ajax.getJSON`) and then flattening the pipe to get the emitted value from that nested observable with `mergeAll`, we can do this in a single step with `mergeMap`.
- `mergeMap`
    - This is good for "fire and forget" type of behavior. For example, we may have an observable of click events from which we save the `clientX` and `clientY` coordinates, using these values to make an Ajax request that can perform an operation in the background which we do not want to cancel. Need to be careful with this as long-running observables may need cleanup.
- `switchMap`
    - While `mergeMap` can maintain any number of inner subscriptions at a time, `switchMap` will maintain a single one. Any time a new observable is mapped, the previous one is automatically completed. This is useful if a previous request needs to be cancelled where only the last request makes sense, such as in a type-ahead behavior where we don't want results from previous requests to be shown, but rather only the last one. This is the safest default for flattening because it won't create leaks like `mergeMap`, which will leave other inner observables running in the background unless they are explicitly completed.
        - Great for reset, pause and resume functionality.
        - Should avoid it when cancelling a request will have negative side effects, like saving a document.
- `concatMap`
    - Like `switchMap`, `concatMap` works on a single observable at a time, queuing up events (FIFO) from other observables until the first one completes. Should only be used when you have observables with a finite lifespan, otherwise the queue will never empty. This is useful when execution order of requests is important on the client side and when events will have a finite lifespan.
- `exhaustMap`
    - Only maintains one inner subscription at a time. It will ignore values from new events until the first observable completes, discarding those events while there's still an ongoing active subscription. This could be used to prevent further requests when clicking a button such as when submitting a form, effectively "disabling" the button while the submission is happening to avoid spamming the server with duplicate requests.
- `catchError`
    - By default, when an observable throws an error, it will stop emitting values as the errors are not handled. It can catch and return the error or return an empty observable to ignore the current value, which prevents the stream from breaking and will continue emitting values.

## Combination

- Can join multiple observables into a single stream, such as when you need to perform calculations based on multiple stream inputs.
- `startWith`
    - Lets you prepend any value(s) at the beginning of the stream.
- `endWith`
    - Lets you append any value(s) at the end of the stream.
- `concat`
    - Useful to execute multiple observables in order. When the first one finishes, the second one starts. That may come in handy to manage UI animations and to complete network requests in order.
- `merge`
    - Creates a single observable from any other number of observables. This means that it emits all values from all the observables as a single stream as they occur. For example, if we have a countdown related to both a "start" and a "pause" button, we might want the same stream to return "true" values when "start" is clicked and "false" values when "pause" is clicked to determine the next step to take in the pipeline.
- `combineLatest`
    - Takes two or more observables, combining the latest value received from each one only once all the observables have emitted at least one value. This would be useful when all values depend on each other to produce a common result.
- `forkJoin`
    - It emits the last produced value from each observable subscribed to as an array. This is like combineLatest, but returning values only once all streams have completed. The observables can be wrapped with brackets to emit an object, where a property (key) can be assigned to the result of each observable (set as a value of the object). This is somewhat equivalent to `Promise.all`.
- `share`
    - It is used to "share" the result of a stream to all subscribers. This can be useful to avoid running heavy computations more than once.

## Creating a custom operator

We can create a custom operator by creating a function that returns a function that accepts an observable and returns a new observable. While that might be a bit of an abstract explanation to follow, here is a basic example illustrating this concept.

```typescript
import { Observable } from 'rxjs';

export function multiplyBy(multiplier: number) {
  return (source: Observable<number>): Observable<number> =>
    new Observable((observer) => {
      const subscription = source.subscribe({
        next(value) {
          observer.next(value * multiplier);
        },
        error(err) {
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });

      return () => subscription.unsubscribe();
    });
}

// Usage:
import { of } from 'rxjs';
import { multiplyBy } from './multiplyBy';

of(1, 2, 3, 4, 5).pipe(multiplyBy(2)).subscribe((value) => console.log(value));
// logs 2, 4, 6, 8, 10
```

Here is another example combining `filter`, `map` and `reduce` to create a custom operator that will filter out values from a stream, map them to a new value and then reduce them to a single value.

```typescript
import { Observable, filter, map, reduce } from 'rxjs';

export function filterMapReduce<T, R>(
  predicate: (value: T) => boolean,
  mapFn: (value: T) => R,
  reduceFn: (acc: R, curr: R) => R
) {
  return (source: Observable<T>): Observable<R> =>
    source.pipe(
      filter(predicate),
      map(mapFn),
      reduce(reduceFn)
    );
}

// Usage:
import { of } from "rxjs";

of(1, 2, 3, 4, 5)
  .pipe(
    filterMapReduce(
        // keep only even numbers (2 and 4)
      (value) => value % 2 === 0,
        // multiply each of these even numbers by 2 (4 and 8)
      (value) => value * 2,
        // sum all these values
        // accumulator is initialized to 0
        // so we get 0 + 4 for the first value
        // then 4 + 8 for the second value, which is returned
      (acc, curr) => acc + curr
    )
  )
  .subscribe((value) => console.log(value)); // logs 12
```

---

# Marble diagrams

<div class="image">
<img src="{static}/images/posts/0041_first_steps_with_rxjs/marble_diagram.svg" alt="Showing a basic marble diagram with filter operator" />
</div>
<br />

- They are used to represent the behavior of operators. They can be used to test observables.
- They allow comparing at a glance how a set of inputs maps to a set of outputs (i.e., which transformations are applied to the source stream).
- An `X` represents an error and a vertical line `|` represents the end of emission of values from the input stream.

<br />
<div class="image">
<img src="{static}/images/posts/0041_first_steps_with_rxjs/marble_diagram_pipeline.svg" alt="Showing merging of streams with pipeline in the middle flowing towards a single output stream" />
</div>

---

# Subjects

- A **Subject** is an **Observable**: it has both `pipe` and `subscribe` methods. A Subject is also an **Observer**: it has `next`, `error` and `complete` methods. Unlike Observables which are unicast (1-to-1 mapping with observers, each observer gets an independent stream of data), Subjects are **multicast**, meaning they broadcast the same information to any "listeners" (observers).
- Multicasting operators include `share`, `shareReplay` and `multicast`.

## BehaviorSubject

- It allows delivering a seed/initial value to late subscribers such that a subscription happening at a later point can still receive the last emitted value upon subscribing.

## ReplaySubject

- It allows replaying the whole stream (or the last items desired via its first argument) to late subscribers, effectively providing a way to multicast (i.e., the stream is played only once and multiple subscribers can receive the values at once).
- `shareReplay`
    - This can be added to a pipeline and any subscriber to that stream will receive updates as if a ReplaySubject has been manually set up. For time sensitive matters where receiving a value too late isn't useful, a second argument can be passed to `shareReplay` to only capture events within the last `x` milliseconds.

## AsyncSubject

- Only emits the last value to all subscribers when it completes.

Here is a real-world example of a setup making use of a `BehaviorSubject` from an Excel add-in. The goal is to perform some actions in the UI whenever the connection status of a WebSocket changes by using a **subject**, which can be subscribed to from another part of the add-in to perform the needed updates. Omitting the details of the WebSocket connection, the following code snippet shows how we can use a `BehaviorSubject` to keep track of the connection status and emit the latest value to late subscribers.

```typescript
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';

export class ConnectionManager {
  private apiConnection$ = new BehaviorSubject<boolean>(false);
  private ws: WebSocket | null = null;

  // Expose connection status as an Observable emitting whenever the connection status changes
  get connectionStatus$(): Observable<boolean> {
    return this.apiConnection$.asObservable().pipe(distinctUntilChanged());
  }

  // ...

  private async connect(): Promise<void> {
    this.ws = new WebSocket('ws://localhost:8080/ws');

    this.ws.onopen = async () => {
      this.apiConnection$.next(true);
    };

    this.ws.onclose = async () => {
      this.apiConnection$.next(false);
    };

    this.ws.onerror = (error) => {
      // ...
    };
  }
}
```

In other words, we can subscribe to the `connectionStatus$` observable and react to changes in the connection status. This is useful to update the UI, for instance, to show a "*disconnected*" message when the connection is lost.

In a state manager, this might be dealt with like this to keep track of the sheets we have:

```typescript
sheetSubscriptions.set(sheetId, new Subject());  // track the sheet subscriptions

// ...
// delete the subscriptions to the sheet at some point in the future
sheetSubscriptions.get(sheetId).next(); // unsubscribe from all subscriptions for this sheet
```

The implementation details of the `sheetSubscriptions` map are omitted here, but the idea is that we can use a `Subject` to keep track of the subscriptions to a given sheet. When we want to unsubscribe from all subscriptions to a given sheet, we can call `next` on the subject to complete the stream and unsubscribe from all subscriptions.

---

# Schedulers

- All schedulers accept three arguments: `work` (task to execute), `delay` (in milliseconds) and `state` (when used, the first argument `work` defines the function to execute and `state` the data passed to it).
- Most basic observables (e.g., `range`) accept as the last argument a scheduler, so this can be set there (e.g., `range(1, 5, asapScheduler)`).
- `AsyncScheduler`
    - Can be used as an equivalent to setTimeout. It's simpler to just use the `delay` operator for that purpose. When used with `subscribeOn` in the pipeline, this is equivalent to wrapping the whole observable with setTimeout.
- `asapScheduler`
    - This is used to queue micro tasks, which are run after other synchronous pieces of code but before asynchronous code.
    - Micro tasks are run after the currently running synchronous code but will block the UI when run.
- `animationFrameScheduler`
    - This is similar to requestAnimationFrame. Set no delay or set it to `0` so that it will not be async and will update before every browser repaint.
- `queueScheduler`
    - It is synchronous by default. Inner calls to `queueScheduler` will be executed once the outer calls are done running.

While it's possible to use schedulers directly to provide fine-grained control over concurrency, it's often easier to use the `delay` operator to delay the emission of values from the stream. For instance, we can use `delay(1000)` to delay the emission of values by 1 second.

---

# Example flow

```typescript
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Observer,
  Subject,
  catchError,
  distinctUntilChanged,
  filter,
  from,
  of,
  switchMap,
  tap,
} from 'rxjs';

// Create a subject (stream emitting AND receiving values over time) with a default
// value. A common pattern is to suffix the variable name with a `$` to indicate that
// it's a stream
const stream1Subject$ = new BehaviorSubject<boolean>(false);

// Get the observable (stream emitting values over time) from the subject
// Doing this, we can `pipe` and `subscribe` to the observable but we can't emit values
// with `next`, `error` or `complete` methods.
// We can also use the subject directly to emit values with `next`, `error` or
// `complete`.
const stream1Observable$ = stream1Subject$.asObservable();

// Will use to send the final result of the status$ observable to this second stream
const stream2Subject$ = new BehaviorSubject<string>('');
const stream2Observable$ = stream2Subject$
  .asObservable()
  .pipe(filter((value: string): boolean => value !== '')); // ignore initial/empty values

const stream3ObservableForErrorsSubject$ = new Subject<string>();
const stream3ObservableForErrors$ =
  stream3ObservableForErrorsSubject$.asObservable();

// Some async operation that will update the connection status
const asyncFuncOnStatusChanged = async (
  isConnected: boolean
): Promise<void> => {
  // ... `await` some async operation to update the UI with the new connection status
  console.log(` -> onStatusChanged: ${isConnected}`);

  if (!isConnected) {
    throw new Error('Disconnected!');
  }
  return Promise.resolve();
};

// Create an observable (stream emitting values over time) from an another observable.
// The idea is to transform the original event into another event:
// event1 -> event2 -> event3 -> ... -> result
// Any observer on these events could push new values into other streams
// (e.g. `otherSubject$.next("value")`)
const observable1GetConnectionStatusChangedForRibbon$ = (
  connectionStatus$: Observable<boolean>
): Observable<void> => {
  // Transform the original event with `pipe`
  return connectionStatus$.pipe(
    // Prevent the observable from completing when an error is thrown
    catchError((error) => {
      console.log(`Caught error in observable1: ${error}`);
      return of(false);
    }),
    tap((value) => console.log(` -> observable start: ${value}`)),
    // If the value is the same as the previous one, don't emit it
    distinctUntilChanged(),
    // Perform side effects with `tap` (useful for logging/debugging)
    tap((value) => console.log(` -> observable before switchMap: ${value}`)),
    // Ensure async execution
    switchMap((value) =>
      from(asyncFuncOnStatusChanged(value)).pipe(
        // This will catch errors thrown by `asyncFuncOnStatusChanged` in a 'local' way.
        // We would still need to catch errors thrown directly from the source observable
        // as we did above
        catchError((error) => {
          console.log(`Caught error: ${error}`);
          // Emit the error to the third observable
          stream3ObservableForErrorsSubject$.next('error');
          // This completes the inner observable
          return EMPTY; // EMPTY is an observable that completes immediately
        })
      )
    )
  );
};

// In this case, we could just as well have used `status$` directly,
// but this could be useful if we want to transform the original event or if we want to
// merge multiple observables into one
const stream1ObservableTransformed$ =
  observable1GetConnectionStatusChangedForRibbon$(stream1Observable$);

// Create an observer (object with `next`, `error` and `complete` methods) to subscribe
// to the observable
const observer1 = (): Observer<void> => {
  console.log(' -> observer: subscription started');
  return {
    next: () => {
      console.log(' -> observer: status changed');
      // We could trigger another event here to continue the pipeline elsewhere, e.g.:
      // otherSubject$.next("value");
      // Then, if there's a subscription to `otherSubject$`, it will receive the value
      // "value" and continue the pipeline
    },
    error: (error) => {
      console.error(` -> observer: subscription errored: ${error}`);
    },
    complete: () => {
      console.log(
        ' -> observer: subscription completed, notifying stream2Subject$'
      );
      stream2Subject$.next(
        'observer1 sent this message to observer2 in `.complete()`!'
      );
    },
  };
};

console.log('Subscribing to secondObservable$...');
const observer2 = (): Observer<string> => {
  console.log(' -> observer2: subscription started');
  return {
    next: (value: string) => {
      console.log(` -> observer2: got '${value}'`);
    },
    error: (error) => {
      console.error(` -> observer2: subscription errored: ${error}`);
    },
    complete: () => {
      console.log(' -> observer2: subscription completed');
    },
  };
};
const stream2ObservableSubscription = stream2Observable$.subscribe(observer2());

console.log('\nSubscribing to thirdObservableForErrors$...');
const stream3ObservableSubscription$ = stream3ObservableForErrors$.subscribe({
  next: (value: string) => {
    console.log(
      ` -> observer3: got value '${value}' from observer2.complete()`
    );
  },
  error: (error) => {
    console.error(` -> observer3: subscription errored: ${error}`);
  },
  complete: () => {
    console.log(' -> observer3: subscription completed');
  },
});

console.log('\nSubscribing to observable status$...');

// Subscribe to the observable. Until we subscribe, nothing happens!
stream1ObservableTransformed$.subscribe(observer1());
console.log('\nEmitting `true` to stream1Subject$...');
stream1Subject$.next(true);
console.log('\nEmitting `true` to stream1Subject$...');
stream1Subject$.next(true);
console.log('\nEmitting an error to stream1Subject$...');
stream1Subject$.error('Error emitted from the outside');

console.log('\nEmitting message to stream2Subject$...');
stream2Subject$.next('Sent unrelated message from the outside');

console.log('\nEmitting `false` to stream1Subject$...');
stream1Subject$.next(false);
console.log('\nEmitting `true` again to stream1Subject$...');
stream1Subject$.next(true);
console.log('\nEmitting `false` again to stream1Subject$, causing error...');
stream1Subject$.next(false);
console.log('\nStreams keep listening until completion or unhandled error');

// Add some async behavior so this will happen at the end
setTimeout(() => {
  stream3ObservableForErrorsSubject$.next(
    'Will receive one more value before unsubscribing'
  );
  console.log('\nUnsubscribing from thirdObservableSubscription$...');
  stream3ObservableSubscription$.unsubscribe();
  stream3ObservableForErrorsSubject$.next(
    'Will not be received after unsubscribe'
  );
}, 0);

stream1Subject$.complete();

console.log('\nEmitting `true` to statusSubject$...');
// This is ignored because the stream is completed by now
stream1Subject$.next(true);

// already unsubscribed since they completed: nothing will happen
stream1Subject$.unsubscribe();
stream2ObservableSubscription.unsubscribe();
```

This will result in the following output being logged to the console:

```text
Subscribing to secondObservable$...
 -> observer2: subscription started

Subscribing to thirdObservableForErrors$...

Subscribing to observable status$...
 -> observer: subscription started
 -> observable start: false
 -> observable before switchMap: false
 -> onStatusChanged: false

Emitting `true` to stream1Subject$...
 -> observable start: true
 -> observable before switchMap: true
 -> onStatusChanged: true

Emitting `true` to stream1Subject$...
 -> observable start: true

Emitting an error to stream1Subject$...
Caught error in observable1: Error emitted from the outside
 -> observable start: false
 -> observable before switchMap: false
 -> onStatusChanged: false

Emitting message to stream2Subject$...
 -> observer2: got 'Sent unrelated message from the outside'

Emitting `false` to stream1Subject$...

Emitting `true` again to stream1Subject$...

Emitting `false` again to stream1Subject$, causing error...

Streams keep listening until completion or unhandled error

Emitting `true` to statusSubject$...
Caught error: Error: Disconnected!
 -> observer3: got value 'error' from observer2.complete()
 -> observer: subscription completed, notifying stream2Subject$
 -> observer3: got value 'Will receive one more value before unsubscribing' from observer2.complete()

Unsubscribing from thirdObservableSubscription$...
```

While this example is a bit abstract and contrived, RxJS can be used for a bunch of different use cases, including:

- Use `debounceTime` and `switchMap` to limit requests and cancel previous searches in a search auto-complete;
- Typeahead search box: `fromEvent` on keystrokes, combined with API requests;
- Scroll position can be tracked with `fromEvent` to lazily load content;
- `combineLatest` and `map` can be used to validate fields as user fills them out;
- Progress bar updates could be animated using `interval` and `map`;
- Use `fromEvent` to track mouse drags and `merge` to handle multiple event streams;
- Create a real-time dashboard updating based on WebSocket streams with `merge`;
- Debounce input changes with `debounceTime` to trigger saves;
- Create heatmaps from click events using `fromEvent` and `reduce`;
- Retry XHR requests on failure using `catchError` and `retry`.

Going back to the world of Excel add-ins, here is a real-world example of a setup using RxJS to listen to events from the Excel API. The goal is to listen to selection changes on a table and perform some actions when the selection changes. The `fromEventPattern` method allows us to create an observable from an API event. We basically "hook" into the Excel API event and transform it into an observable. We can then use the `filter` operator to filter out unrelated events and the `takeUntil` operator to unsubscribe when the notifier emits (when the table is deleted).

```typescript
import { Observable, Subject, filter, fromEventPattern, takeUntil } from 'rxjs';

const notifier$ = new Subject<void>();
const table = Excel.Table; // some actual table object (omitted for brevity)

const getTableOnSelectionChanged$ = (
  table: Excel.Table,
  notifier$: Subject<void>
): Observable<Excel.TableSelectionChangedEventArgs> => {
  return fromEventPattern<Excel.TableSelectionChangedEventArgs>(
    (handler: TAnyExcelValue) => table.onSelectionChanged.add(handler),
    (handler: TAnyExcelValue) => table.onSelectionChanged.remove(handler)
  ).pipe(
    // unsubscribe when notifier emits (table is deleted)
    takeUntil(notifier$),
    filter(
      // filter unrelated events...
      (event: Excel.TableSelectionChangedEventArgs) => event.address !== null
    )
  );
};

const observer = (tableName: string) => {
  return {
    next: (event: Excel.TableSelectionChangedEventArgs) => {
      console.debug(`Event triggered at ${event.address}`);
    },
    error: (error) => {
      console.error(`Subscription errored: ${error}`);
    },
    complete: () => {
      console.debug(`Subscription completed for table '${tableName}'`);
    },
  };
};

const selectionChanged$ = getTableOnSelectionChanged$(table, notifier$);
const subscriber = selectionChanged$.subscribe(observer);
// ... do something with the subscription

notifier$.next(); // unsubscribe from the observable and delete the table
```

---

# Reactive testing

**Reactive testing** is a way to test observables. It can be done with marble diagrams or by subscribing and asserting values. While it's more difficult to wrap one's head around marble diagrams, they are more accurate and can be used to test timing. Subscribing and asserting values is easier to understand but requires more boilerplate and is less accurate.

## Marble testing

- We can test streams with expressive ASCII representations of marble diagrams.
- This allows for greater test accuracy of values and timing.
- It requires quite a bit of setup.
- A dash `-` represents a frame of virtual time.
- Any character from the set `[a-z0-9]` represents an emitted value.
- Errors are represented with a `#`.
- `()` represent synchronous groupings.
- The `|` represents the completion of the stream.

### Example

```typescript
import { delay, from } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});

describe('testing async behavior', () => {
  it('should test asynchronous operations', () => {
    testScheduler.run((helpers) => {
      const { expectObservable } = helpers;
      const source$ = from([1, 2, 3]);
      const final$ = source$.pipe(delay(1000));
      const expected = '1s (abc|)';
      expectObservable(final$).toBe(expected, { a: 1, b: 2, c: 3 });
    });
  });
});
```

## Subscribe and assert testing

- Less setup required.
- Can use typical testing APIs and testing patterns.
- Because this runs outside the test scheduler, we must manage async test completion.
- Requires more boilerplate for assertions with multiple items.
- Hard to accurately test timing.

### Example

```typescript
import { map, of, toArray } from 'rxjs';

describe('testing with subscribe and assert pattern', () => {
  it('compare emitted values on completion', () => {
    const source$ = of(1, 2, 3);
    const final$ = source$.pipe(
      map((x) => x * 5),
      toArray()
    );

    const expected = [5, 10, 15];

    final$.subscribe((actual) => {
      expect(actual).toEqual(expected);
    });
  });
});
```

---

# Tips and tricks

- Using `finalize` to execute side effects on completion.
    - Do not put side effects to run inside the `complete` function as it is not called when manually unsubscribing or when an error occurs.
    - Instead, we can add the `finalize` operator tacked onto the end of the pipeline.
- Extract common operator logic into standalone functions.
    - These functions will accept an observable source and return a new observable. See [Creating a custom operator](#creating-a-custom-operator) for an example.
- Use combination operators to access state from secondary streams.
    - Use `withLatestFrom(store$)` to retrieve the current state. This works when subscribing to a BehaviorSubject which will have emitted the value by the time it's needed but may be a source of headaches if subscribing to a regular Subject since the last value will not have been emitted by the time the subscription happens.
- Automate observable cleanup with `takeUntil` and `Subjects`.
    - While we can manually unsubscribe from observables and even unsubscribe from multiple observables at once by having a single subscription to which we add more subscriptions and then unsubscribe from, it is easier to react to a value emitted from a `Subject` like `onDestroy$` by appending `takeUntil(onDestroy$)` to the pipeline. Whenever `onDestroy$.next()` is called, any subscription depending on it will unsubscribe automatically, then `onDestroy$.complete()` will clean up unused resources.
- Use partition and filter for conditional logic.
    - `filter` can be very useful when a single type of output is expected, filtering values before they reach the end of the stream.
    - `partition` will return two observables, which we can destructure. The first one will filter and catch emissions that match our condition and the other stream will contain the values that didn't match the condition. This is useful to avoid creating two different streams when there's an `if`/`else` situation where two types of outputs would be expected.

---

# Conclusion

RxJS is a powerful yet complex toolkit for managing asynchronous data flows. While the learning curve can be steep, the benefits are significant for reactive web apps and complex logic with many asynchronous operations. With practice, RxJS makes it possible to write declarative code that reacts to real-time data updates. By modeling everything as streams of data and applying transformations, RxJS helps tackle challenging programming tasks in a maintainable way. While it takes effort to master, reactive programming with RxJS might just be an essential skill for modern JavaScript/TypeScript developers working on reactive web applications!

## Resources and references

- [Excel add-ins documentation](https://learn.microsoft.com/en-us/office/dev/add-ins/excel/?view=excel-js-preview), Microsoft
- [Learn RxJS](https://www.learnrxjs.io/), Learn RxJS
- [RxJS - Reactive Extensions Library for JavaScript](https://rxjs.dev/), RxJS
- [RxJS & Reactive Programming](https://www.youtube.com/watch?v=lkUrkNdczpI&list=PLj2oFNVaxfJ8nRFUA2CLyt8TymA0_vQux&index=1), Josh Ribakoff
- [RxJS Marbles - Testing](https://rxjs.dev/guide/testing/marble-testing), RxJS
- [RxJS Marbles](https://rxmarbles.com/), RxJS Marbles
