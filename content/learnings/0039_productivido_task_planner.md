Title: Building a task planner with React Native: an academic journey
Date: 2023-07-30 18:44
Tags: bsc, lessons, mobile-dev, react-native
Slug: building-task-planner-react-native
Authors: Sébastien Lavoie
Summary: After having [built a somewhat original habit tracker]({filename}/learnings/0035_building_first_react_native_application.md), I was keen on coming up with a solution to a much more common problem: task management. This is the story of how I built a task planner with React Native, explored from an academic perspective first and foremost.
Description: After having built a somewhat original habit tracker, I was keen on coming up with a solution to a much more common problem: task management. This is the story of how I built a task planner with React Native, explored from an academic perspective first and foremost.

[TOC]

---

# Preamble

For my last assignment in a [BSc in Computer Science at the University of London](https://www.london.ac.uk/courses/computer-science), I decided to get involved in the world of task management to tackle one of the most common challenges usually offered to programmers, but with a twist based on scientific evidence. The result ended up being a cross-platform mobile application built with React Native, named ProductiviDo. Due to intellectual property concerns, I will not be able to share the source code of the application, but I hope you will nonetheless find joy in reading about the process of building it through the lens of the report I submitted for the assignment. For a complete list of references and appendices in context, please refer to [the original report]({static}/files/posts/0039_productivido/productivido.pdf).

![App icon ProductiviDo]({static}/images/posts/0039_productivido/app_icon.png)

---

# 1 Introduction

The world needs a new kind of task manager, just like **ProductiviDo**, which comes to life through the "_task manager mobile app_" template provided for the Mobile Development module taught at Goldsmiths, University of London.

## 1.1 Inspiration: the main contenders

<figure>
    <a href="{static}/images/posts/0039_productivido/inspiration.png"><img src="{static}/images/posts/0039_productivido/inspiration.png" alt="inpiration main contenders" class="max-size-img-post"></a>
    <figcaption>Inspiration.</figcaption>
</figure>

There are a few wonderful products that deliver a good experience. Desirable features range from filters, labels and reminders to custom views and breadcrumbs. With **Todoist**, tasks can be quickly captured and will be added to an "_Inbox_" section. Once categorized, tasks are organized into projects, sections and sub-tasks.

Although **Todoist** recently added a board view, **ClickUp** takes it to the next level by labelling columns. In **ClickUp**, tasks are organized into multiple levels of hierarchies, down to task dependency, where sub-tasks depend on parent tasks.

<figure>
    <a href="{static}/images/posts/0039_productivido/clickup-overview.png"><img src="{static}/images/posts/0039_productivido/clickup-overview.png" alt="clickup overview" class="max-size-img-post"></a>
    <figcaption>ClickUp overview.</figcaption>
</figure>

**Trello** takes an entirely different approach, where planning happens by moving cards onto different columns horizontally and re-ordering them vertically. Even though it has a concept of workspaces which is a group of boards, all the organization of a project usually takes place within a single board which contains multiple columns, each containing multiple cards.

Planning in **Airtable** is much more freestyle with a spreadsheet-like system. There is a Gantt view in the paid plan to visualize tasks over time. Using **Airtable** feels like interacting directly with a SQL database with its heavily grid-focused appearance.

<figure>
    <a href="{static}/images/posts/0039_productivido/airtable-project.png"><img src="{static}/images/posts/0039_productivido/airtable-project.png" alt="airtable project" style="max-width: 500px"></a>
    <figcaption>Airtable project.</figcaption>
</figure>

Finally, **Asana** shines mostly within a team setting and mainly works with the core concept of projects, which themselves can contain tasks, sub-tasks and even sub-projects.

<figure>
    <a href="{static}/images/posts/0039_productivido/asana-calendar.png"><img src="{static}/images/posts/0039_productivido/asana-calendar.png" alt="asana calendar" style="max-width: 500px"></a>
    <figcaption>Asana calendar.</figcaption>
</figure>

## 1.2 Drawbacks of existing solutions

<figure>
    <a href="{static}/images/posts/0039_productivido/drawbacks.png"><img src="{static}/images/posts/0039_productivido/drawbacks.png" alt="drawbacks main contenders" class="max-size-img-post"></a>
    <figcaption>Drawbacks.</figcaption>
</figure>

There are usability issues across all these mobile apps (and others) for different reasons. Most popular task managers have a limited search functionality, making it hard to find what one needs quickly unless a good organizational system has been consciously put in place beforehand. Crucially, such applications do not address the fact that unimportant tasks accumulate over time and provide no system to focus on what matters to avoid the fate of having "_41% of to-do items [...] never completed_".

A second point worth mentioning is that a calendar integration is not a core feature deeply integrated into these apps. For instance, **Todoist** offers a 2-way sync with Google Calendar, but tags, labels, priorities and areas of responsibilities are not shown nor taken into account in the calendar. Some task managers will provide their own built-in set of calendar features that partially solve the problem of being able to navigate a complete schedule in a breeze. However, none of these applications really allow efficient scheduling within the calendar. Some allow the user to add or modify events in the calendar, but this remains a slow process working with reduced functionality.

With regards to organization, all these applications are well-suited to manage tasks but when it comes to "_time boxing_" or "_time blocking_", they will show every single task in the calendar view. This is impractical at scale as it quickly becomes overwhelming with dense information, a setup encouraging fragmented work and multitasking. Fragmented work caused by context switching has been shown to have a negative impact on productivity and on output quality while multitasking will lead to "_experiencing more stress, higher frustration, time pressure and effort_".

## 1.3 Market overview

**ProductiviDo** will target in its first iteration Google Calendar because this product can be consumed from a plethora of desktop and mobile applications and there are about 4.3 billion Google users. Once data is integrated into Google Calendar, it can be consumed by different applications such as Apple Calendar, Zoom, Slack or other Google products, including Google Docs.

The number of smartphone users will increase by almost 23% over the next 5 years, forecasting more than a doubling over a 10-year period (2016–2026). Task management software is going upwards of USD$5 billion in market size, the CAGR —_compound annual growth rate_— is hovering around 14% and continuously growing. Combining supply and demand, we can see that both are expected to increase drastically over the coming years and that task managers fall into a category of growth market, which is desirable as it clearly indicates there is room for new rivals in the field: this is distinctly the case given that the task management world is still dominated by a few big players, many products have retired over the years (which unsaturates the market) and considering that **ProductiviDo** solves a real problem —that of staying on top of a growing list of commitments— with an innovative solution not yet implemented elsewhere.

## 1.4 Motivation

One reason why **ProductiviDo** will shine is because calendars are still under-appreciated in existing task managers, yet all major task manager applications integrate them in one way or another. It has been shown through many studies that calendars save time, improve productivity, reduce stress and make it simpler to batch similar activities. Plus, they can be consumed in a myriad of ways with their Application Programming Interfaces (APIs). The problem with using only a calendar without a task manager is that they are inconvenient when dealing with many events or tasks. On the other hand, relying only on task managers makes it difficult to appreciate how useful calendars are when it comes to visualizing one's schedule from different perspectives such as a weekly or monthly view. Regarding **ProductiviDo** as a task manager and not only a calendar integration, it will distinguish itself by allowing users to quickly and efficiently record their routine activities. This is because it has been shown that these occupy a good amount of time even for productive people and there is currently no application that really implements a direct solution to this.

Intelligent prioritization is essential, yet difficult to achieve with existing products. Beyond capturing tasks and categorizing them, this application will feature a prioritization system that will help users focus on their most high-leverage activities with the help of custom sorting algorithms as advocated by Edmond Lau in his book _The Effective Engineer_. These will take into consideration aspects such as urgency and importance — in the spirit of the Eisenhower Matrix — as well as deadlines to calculate the impact that completing a task will have. Importantly, the priority matrix is adapted to account for other needed facets, such as when other people are involved in the task dependency chain (delegatees), an adaptation of the "_fit_" variable from the Sung Diagram, which is an extension of the Eisenhower Matrix.

The application will benefit users by providing a built-in planning system that will make it easier to follow a successful schedule. This goes hand in hand with findings illustrating how, in the absence of a mindful review process, users will want to focus on small or unimportant tasks to release dopamine even though they know what would bring them the best outcomes, a real productivity threat leading to a decrease in output and an increase in completion time. Therefore, by offering a system that will encourage users to take better decisions and visualize evidently their highest-leverage tasks in a familiar and useful fashion, **ProductiviDo** will carve its place in the market by solving unmet needs.

---

# 2 Literature review

## 2.1 Previous work

As alluded to in section 1.1, the current work found inspiration in well-established task management software. There are numerous alternatives available on the market: only the most well-known and relevant ones for this project will be covered. Evaluating such products in depth goes beyond the scope of this report: key points will be highlighted to justify the need for a new solution.

## 2.1.1 Todoist

**Todoist** is one of the most popular task management software, with over 20 million users. It is a web-based application that allows users to create tasks, organize them into projects, and assign them to specific dates. It also features a priority system that allows users to sort tasks by importance, and a reminder system that will notify users of upcoming tasks. While **Todoist** is a very popular solution, it has some shortcomings. Its design is arguably polished, yet its dark theme lacks contrast, recurring tasks don't show immediately on which schedule they recur and tasks with comments or attachments are difficult to locate. Other functional deficiencies include the fact that the "Upcoming" view shows all tasks from all projects as a large, single list of items without allowing filtering or that the app has a concept of "due date" with no "start date" such that duration is not taken into account nor can be visually represented meaningfully in a calendar. Equally relevant when comparing to what **ProductiviDo** will offer is the fact that there is no way to apply "time boxing" as there is no calendar view and only a functionally limited Google Calendar integration, task filtering is not intuitive due to the custom query language syntax used by the app and there is no easy way to find recurring or routine tasks without setting up a custom labelling system on one's own.

<figure>
    <a href="{static}/images/posts/0039_productivido/todoist-upcoming-view.png"><img src="{static}/images/posts/0039_productivido/todoist-upcoming-view.png" alt="todoist upcoming view" style="max-width: 500px"></a>
    <figcaption>Todoist upcoming view.</figcaption>
</figure>

## 2.1.2 Trello

**Trello** lies on the other end of the feature creep spectrum when compared to **ClickUp** and can be seen as possessing an even more basic set of capabilities than **Todoist**. With its simple and uncluttered drag & drop interface, **Trello** is much more intuitive than a more sophisticated and flexible option such as `Todo.txt` which can be technically extended at will and can be operated from the command-line on a desktop computer or from a multitude of third-party applications on mobile devices. **Trello**'s simplicity comes at a cost, however: it is not uncommon to lose track of "cards" because one must swipe horizontally in order to navigate the UI; and very little information fits on the screen at once, where only a fraction of a "board" with up to a few "cards" is shown. There is a copious amount of calendar integrations available for **Trello**, yet the core of the issue that **ProductiviDo** aims to address remains unsolved: the app's metadata is not accessible from Google Calendar (e.g., priority, area of work, task status, etc.) and the app does not provide a way to visualize the user's tasks in a convenient calendar view as it only "_displays all cards with due dates by month_" and only when using one of its paid feature, called "Power Ups".

<figure>
    <a href="{static}/images/posts/0039_productivido/trello-boards.png"><img src="{static}/images/posts/0039_productivido/trello-boards.png" alt="trello boards" style="max-width: 500px"></a>
    <figcaption>Trello boards.</figcaption>
</figure>

## 2.2 Contributions from the literature and gaps being filled

### 2.2.1 Initial design justifications

Amongst a panoply of scientific papers on the subject of task management, the quintessential work of Bellotti et al. serves as an excellent entrypoint listing a set of design requirements to be expected in an efficiently conceived task manager. Of particular relevance to the creation of **ProductiviDo** are the needs for the app to be "_instantly on_" with the option to have "_no formal task description_" and a "_mechanism for handling stale to-dos of low importance_". The authors highlight that the main issue is "_making sure that the important tasks get done_", which led to further research being exposed on the topic of prioritization matrices. The authors also advocate for task states, location, social relations, notes and time constraints to be captured, all of which are taken into account in the design. In a more recent study looking at the importance of prioritizing tasks, further evidence suggested that a prioritization model should be adopted (e.g., HI/LO, CARVER or Carpenter) in a task management system, pointing at the Eisenhower Matrix as a useful framework to use for this very purpose. Other less formal alternatives such as the RICE or ICE frameworks have also been reported to be used with success and could be adapted to this project with their scoring model.

Another aspect which served to inform the overall direction to take is the well-known fact that humans do not work optimally when multi-tasking as this leads to a high cognitive load in keeping track of different areas of focus or projects. Fragmentation of information in one's work —which occurs when multitasking— is a problem because people won't remember where to find the information. Applying this idea of fragmentation to the digital world, it only makes sense that offering too many ways to store and retrieve data (such as with **ClickUp**) is counterproductive. Furthermore, the ability to customize the UI is a double-edged sword because "_users make mistakes and create building blocks with unintended consequences_". Indeed, if the user interface is cluttered or offers too many bells and whistles, managing the global context of one's tasks becomes difficult and one inevitably encounters obstacles when trying to juggle with multiple actions at once, because "_prospective memory is fallible_". Hence, simplicity is key to a good task manager (which certainly helps to explain **Todoist**'s wild success). While simplification is part of the gamified model —Habitica being one example of a product incorporating many elements of gamification— this model suffers from the "_undifferentiated use of rewards_", leads to "_punishments for productivity_", to "_feeling of not being taken seriously_" and cause "_negative anticipation_". Moreover, "_people found their standard task manager simpler to use_" and the integration of extrinsic motivational factors such as a reward system "_would not excite them to continue being immersed in a gamification application_". While this form of motivation does not appear to be effective in goal attainment, the literature concludes that "_valuing extrinsic goals [...] does not seem to increase our happiness, but attaining those goals does_", adding that giving weight to intrinsic goals (such as personal growth, loving relationships and physical health) and achieving them is a better way to increase happiness. As long as a task manager nourishes intrinsic motivation, it is likely to be effective in helping people to achieve their goals while maintaining optimal psychological health.

