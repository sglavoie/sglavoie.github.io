Title: Book summary: The Effective Engineer
Date: 2023-04-16 14:49
Tags: advice, best practices, career
Slug: book-summary-the-effective-engineer
Authors: Sébastien Lavoie
Summary: After reading [Letters to a New Developer]({filename}/learnings/0027_letters_to_a_new_developer_book_summary.md), one of the next logical steps on this learning path was to read [The Effective Engineer](https://www.effectiveengineer.com/). I hope you enjoy this simple yet effective book summary!
Description: After reading Letters to a New Developer, one of the next logical steps on this learning path was to read The Effective Engineer. I hope you enjoy this simple yet effective book summary!

[TOC]

---

# Introduction

This wonderful, mostly non-technical book is a compilation of the best practices and lessons learned by the author, [Edmond Lau](https://edmondlau.co/), during his impressive career as a software engineer. It is a must-read for anyone who wants to improve their skills and become more effective at what they do. The following are short excerpts from the condensed knowledge found in the book, sprinkled with some minor comments of my own along the way. These are extracted from the book’s takeaway sections and headings: I wholeheartedly recommend [reading the work](https://www.effectiveengineer.com/) in its entirety for an immersive exposure to the fantastic storytelling capabilities of Edmond!

---

# Book summary

## Part 1: Adopt the Right Mindset

### Focus on high-leverage activities

$$\text{Leverage} = \frac{\text{Impact produced}}{\text{Time invested}}$$

* Leverage is the ROI for the effort put in.
* **Meta-skills** are important to know where to focus one’s time and energy to translate more of one’s efforts into impact.
* Leverage your time by always finding ways to perform activities quicker and making sure those activities will have a **meaningful impact**.

### Optimize for learning

* **Make your learning rate a priority**: it compounds like interest over time.
* Study code for core abstractions written by the best engineers at your company.
* **Write more code**.
* Go through any technical, educational material available internally.
* Master the programming languages that you use.
* Send your code reviews to the harshest critics.
* Enroll in classes on areas where you want to improve.
* Participate in design discussions of projects you’re interested in.
* Work on a diversity of projects.
* Make sure you’re on a team with at least a few senior engineers whom you can learn from.
* Jump fearlessly into code you don’t know.
* Learn new programming languages and frameworks.
* Invest in skills that are in high demand.
* **Read books**.
* Join a discussion group.
* Attend talks, conferences, and meetups.
* Build and maintain a strong network of relationships.
* Follow bloggers who teach.
* Write to teach.
* **Tinker on side projects**.
* **Pursue what you love**.

### Prioritize regularly

* Track to-dos in a single list.
* **Focus on what produces value directly**.
* Focus on the *important and non-urgent*.
* Limit the amount of work in progress.
* **Use implementation intentions** (if-then planning).
* **Prioritize** routinely.
* Write down and *review* to-dos.
* Reduce *context switches*.

## Part 2: Execute, Execute, Execute

### Invest in iteration speed

* Move fast to learn fast.
* **Invest in time-saving tools**.
* Shorten your debugging and validation loops.
* Master your programming environment.
* Get proficient with your favorite text editor or IDE.
* Learn at least one productive, high-level programming language (*scripting*).
* Get familiar with UNIX (or Windows) *shell commands*.
* *Prefer the keyboard* over the mouse.
* Automate your manual workflows.
* Test out ideas on an interactive interpreter.
* Make it fast and easy to run just the unit tests associated with your current changes.
* Don’t ignore non-engineering bottlenecks.

### Measure what you want to improve

* Use metrics to drive progress.
* Pick the right metric to incentivize the behavior you want.
* Instrument everything to understand what is going on.
* Internalize useful numbers (e.g., number of active users, requests per second, amount of data accessed and written daily, etc.).
* Be skeptical about data integrity.
* Log data liberally, in case it turns out to be useful later on.
* Build tools to iterate on data accuracy sooner.
* Write end-to-end integration tests to validate your entire analytics pipeline.
* Examine collected data sooner.
* Cross-validate data accuracy by computing the same metric in multiple ways.
* When a number does look off, dig into it early.

### Validate your ideas early and often

* Find low-effort ways to validate your work.
    * Approach a problem iteratively to reduce wasted effort.
* Continuously validate product changes with A/B testing.
    * Reduce the risk of large implementations by using small validations.
* Beware the one-person team (you need feedback early to make sure you’re working on the right thing!).
* *Be open and receptive to feedback*.
* *Commit code early and often*.
* Request code reviews from thorough critics.
* Ask to bounce ideas off your teammates.
* Design the interface or API of a new system first.
* Send out a design document before devoting your energy to your code.
* If possible, structure ongoing projects so that there is some shared context with your teammates.
* Solicit buy-in for controversial features before investing too much time.
* *Build feedback loops* for your decisions.

### Improve your project estimation skills

* Project estimation is one of the hardest skills that an effective engineer needs to learn. *But it’s crucial to master*.
* To produce accurate estimates:
    * *Decompose the project* into granular tasks.
    * Estimate based on how long tasks will take, not on how long you or someone else wants them to take.
    * Think of estimates as *probability distributions*, not best-case scenarios.
    * Let the person doing the actual task make the estimate.
    * Beware of anchoring bias (e.g., hearing about a low estimate from someone else may skew our own estimate later to be too low).
    * Use multiple approaches to estimate the same task (e.g., estimate from past experiences, decompose a larger task into smaller ones and estimate each one).
    * Beware the mythical man-month. Having more people on a project doesn’t necessarily mean it will be completed faster. Communication overhead, context switching, and other factors can slow down the team as much as $O(n^2)$ considering the number of people involved.
    * Validate estimates against historical data.
    * Use **time-boxing** to constrain tasks that can grow in scope.
    * Allow others to challenge estimates.
* Allow buffer room for the unknown in the schedule.
* Define measurable milestones.
* *Do the riskiest tasks first*.
* Know the limits of overtime.

## Part 3: Build Long-Term Value

### Balance Quality with Pragmatism

* Establish a culture of reviewing code.
    * Catch bugs or design shortcomings early.
    * Increase accountability for code changes.
    * Provide an avenue for sharing best practices.
    * Increase long-term agility.
* Invest in good software abstractions to simplify difficult problems.
    * Reduce the complexity of the original problem into easier-to-understand primitives.
    * Reduce future application maintenance and make it easier to apply future improvements.
    * DRY principle: solve the hard problems once and re-use the solutions multiple times.
* Scale code quality with *automated testing*.
    * Make large refactors with confidence.
    * Offer executable documentation.
    * *Don't test everything*: focus on the most important parts of the code and make sure everything critical is covered.
* Manage your technical debt.
    * Pay it periodically. Incur it when necessary to meet deadlines.
    * *Repay the debts with the highest interest rates first* (i.e., focus on what produces the most leverage).

### Minimize Operational Burden

* Embrace operational simplicity.
    * Increased complexity introduces more potential single points of failure.
    * New engineers face a steeper learning curve when learning and understanding the new systems.
    * Effort towards improving abstractions, libraries, and tools gets diluted across the different systems.
    * Do the simple thing first.
* **Build systems to fail fast**.
    * Pinpoint the source of errors.
    * *Make debugging easier* by not masking your errors and by not deferring failures until later.
* **Relentlessly automate**.
    * Don't underestimate the future frequency of the task.
    * Internalize the time savings over a long time horizon.
    * Automate mechanics over decision-making.
* **Make batch processes idempotent**.
    * At least, make processes *"retryable"* if they cannot be made idempotent.
* Hone your ability to respond and recover quickly.
    * Plan and practice failure modes.

### Invest in Your Team’s Growth

* Make hiring everyone’s responsibility.
    * Identify which qualities you care about the most in your colleagues: *keep the bar high*.
    * Make sure the recruiting process is effective.
    * Adapt interview problems to different levels of difficulty based on the candidate's experience.
* Design a good onboarding process.
    * Ramp up new engineers as quickly as possible (e.g., with *codelabs*).
        * Help the people around you be successful.
    * Impart the team’s culture and values (e.g., have *onboarding talks*).
    * Expose new engineers to the breadth of fundamentals needed to succeed (e.g., with *mentorship*).
    * Socially integrate new engineers onto the team (e.g., give them starter tasks to feel they're part of the team faster).
* Share ownership of code (increase the *bus factor*).
    * Avoid one-person teams.
    * Review each other’s code and software designs.
    * Make sure the team is exposed to different types of tasks and responsibilities regularly.
    * Focus on readable and high-quality code.
    * Share software decisions and architecture clearly.
    * *Make sure code and workflows are documented properly*.
    * *Invest in teaching and mentoring*.
        * The more effective the team becomes, the more freedom there is to work on new projects.
* Build collective wisdom with post-mortems (e.g., at NASA, these become the user manual).
* Build a great engineering culture.
    * Optimize for iteration speed.
    * Always automate.
    * Use the right software abstractions.
    * Nurture a respectful working environment.
    * *Allot experimentation time*.
    * *Foster a culture of learning* (CI/CD: *continuous improvement, continuous delightfulness*).
    * **Hire the best**!

---

# Conclusion

Edmond opened my eyes to the importance of being an effective engineer, showing what that entails and how to concretely achieve it. His extraordinary technical journey and knowledge of the field are evident throughout the book, and I found myself nodding in agreement with many of his points. He made me think about how I could apply his advice to my own work. Notably, the key concept of **leverage** resonated deeply with me and ended up being the cornerstone of [the final project I built for my bachelor's degree](https://github.com/sglavoie/cm3070-final-project): *ProductiviDo - An efficient task planner focusing on high-leverage activities*.

## Resources and references

* [Edmond Lau](https://edmondlau.co/) - The author's personal website.
* [ProductiviDo](https://github.com/sglavoie/cm3070-final-project) - A simple and efficient todo-app built with React-Native.
* [The Effective Engineer: How to Leverage Your Efforts In Software Engineering to Make a Disproportionate and Meaningful Impact](https://www.goodreads.com/book/show/25238425-the-effective-engineer) - goodreads.com.
* [The Effective Engineer](https://www.effectiveengineer.com/) - by Edmond Lau.