Other approaches were considered, notably the "_Binary Priority List_" due to its simplicity when it comes to comparing two elements (such as tasks). However, it lacks flexibility and becomes inefficient as more and more tasks are added because —unlike the famous binary search algorithm— this algorithm requires human intervention to classify tasks, which becomes burdensome faster than `O(log n)`. The literature on gamification also linked to sources that revealed solutions to solving procrastination, a self-regulation failure that gamified systems sought to minimize to no avail, which led to identifying a desirable core component of the application: implementation intentions. These can be integrated into the "mental flexibility" facet of "planfulness" —through a technique known as "mental contrasting with implementation intentions" (MCII)— along with temporal orientation and cognitive strategies, all of which improve goal outcomes.

### 2.2.2 Implementation intentions

Implementation intentions have shown their effectiveness in helping people to achieve their goals, the real purpose behind using task managers in the first place. The idea is to create a plan of action for a specific goal, which is then followed by a specific time and place. The plan must be broken down into a series of steps, which are written down in a way that is easy to remember using so-called "if–then plans". The specific formulation of such plans "_produce much more favorable and reliable outcomes than broad intentions to pursue a goal_". Findings from Bieleke et al. show that implementation intentions are also useful when planning one's work because they help "_evaluate information from a certain perspective_" —which can be verbally recommended to users so they adopt a "_certain processing style (e.g., deliberative thought) or perspective (e.g., neutral observer)_". Their research also highlight the high potential of implementation intentions in reviewing tasks because "_participants can strategically adopt a reflective mode of information processing that helps them make more sophisticated decisions when facing uncertainty_". Other studies show that such "_plans to deliberate can be used to increase the likelihood of deliberation and thereby the effective processing of newly available information_", which further supports the benefits of implementation intentions with regards to planning. To make the planning stage more effective, research also "_indicates that having plans that focus on overcoming obstacles are important for maintaining progress and staying on track with one's goals_", so this aspect will also be featured when creating tasks in the **"Inscribe"** step described in section 2.3.1. Once planning has been done, implementation intentions will also prove useful to take action towards accomplishing one's goals because they lead to "_automatic action initiation without further conscious intent_" —surprisingly and encouragingly, even in participants suffering from mild to moderate depression. While this is obviously beneficial during the initial stages of a project or task to overcome procrastination, it is equally important to re-evaluate one's course of action because sticking to a plan stubbornly "_can hinder overall goal performance by causing one to overlook alternative opportunities for achievement_", amongst other negative consequences. This explains why **ProductiviDo** encompasses a **"Review"** step which deals with this particular problem and more, described in section 2.3.4.

While this self-regulation technique can be applied successfully in the context of a task manager, it bears mentioning that it is not a panacea as it suffers from some limitations, one of which being that "_formulating multiple implementation intentions is ineffective when changing unwanted behavior [...] due to interference in the enacting phase of the planning process_". In other words, multiple implementation intentions can compete for attention, which makes one lose focus. To drastically mitigate this issue, **ProductiviDo** dedicates an entire step to **"Focus"**, which is described in more detail in section 2.3.3. The **"Review"** step will help with reducing the number of tasks one has to juggle with while there will be a **"Prioritize"** step (described in section 2.3.2) to help users decide which tasks to focus on before they get conveniently extracted in the **"Focus"** step.

### 2.2.3 Calendars, planning & scheduling

Section 1.4 introduced some of the core benefits of using calendars for planning and scheduling, yet scientific examination supplies a treasure trove of additional findings justifying their use alongside a task manager. A study exploring the use of a personal calendar discovered that most interviewees prefer a weekly view to aid with "_opportunistic rehearsal_", a fact that sits well with the need for a reviewing system such as the one proposed in section 2.3.4 as well as the realization that a simple list or Kanban presentation is helpful but not sufficient to get a clear overview of one's schedule at a glance. The same study made it clear that most users rely on their calendar to store efficiently certain types of information such as the date (97%), time (96%), location (93%) and purpose (69%). Quite convincingly, participants also used their calendar for "_tentative event scheduling_", revealing the need to empty their mind to stay on top of their duties, a need addressed with the **"Inscribe"** step referred to earlier. This study also emphasized the fact that calendars can be viewed on the web from most devices or even printed for offline reference. Finally, this paper also found that a majority of users (63%) reported using reminders and alarms with the help of their calendar.

Even though almost two thirds of working professional consider using a calendar application to be very important in their workflow, it was also found in another study that "_it is inconvenient to schedule on calendar apps_", which supports the use of task managers for that specific necessity since they can alter tasks brilliantly and speedily. Calendars are not necessarily the best tactic when it comes to scheduling all kinds of activities either. Indeed, "_when consumers schedule their leisure, they may inadvertently reduce their utility for the activity_". With this type of activity, the authors divulge that "_roughly scheduling (i.e., without pre-specified times)_" constitutes a practical alternative. This results in effective scheduling when tasks are entered via a task manager and synced with Google Calendar since blocks of activities can still be displayed in the calendar view without the added burden of specifying a strict duration for each event.

There are some use cases that simply are not well suited for task managers, such as synchronizing events from Gmail (i.e., capturing tasks from different sources), setting reminders on appointments scheduled by third parties (where the primary source of truth must remain the calendar itself) or sharing a schedule with groups across the G suite applications with the help of smart suggestions coming from Google users' data which is not entirely available to external applications.

## 2.3 The four pillars forming a new approach: evaluating their effectiveness

### 2.3.1 Inscribe

<figure>
    <a href="{static}/images/posts/0039_productivido/inscribe.png"><img src="{static}/images/posts/0039_productivido/inscribe.png" alt="inscribe screen" style="max-width: 500px"></a>
    <figcaption>Inscribe screen.</figcaption>
</figure>

**ProductiviDo** features four core components to help tackle one's work skillfully, the first of which being all about jotting down tasks, a demonstration of the "generation effect" which assists with remembering information better. At this stage of the process, the idea is to record any potential future action that is required while being fully aware of the impact that such action will have on one's life, benefitting at once from reducing one's cognitive load by storing or discarding thoughts that do not require immediate response. "Inscribing" in this application is an intentional step demanding a certain level of mindfulness and acts as a precursor to the use of implementation intentions as it similarly "_serves an important self-regulatory function_" according to a study on mindfulness done at the University of Rochester. A 2020 study from Bieleke and Keller found that "_opportunity-focused plans are especially important for initial progress towards the goal_", therefore this step ensures —through questioning the user's aspirations— that the task is indeed a priority and that it is not just a distraction by evaluating its "leverage", a notion introduced in section 1.4.

### 2.3.2 Prioritize

<figure>
    <a href="{static}/images/posts/0039_productivido/prioritize.png"><img src="{static}/images/posts/0039_productivido/prioritize.png" alt="Prioritize screen" style="max-width: 500px"></a>
    <figcaption>Prioritize screen.</figcaption>
</figure>

There is substantial evidence to establish that the concept of a "master list" has been popularized and has found multiple concrete applications (e.g., as a list of relevant jobs held by an applicant, as an Excel spreadsheet keeping track of crucial information at a high-level, in some jurisdictions in the legal world, etc.), including as a way to manage tasks, an idea also sprouting from Edmond Lau's work. In the context of task management systems, a master list manifests itself as a centralized location where all tasks are accessible once they have been "inscribed". With **ProductiviDo**, "prioritizing" is a transient state: it is about handling a database of data to be referenced later when progress must be undertaken on specific tasks. It is a digital space separate from the current areas of focus (presented in the following step in section 2.3.3) used to find the next priorities to work on, where filters are available to that end (see section 3 for the technical details). As defended by Bellotti's research as a set of desirable features, the **"Prioritize"** step offers the "_ability to sort by importance and deadlines_" as well as a "_smart prioritization_" of tasks by default, where the most important ones will flow to the top of the list, ready to be acted upon. Because tasks listed in the **"Prioritize"** step are forcibly distinct from those listed in the **"Focus"** step as they are mutually exclusive, this intermediate step helps to reduce the number of tasks shown in the schedule, improving one's perceived control of time, busyness and stress.

### 2.3.3 Focus

<figure>
    <a href="{static}/images/posts/0039_productivido/focus.png"><img src="{static}/images/posts/0039_productivido/focus.png" alt="focus screen" style="max-width: 500px"></a>
    <figcaption>Focus screen.</figcaption>
</figure>

Once there are prioritized tasks in the application defined in terms of implementation intentions, science dictates that there is a need to "_support the viewing of entire task vistas, but also allow different perspectives for different kinds of planning_" and for "_top priority items to be made apparent_". It is also known that setting clear goals eliminates intrusive thoughts and that "_commitment to a later behavior was linked to reduced rather increased strain on mental resources_". For these reasons, the **"Focus"** step is a crucial component of the application. This component has the additional benefit of mitigating the problem uncovered in section 2.2.2 about the lesser efficacy of having multiple implementation intentions at once because it helps to recall all the high-leverage tasks in a filtered version of the master list (i.e., the current working list), leading to the observation of the Zeigarnik Effect which states that "_an activity that has been interrupted may be more readily recalled_". In addition, seeing a list of promises to oneself in the form of MCIIs "_seems to facilitate behavior change even when there is an initial reluctance to engage in the targeted behavior_". Even more benefits from MCIIs include "_sustained task value and higher persistence_", two aspects that contribute to goal achievement and, consequently, to turning a task manager into an efficacious product.

### 2.3.4 Review

<figure>
    <a href="{static}/images/posts/0039_productivido/review.png"><img src="{static}/images/posts/0039_productivido/review.png" alt="review screen" style="max-width: 500px"></a>
    <figcaption>Review screen.</figcaption>
</figure>

At this point, a working list of tasks exists to **"Focus"** and a backlog of work remains to **"Prioritize"**, yet not all labor should be brought to fruition as initially planned. Life circumstances change and "_plans to deliberate can be used to increase the likelihood of deliberation and thereby the effective processing of newly available information_", which can help eliminate or update tasks that are no longer considered important or relevant enough given an ever-changing environmental context. A paper on making informed scheduling decisions also noted that "_self-monitoring and self-reflection often affect behavior, and this change typically goes in the desired direction of improvement_". These findings can be applied practically by creating plans focusing on overcoming obstacles to make sustained progress, allowing one to ponder every major decision during the journey. A 2021 study on task management tools proposed to break complex tasks into smaller chunks (using a sophisticated approach with dependency graphs), an idea that can auspiciously be employed in a simpler way by breaking down a larger unit of work into smaller ones, which can be done during the information-gathering phase (i.e. the **"Inscribe"** step) as well as during the reviewing phase with existing units of work, which is known as "compartmentalization". This self-reflection process can also contribute to one's well-being by providing written cues to recollect positive images from past accomplishments. Looking towards the future, cueing the users to imagine positive outcomes and encouraging them to restructure their priorities can equally evoke optimism and improve life satisfaction while inspiring them to live according to their personal values. After all, a "_person who sets up life and its routines to avoid inner conflict between goals is better off in the sense that he or she ends up feeling fewer bad emotional states and is generally happier_".

<figure>
    <a href="{static}/images/posts/0039_productivido/review-later.png"><img src="{static}/images/posts/0039_productivido/review-later.png" alt="review screen with later filter applied" style="max-width: 500px"></a>
    <figcaption>Review screen, showing a filter being applied.</figcaption>
</figure>

---

# 3 Design

## 3.1 Domain and target audience

**ProductiviDo** is a task management system staying clear of project management and time management, geared towards being a capture and review tool leaving notifications and scheduling to external systems, primarily to Google Calendar in these first product iterations. As such, the target audience is represented by conscientious people desiring to optimize their productivity with a tool discouraging multitasking, who don't mind hand holding to achieve their goals — willing to trade off flexibility in exchange for a more rigid system backed by science —, expecting a simple set of essential features for a distraction-free environment to get things done and wanting to manage their own set of personal tasks (as this product is not designed with teams or businesses in mind).

Explicitly supported users include people who want to follow a useful system without having to build it from scratch (e.g., setting up projects, tags, custom priorities, etc.) as well as those who need to keep track of tasks involving others with basic functionality (via Google Calendar and filters in the application). The application will not cater to those who want to rely mainly on desktop applications (because the core of the application is mobile only), nor to those who want to use a calendar other than Google Calendar (which is the only calendar undeniably supported in this version) or those who are looking for a solution integrating into other applications, since there will be no publicly accessible API at first to make this possible.

## 3.2 Design decisions and principles

<figure>
    <a href="{static}/images/posts/0039_productivido/figma_design.png"><img src="{static}/images/posts/0039_productivido/figma_design.png" alt="Designing and wireframing in Figma" class="max-size-img-post"></a>
    <figcaption>Designing and wireframing in Figma.</figcaption>
</figure>

Section 2 abstractly laid out the foundation for the core ideas being implemented in the application meeting
the needs of the target audience. Concretely, a few design principles listed in "The Pocket Universal
Principles of Design" inform how the application has been thought out, markedly:

- The 80/20 rule: "_80 percent of a product's usage involves 20 percent of its features_", which is true with **ProductiviDo** where users will spend most of their time focusing on the work they have to accomplish;
- Chunking: "_Chunk information when people are required to recall and retain information_", where each task will display the most important information to contextualize work;
- Constraint: "_Limiting the actions that can be performed to simplify use and prevent error_", where each screen will have a single function with a premedidated lack of customization;
- Five Hat Racks: the five ways in which information can be organized (i.e., category, time, location, alphabet, and continuum), all of which are supported by **ProductiviDo**;
- Form follows function: "_Aesthetic considerations should be secondary to functional considerations_", where the application maximizes the functionality available on each screen while taking into consideration the primary interactions needed at each step, regardless of the visual impact these decisions have;
- Garbage in, garbage out: "_Make it impossible to store bad data types_", where the application will not accept invalid inputs on any field that could jeopardize the integrity of the data;
- Nudges: "_smart defaults, clear feedback, aligned incentives, structured choices, and visible goals_", where the app makes the purpose of each interaction crystal clear;
- Progressive disclosure: "_A method of managing complexity, in which only necessary or requested information is displayed_", where filters are selectively shown to match the intent of each screen and where optional fields are hidden away by default until they are needed.

It is noteworthy that calendar integration will be optional and that the application will remain fully functional without relying on external calendars for maximum convenience, especially while users are offline. Even though this work underlined the usefulness of calendars when used as companions for task managers, one of the primary goals of a task manager is to be available at all times regardless of internet connectivity so that users can access their list of priorities and get work done: requiring an active connection and access to a calendar via sign-on before being able to do any work would break the principle of least astonishment in this type of application.

<figure>
    <a href="{static}/images/posts/0039_productivido/prioritize-wireframes.png"><img src="{static}/images/posts/0039_productivido/prioritize-wireframes.png" alt="Some of the original wireframes for the Prioritize screen" class="max-size-img-post"></a>
    <figcaption>Some of the original wireframes for the <strong>Prioritize</strong> screen.</figcaption>
</figure>

## 3.3 Structure of the application

The application is structured in such a way that each screen has a single function and that the user is guided through the process of adding, editing, and reviewing tasks4. The application is designed to be as simple as possible, with a minimalistic interface and a limited number of interactions to keep the user focused on the task at hand. Technically, it is arranged according to a pyramid schematic architecture, where the "hub" is the hamburger menu which links to all other pages and where all the sub-pages can go back to the "hub". In this architecture, the tab navigation at the bottom of the screen lists the core sub-pages which are always accessible and can lead back to the hub as needed so that the user does not need to remember how to get from one screen to another, since they are all identified with both a recognizable icon and text label.

The application is structured in a way that makes it easy to add, edit, and review tasks, with the following screens:

1. **Inscribe**: Looking at the tab bar (bottom part of the wireframes) from left to right, this is the first screen meant to be easily accessible and also the first step that is part of the process of managing tasks by carefully adding them to the system;
2. **Prioritize**: this is the screen responsible for displaying the list of tasks that have been added to **ProductiviDo** in the first step (**Inscribe**) but still require planning (i.e., they represent the tasks to prioritize);
3. **Focus**: Once the tasks have been prioritized from the previous screen (**Prioritize**), they are ready to be scheduled and worked on, which is the purpose of this screen — it displays the current working list of tasks in a digestible format;
4. **Review**: Periodically (daily, weekly, etc.), the application will ask the user to review the tasks that remain to be completed to ensure that they are still relevant and that they are still a priority.

<figure>
    <a href="{static}/images/posts/0039_productivido/edit-task.png"><img src="{static}/images/posts/0039_productivido/edit-task.png" alt="edit task screen" style="max-width: 500px"></a>
    <figcaption>Edit task screen.</figcaption>
</figure>

These core screens are accessible at all times from the tab bar to allow for easy navigation between them. The application will also have a few other screens that are not part of the core workflow but that are still important for the user experience:

1. **About**: This screen will display information about the application, such as the purpose behind each aspect as well as the version number;
2. **Help**: There will be a help system embedded in this screen to help users understand how to use the application and how to get the most out of it, which will be fully searchable;
3. **Recycle bin**: Sometimes, tasks will be added to **ProductiviDo** by mistake or they will be completed before they are scheduled. This screen will allow the user to review and restore these tasks if they are still relevant;
4. **Accomplishments**: This screen will display a list of tasks that have been completed and will allow the user to review them and reflect on their accomplishments;
5. **Settings**: This screen will allow the user to customize the application to their liking, such as changing the theme, determining default values on new tasks, etc.

<figure>
    <a href="{static}/images/posts/0039_productivido/about.png"><img src="{static}/images/posts/0039_productivido/about.png" alt="about screen" style="max-width: 500px"></a>
    <figcaption>About screen.</figcaption>
</figure>

These secondary screens are accessible from each core screen in the top-right corner to toggle the presence of a "drawer" menu. The menu can also be revealed by swiping from right to left on the screen. The menu will be hidden by default to keep the interface as clean as possible and to avoid cluttering it with unnecessary information. The menu will be revealed by default on the first launch of the application to help users discover the features available to them.

<figure>
    <a href="{static}/images/posts/0039_productivido/menu.png"><img src="{static}/images/posts/0039_productivido/menu.png" alt="Menu screen" style="max-width: 500px"></a>
    <figcaption>Menu screen.</figcaption>
</figure>

## 3.4 Libraries and services

At a high level, the application will be built using React Native to support both Android and iOS platforms.
In terms of software user-facing dependencies, the application will use the following libraries:

- `react-native-async-storage/async-storage`: The application will use this library to store data
  locally on the device;
- `react-native-community/datetimepicker`: This library will be used to display the date and time
  pickers;
- `React Navigation`: This library will be used to implement the navigation system;
- `Redux`: This library will be used to manage the state of the application;
- `NativeBase`: it will be used to implement the user interface;
- `redux-persist`: This library will be used to persist the state of the application locally on the device;
- `redux-thunk`: This library will be used to implement asynchronous actions in the application;
- `react-native-collapsible`: This library will be used to implement all the collapsible sections to
  provide progressive disclosure;
- `react-native-extended-stylesheet`: This library will be used to implement the theming system;
- `nandorojo/anchor`: This library will be used to implement the anchor system so that users can jump
  from one section to another in the help system.

The application will also use the following libraries to support the development process:

- `Eslint`: This library will be used to enforce a consistent coding style;
- `Babel`: This library will be used to transpile the code to support older versions of JavaScript;
- `Jest`: This library will be used to implement unit tests;
- `react-native-testing-library`: This library will be used to implement integration tests;
- `react-native-dotenv`: This library will be used to manage environment variables;
- `react-test-renderer`: This library will be used to implement snapshot tests;
- `TypeScript`: It will ensure type checking is available app-wide and reduce the number of bugs.

On the backend side, the application will make use mainly of the following services:

- `Firebase`: This service will be used to implement the authentication system needed to deal with
  Google accounts as an optional add-on;
- `Google Calendar`: This service will be used to implement the calendar system;
- `SQLite`: It will be used to implement the database system locally and will be backed up to the cloud.

<figure>
    <a href="{static}/images/posts/0039_productivido/db_schema.png"><img src="{static}/images/posts/0039_productivido/db_schema.png" alt="Showing the database design behind ProductiviDo." class="max-size-img-post"></a>
    <figcaption>Showing the database design behind ProductiviDo.</figcaption>
</figure>

## 3.5 Plan of work

In a nutshell, the plan of work will be followed as shown below:

![Gantt Chart]({static}/images/posts/0039_productivido/gantt_chart.png)

## 3.6 Testing and evaluation

The project will be tested primarily using the following methods:

- **Unit tests**: Unit tests will be implemented to ensure that each component of the application works as expected. These tests will be implemented using `Jest` and `react-test-renderer`.
- **Integration tests**: Integration tests will be implemented to ensure that the application works as expected when all the components are combined. These tests will be implemented using the apt `react-native-testing-library`.
- **User and usability testing**: User testing will be implemented to ensure that the application is easy to use and that it meets the needs of the users. These tests will be implemented using a combination of user interviews and surveys.
- **Performance, load and stress testing**: Performance testing will be implemented to ensure that the application is fast and responsive. These tests will be performed by simulating the presence of a large number of tasks and events.
- **Security testing**: Security testing will be implemented to ensure that the application is secure, most definitely when it comes to protecting user's data in the cloud to avoid data breaches.
- **Regression testing**: Regression testing will be implemented to ensure that the application does not break when new features are added, using a mixture of automated `git bisect` scripts to locate anomalies and by automatically running test suites with Git pre-commit hooks.
- **Compatibility testing**: Compatibility testing will be implemented to ensure that the application works on all the supported platforms.
- **Accessibility testing**: Accessibility testing will be implemented to ensure that the application is accessible to all users.

---

# 4 Implementation

## 4.1 Overview

At its core, **ProductiviDo** aims to provide a system that facilitates "getting things done" in the manner of the famously successful productivity system GTD, created and shared with millions of people by David Allen. The system is based on the following principles, worth expanding on as it bears strong resemblance with the final design of the application:

- **Capture**: All tasks and events should be captured in a single place, so that they can be easily accessed and managed. This is achieved with the **"Inscribe"** screen, the first step in the **ProductiviDo** system.
- **Clarify**: All tasks and events should be clarified, so that they can be easily understood and prioritized. This is achieved in the **"Inscribe"** screen, where the user can add a description to the task or event along with necessary metadata to help classify and prioritize the data being added.
- **Organize**: All tasks and events should be organized, so that they can be easily accessed and managed. While this GTD step does not map directly to a step in **ProductiviDo**, the **"Focus"** screen serves a similar purpose in that it allows the user to organize tasks and events into a list of immediately actionable items that are easy to reference.
- **Reflect**: All tasks and events should be reflected upon, so that they can be easily understood and prioritized. With **ProductiviDo**, this is done in the **"Review"** screen, which invites users to review tasks logically according to their deadline, priority, an**d other meta**data.
- **Engage**: All tasks and events should be engaged with, so that they can be easily accessed and managed. **ProductiviDo** deals with this GTD step in a simpler way via the **"Prioritize"** screen and the **"Focus"** screen, which allow users to prioritize tasks and events and then focus on the most important ones.

## 4.2 Features implemented: a visual tour

<figure>
    <a href="{static}/images/posts/0039_productivido/quick-actions.png"><img src="{static}/images/posts/0039_productivido/quick-actions.png" alt="Quick actions screen" style="max-width: 500px"></a>
    <figcaption>Quick actions.</figcaption>
</figure>

The application has the following features:

- **Add a task**: The user can add tasks by navigating to the **"Inscribe"** screen and filling in the required fields. The user can also add a deadline date and time, a duration, a location, a priority to the task and so on. By choosing the type of task as "**Calendar**" and filling in the required fields, the task will be added to the user's Google Calendar. This screen hides any navbar and tab bar to maximize the screen real estate.
- **Prioritize a task**: The user can prioritize tasks by navigating to the **"Prioritize"**, where filtering options are available to help the user find the task to prioritize. The main task action that can be performed on this screen is to "focus" a task, effectively moving it to the **"Focus"** screen.
- **Focus on a task**: The user can focus on a task by navigating to the **"Focus"** screen, where the user can see a list of tasks that are immediately actionable. The user can also filter the tasks to focus on. The main action that can be performed on this screen is to "complete" a task, effectively moving it to the "Accomplishments" screen.
- **Review tasks**: The user can review tasks by navigating to the **"Review"** screen, where the user can see a list of tasks that are overdue, due soon (e.g., today, tomorrow, this week), due later (e.g., next week, next month, next year) as well as tasks that are "old" (i.e., tasks that have been added to the system more than a month ago relative to today's date but have not been worked on yet). This screen features "_quick actions_" that are relevant to the tasks being reviewed. These actions provide the ability to reschedule a task, update its current state (i.e., move it from and to the Prioritize and Focus screens) and to delete a task without having to open the task details screen to edit it.
- **Filter tasks to review**: The user can filter tasks to review by navigating to the **"Review"** screen and selecting the filter options. The user can filter tasks by one of the categories "**Overdue**", "**Soon**", "**Later**", "**Old**" and by all of these at once when no filters are applied.
- **Edit task details**: Once a task has been added to the system, it can be edited from any of the main screens (i.e., **"Prioritize"**, **"Focus"**, **"Review"**). The user can edit all the same properties as when adding a task as well as add new ones not present when the task was added. When a task is of type "Calendar", its related details will also be updated on the user's Google Calendar.
- **About screen**: while the About screen does not provide any functionality related to tasks, it allows users to learn more about the application. The screen includes a link to the application's website, a link to a dynamic feedback form to help **ProductiviDo** become a better fit for its users, an email address to contact the developers (which opens the default email client on the user's device) and other less frequently accessed information, including a link to the GitHub repository of the project and a list of open source libraries used to create the product.
- **Help screen**: the application has been designed to avoid relying on documentation in order to be used. However, the Help screen is a useful resource for users who want to learn more about the concepts involved in the application. It describes possible workflows and guides users through the application's main screens so they will be able to use it even more effectively.
- **Recycle bin screen**: **ProductiviDo** makes it very easy to access and manage tasks that have been deleted by the user. The Recycle bin screen allows users to restore deleted tasks (which are sent back to the Prioritize screen for the next round of prioritization) or to permanently delete them by emptying the recycle bin.
- **Accomplishments screen**: While the Recycle bin holds all deleted tasks, the Accomplishments screen holds all tasks that have been completed by the user from the Focus screen. The Accomplishments screen is a great way to keep track of the user's progress and to celebrate the user's accomplishments, yet it also allows removing completed tasks from the system if the user wishes to do so.
- **Settings screen**: The Settings provided by **ProductiviDo** allow users to customize the application to their needs in a basic way — and all settings are persisted across reboots of the application or device. There is a dark mode available to protect the users' eyes from screen brightness. Other settings include the ability to set default behaviours on new tasks, set the increment in minutes to be shown in the time picker, set a different locale to represent dates and times and some more options to toggle the display of certain elements in the application.
- **Filters**: What **ProductiviDo** lacks in customizations, it makes up for in filters. The application allows users to filter tasks by type, status, priority, deadline date, deadline time, duration, location and more. The filters are applied in real-time, so the user can see the results of the filters as they are being applied. The filters can be applied to any of the main screens (i.e., **"Prioritize"**, **"Focus"**, **"Review"**) and can be combined to create more precise filters.
- **Google Calendar**: One of the key tenets of **ProductiviDo** is to make it easy for users to manage their tasks and to have a visual window into their schedule, which is achieved by integrating with the user's primary calendar on Google Calendar. The application allows users to connect their Google Calendar account to **ProductiviDo** and to create calendar events from new or existing tasks. At the same time, this functionality remains entirely optional: users can choose to never opt in to the Google Calendar integration and can disconnect their Google account at any time, which will prevent any synchronization from happening between **ProductiviDo** and Google Calendar.

<figure>
    <a href="{static}/images/posts/0039_productivido/settings.png"><img src="{static}/images/posts/0039_productivido/settings.png" alt="settings screen" style="max-width: 500px"></a>
    <figcaption>Settings screen.</figcaption>
</figure>

<figure>
    <a href="{static}/images/posts/0039_productivido/dark-mode.png"><img src="{static}/images/posts/0039_productivido/dark-mode.png" alt="dark mode screen" style="max-width: 500px"></a>
    <figcaption>Dark mode.</figcaption>
</figure>

## 4.3 Techniques and methods

<figure>
    <a href="{static}/images/posts/0039_productivido/help.png"><img src="{static}/images/posts/0039_productivido/help.png" alt="help screen" style="max-width: 500px"></a>
    <figcaption>Help screen.</figcaption>
</figure>

Beyond the libraries mentioned in section 3.4, the actual implementation of the application happened in the following way:

- **React Native bare workflow**: The application was developed using the React Native bare workflow, which allows for the use of native code in the application. This was necessary to implement the Google Calendar integration, which was not possible using the Expo workflow.
- **State management**: The application was architected in such a way that React Context was used to avoid "_props drilling_" and to provide a global state to the application, using data coming from the SQLite database loaded at launch. All context that does not require persistence is managed by React Context, while the rest of the state (e.g., settings) is managed by Redux Toolkit.
- **TypeScript**: The app was developed using TypeScript, a typed superset of JavaScript that compiles to plain JavaScript. TypeScript was used to ensure type safety and to provide a better developer experience with autocomplete and other features that help developers write code with fewer errors.
- **React Navigation**: The navigation between screens uses a combination of stack and tab navigation, with the main screens being accessible through the tab navigation and the rest of the screens being accessible through the stack navigation. Additionally, a drawer navigation is used to provide access to all secondary screens via the traditional "hamburger" menu.
- **NativeBase**: This library was used to provide a consistent look and feel to the application and get access to components that are not available in React Native. Many of its components were put to use in the application, including `Actionsheet`, `AlertDialog`, `Badge`, `FlatList`, `Modal`, `Switch` and `Transitions` to name a few.
- **Google Calendar API**: The application uses the Google Calendar API to allow users to connect their Google Calendar account to **ProductiviDo** and to create calendar events from new or existing tasks. The API is used to create new events, to update existing events and to delete events. The API is also used to retrieve the user's primary calendar and to retrieve the list of calendars available to the user.
- **SQLite**: The application uses SQLite to store all data locally on the device. The application uses the expo-sqlite library to interact with the SQLite database. The database is initialized at launch and is updated whenever the user makes changes to the data.
- **Form validation**: The application uses the yup library to validate forms and to provide error messages to the user. Coupled with `formik`, the library provides a great way to validate forms and to provide a consistent experience to the user.
- **Custom hooks and functional components**: This project explicitly embraces new React features such as custom hooks and functional components. The application uses custom hooks to encapsulate logic for all the main screens. The application also uses functional components to avoid the use of class components, which are considered legacy in React.

---

# 5 Evaluation: results and discussion

## 5.1 Successes

### 5.1.1 Planning and execution

Extensive research and preparation went into the project before writing a single line of production code. A multitude of potential implementations and concepts were explored in great details and the idea of the final product was refined from a very early stage, leading to a more focused development of the todo application. Because there existed a tangible vision of the desired outcome, it made it much simpler to define the database schema and the React context needed throughout the application to pass adequate data structures around. On a related note, doing all this work upfront helped to avoid wasting time learning libraries that would not entirely meet the needs of the application and to stop contemplating features that would not fit within the constraints of the chosen concept.

Another decision that proved to be quite useful was to postpone dealing with complicated services till much later during development. For instance, storing mock data as simple JSON allowed for quick iterations during development without having to manually add tasks one by one by using the application itself to do so. Once it came time to integrate database functionality, data was first stored as a temporary in-memory database for fast read/write speeds (because the task view, filtering and sorting was not optimized yet) and it was later persisted to disk. Likewise, external services (e.g., Firebase and Google Calendar) were only integrated until the internal application design was set in stone. Performance optimizations were favorably delayed until most of the logic was implemented, which gave ample time to test and refine the design, productively steering clear of premature optimization due to the changing nature of the application still being validated and tested by beta users.

### 5.1.2 Functionality achieved

One concept that served the final design well was a direct application of Fitt's law, which states that "_the time required to touch a target is a function of the target size and the distance to the target_", meaning that it is important to keep controls close and large when speed or accuracy matters. As a concrete demonstration of this law, tasks can be added with the touch of a single button in the **"Inscribe"** button located in the tab bar, making it frictionless for users to add tasks and events to the application. This meets the need of being "_always on_", especially since all data is accessible locally without the need for an internet connection, allowing users to quickly get their priorities out of their mind and onto a digital device to allow for proper referencing later on. Other critical interactions such as focusing tasks and completing them can be done by tapping on a large icon next to each task.

The application allows visualizing all tasks at once in the **"Prioritize"** screen, which contains all necessary filters in order to make filtering and sorting through a growing list of incoming data not only feasible but also simple and practical. Indeed, the lack of hierarchical organization in the information architecture is absolutely intentional. This design decision allows flexibility with the use of filters without incurring a cognitive cost to understand how information is organized. As long as users are diligent with the metadata they input in the application (as they should if they wish to accomplish their goals), they will be able to easily find the information they need in the **"Prioritize"** screen. Excluding the hierarchical access to information, all other aspects of information architecture (location, alphabet, time, category) are available as filters to the users.

The **"Focus"** screen intuitively lets users know which tasks are most important to work on at any given time, sorting them by deadline, priority and other metadata, making the data "_always actionable_". Since focused tasks are isolated from the rest of the data, users are able to focus on the task at hand without being distracted by other tasks. On this screen, users are able to complete tasks, which effectively disappear from the task list and are kept in the "**Accomplishments**" screen for later retrieval. This is a way to keep track of tasks that have been completed, which is a feature that is not available in the Google Calendar application and which complements its functionality very well. Additionally, this screen allows users to "restore" tasks, which performs the opposite action. Notably, it will prevent mistakes by letting users undo their actions; it will also allow users to review tasks and events that have been deleted and to permanently delete them as needed. This feature is not available in the Google Calendar application and contributes to making **ProductiviDo** a useful ally in this case so that events can be restored to the calendar view. The final active step required to use **ProductiviDo** effectively, found in the **"Review"** screen, provides complimentary functionality to that found in most modern calendar applica**tions. While** a calendar is useful to get a sense of upcoming events, a review system is needed to stay on top of one's priorities to make sure that time-insensitive yet important events do not slip through the cracks. The **"Review"** screen is a way to make sure that users are not only aware of the tasks and events they ha**ve scheduled**, but also of the tasks and events that they have not scheduled but are important to them. Furthermore, reviewing one's work periodically in an automatic way allows for better planning and will make sure that longstanding tasks are either updated, prioritized, delegated or removed.

## 5.2 Failures and limitations

The following points of failures are discussed in more details in section 6.2, where solutions for brighter times ahead are pictured.

### 5.2.1 Google Calendar integration

**ProductiviDo** solves real-world issues related to task management and scheduling in a robust manner, yet it does so partially. One major caveat to the current implementation is that it supports only Google Calendar, which severely limits the potential market the application can tap into. Because only Google Calendar was taken into account during this project, it is highly likely that the application will not be able to support other calendar applications without a major overhaul of the codebase. The application was thought to be a companion to Google Calendar from the ground up, which means that while it integrates seamlessly with it, it creates tight coupling between the two applications. There are in fact more issues to delve into when it comes to Google Calendar. In particular, full synchronization of tasks and events is not supported in a scalable way. For one, Google Calendar API's daily and monthly rates are limited: instead of calling that API on every little detail being updated in a task, the application should really try its best to batch requests so that heavy users will not be penalized if they happen to trigger many updates in their calendar or if Google decides to lower the number of requests that can be processed in a given amount of time. Another pitfall is that the application does not support recurring tasks as originally intended due to lack of human resources, which is a feature that is available in the Google Calendar application. While it is technically possible to implement this feature, more context would need to be stored in the application to avoid duplication of tasks in the database and to allow recurring tasks to be reset to their original state or updated as desired, all of which would need to communicate with the Google Calendar API in an efficient way. There is, at the moment, no task tracking facility: a completed task is simply removed from the list of tasks by updating its status in the database. This is a considerable limitation, since it prevents users from creating tasks that are recurring, such as weekly meetings or monthly bills.

### 5.2.2 Unit testing

One clear oversight in the development process was the lack of unit testing. While the application was profusely tested in a manual way, it would have been much more efficient to have had a suite of unit tests that would have allowed for a more sturdy and scalable application. **ProductiviDo** comprises a few essential unit tests regarding the Google Calendar integration, but it is nowhere near the level of testing that would be required to ensure that the application is robust and that it will not break in the future. Amongst some of the types of tests that should have been implemented are unit tests for the database, unit tests for the application's business logic, snapshot testing and testing of asynchronous API calls through mocking. In hindsight, the reason more tests did not make it into the final application is that the development process was not agile enough to allow for the time required to write unit tests and there have been too many side experiments that have taken priority over the core functionality of the application. Of equal relevance is the fact that unanticipated issues have arisen during the development process, which have required more time and effort to be spent on fixing them rather than on writing unit tests. It is also important to keep in mind that unit testing is not a one-time activity: it should be done continuously throughout the development process, more akin to the test-driven development (TDD) workflow. Failing in that department was a major setback for the application, since it will make it harder to maintain and to scale in the future and it likely contributed to the fact that more time was spent on debugging than was necessary.

### 5.2.3 Advanced features powered by AI

Besides the issues already raised in this section, there are a few other features that would have optimized the user experience, but which were not implemented due to lack of time as otherwise the scope of the project would have fallen appreciably out of reasonable proportions. For instance, the application does not support batch editing of tasks, which is a feature that is available in many other task managers in one form or another. It also does not support location-based notifications, which would have been useful to send reminders to users based on their location. The application does not make use of advancements in machine learning: learning users' preferences over time to provide helpful shortcuts when creating new tasks could have been a fantastic time saver. **ProductiviDo** could have stored task templates such that creating recurring tasks would be faster and more intuitive by providing logical default values based on what the algorithm thinks is going to be needed next. Similarly, the app could add locations, people, and other properties to tasks once it figures out that certain actions only happen in given locations or with the same people repeatedly. Yet another feature that would have proven handy would be to provide time-based notifications based on predictions from past data derived from tracking user movements and time taken to complete specific types of tasks. For instance, if a user has a task that is due at 9:00 AM, the app could send a notification to the user's phone at 8:45 AM if the user is at home, but at 8:30 AM if the user is at work once the travel time could reliably be estimated from prior activities.

---

# 6 Conclusion

## 6.1 Salient takeaways

**ProductiviDo** set out to fathom the needs of the modern-day, demanding user and to provide a novel solution to the problem of task management and scheduling. The application was designed from the start to work alongside Google Calendar, which is a popular calendar application that is used by many millions of people around the world. The application was designed to be a simple and intuitive task manager that would allow users to create tasks and events, to schedule them, and to track their progress. While there is room for improvement, **ProductiviDo** goes far beyond a proof of concept or "_Goldilocks Quality_" and shows how it can be used by anyone who wants to manage their tasks and schedule more efficiently, as it relies on strong scientific foundations that were dispersed throughout this work as convincing evidence backing up such a claim.

One of the key takeaways from this work is that despite a crowded task management digital market, innovation can take place by taking inspiration from different fields and by applying them to the problem at hand. In the case of **ProductiviDo**, the needs of business users and productivity seekers alike were distilled into an almost mechanical process, where the application flow is extremely simple and strives to put forward in a visually sensible manner all the required functionality to get work done without friction: this meant taking a few assumptions about users for granted, knowingly reducing the user base to better serve those who will resonate with the offering.

There are a few dominant players in the industry, albeit niches are still well underserved. Almost every software application out there in this space endeavors to serve customers in a very generic way, but it could be flourishingly argued that a task manager could be designed to serve a specific industry. For instance, a task manager for a construction company could be designed to be more intuitive for construction workers, who are not necessarily computer savvy, and could be designed to be more efficient for project managers, who are likely to be more tech-savvy. The same could be said for a task manager for a law firm, a task manager for a restaurant, or a task manager for a school. The possibilities are endless, and the key is to understand the needs of the users and to design the application to be as intuitive as possible. Even though "task templates" can, up to a point, be used to achieve this, nothing competes with a well-designed application that is tailored to the needs of a well-known target audience. Such applications will by definition be adopted within a given niche and will dispense unique value to the users. A generic task manager may be suitable for simple projects and may require fiddling around with the settings to get it to work for a specific use case, but a task manager dedicated to culinary chefs will natively understand and care for concepts such as "ingredients" and "recipes", which will be baked into the product (no pun intended).

## 6.2 Improvements and future research

Even though Google users abound, using exclusively Google Calendar as an calendar integration is not a universal solution. In the future, it would be interesting to explore the possibility of integrating other calendar applications such as Apple Calendar, Outlook, and others. This would allow users to use the application with their preferred calendar application and would also allow for a more seamless integration with the calendar application, which would be a great benefit to users.

Expanding on the notion of "delegatees" explored in this project, a task manager with built-in collaboration would be welcome to further satisfy the needs of business users. This is because a calendar can become social and collaborative by itself, and it is not uncommon for colleagues or friends to share their calendars with others. This is especially true for business users, who often need to coordinate their activities with other members of their team. It would certainly not be far-fetched to have business teams be formed and given access to their shared task assignments and calendars. This would allow for a more efficient and transparent way of working together, and it would also allow for a more efficient way of tracking the progress of a project and would pave the way to generating insightful analytics dashboards, another place where machine learning would shine by finding patterns and making it possible to optimize overlapping schedules and projects based on people's availability, area of expertise and so on.

Recent reports have shown that job creation and entrepreneurship is at its highest peak and that the United States of America is leading the way in terms of new business creation, with literally millions of companies being born each year. This is a great sign for the economy and it shows numerous opportunities in the business world when considering task managers embarking on a journey to become a collaborative platform for teams and businesses within a specific line of work. In the meantime, **ProductiviDo** comes to the rescue of the millions of people who are looking for simplicity and intuitiveness in a task manager to get their work done with less technological grinding.

---

# Demo of the app

<div class="youtube youtube-16x9">
<iframe src="https://www.youtube.com/embed/l_5JRL1UDzY" allowfullscreen seamless frameBorder="0"></iframe>
</div>
