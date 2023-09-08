Title: Book summary: Letters to a New Developer
Date: 2021-11-08 10:12
Modified: 2023-04-16 15:04
Tags: advice, best practices, books, career
Slug: book-summary-letters-to-a-new-developer
Authors: Sébastien Lavoie
Summary: If you are still early in your career as a software developer (or not so much!), I think you might enjoy reading _Letters to a New Developer: What I Wish I Had Known When Starting My Development Career_ written by Dan Moore, who also features [a very insightful blog](https://letterstoanewdeveloper.com/).
Description: If you are still early in your career as a software developer (or not so much!), I think you might enjoy reading Letters to a New Developer: What I Wish I Had Known When Starting My Development Career written by Dan Moore, who also features a very insightful blog.

[TOC]

---

# Introduction

I've taken quite a few notes while devouring that book, which is a quick and easy read. It's not the typical non-fiction, technically-oriented manual: this book makes you feel like having an older family member taking the time to sit right next to you to openly share all sorts of golden nuggets from a lifetime of rich and varied experiences so you can get prepared to face the challenges that lie ahead in your own career and avoid some of the more common mistakes during the journey. It is the kind of publication you can read literally five minutes at a time thanks to the convenient format it adopts.

Some of the following notes are verbatim and reading the whole title will be worth it! Nevertheless, you will find below some passages that deeply resonated with me, reflecting the gist of this prose from my perspective. Beware! There are numerous gems to be gleaned from this excellent author.

---

# Book summary

## First month at a job

- See problems as opportunities to contribute.
- During the **onboarding**, figure out:
  - All the **HR stuff**: benefits, agreements, bonuses, interacting with different departments, meetings, requesting vacation, raises/reviews cycles.
  - And the **technical stuff** too: who to ask questions to, how to ask them (batch them, chat, meeting, etc.), how long to work on a problem before asking for help, how to communicate progress, how to set up a local development environment, CI/CD and branches process, when do you know you're done working on a task, how are tasks managed (manager, issue tracker, etc.).
- Questions that arise and have no answers → See where to document them (e.g. wiki).
- **First impressions**:
  - Be there early.
  - Say what you'll do, then do it.
  - Research before asking questions (and record answers).
  - Volunteer to take extra work (don't become a punching bag, though).
  - Own your mistakes but don't make the same ones twice.
  - Be polite and professional, always.
  - Make sure with manager we're on the same page, working on the right stuff, at the right cadence with appropriate updates.
  - Write docs to make the next hire easier.
  - Have the reputation to be a hard, smart worker: it will follow you.
- Be ready for the trepidations: **celebrate successes** ("_today I [fixed, learnt...]_").
- **To excel**:
  - Communicate what you're working on.
  - Ask questions.
  - Don't make the same mistake twice: write down what went wrong and plan to avoid repeating them.
  - Show up consistently.
- **Know the team**: their names, their roles, their behaviours (who posts what, who is in which meetings, who seems funny and approachable on Slack, etc.).
- **Read code and take notes**: dig into a section of the system, follow data flow, make diagrams of how things are connected.

## Questions

- **Ask prepared questions**:
  - Research before asking.
  - Find where to search (Slack, issue trackers, YT, internal docs or wiki, etc.).
  - But also be mindful of how long you should spend time searching (Is there a tight deadline? Are you wasting your time?).
- **Ask good questions**:
  - Specify the problem in detail, narrow the scope as much as possible.
  - Show you've done _research_. Links, videos, posts, logs (without sensitive info), etc.
  - Follow up after a day or so to share additional research.
  - Express gratitude.
  - If you have the answer, add it.
- **Don't be afraid to ask questions**:
  - If it's a learning experience, spend more time figuring out the answer.
  - The more time you have before the task is due, the more time you should spend looking for an answer.
  - How busy is the rest of the team? If they can't help, you'll have to do it yourself.
  - If there's a bug that's really specific to the internal project, asking for help from coworkers is probably best (be careful not to disclose business knowledge!).
  - Have you tried working on other aspects of the task? It may unblock you.
  - Put in the effort before asking: research, list hypotheses, etc.
- **Ask why**:
  - It may help prevent mistakes down the line (e.g. wrong choice of tech) and get more perspective, understand better.
  - Document findings in wiki or similar (could be in a question/answer format).
- **If you don't know something**, don't guess or make an incorrect decision: admit it and say you'll find out the answer (may have to ask others in the process too).

## Writing

- **Read your texts out aloud**: spot typos, awkward sentences, etc.
- **Document the intent behind what you're doing** (code, reason for change, who asked what...).
- **Emails**:
  - As _short_ as possible. Otherwise, add _executive summary_ at the top.
  - Is it sensitive? Maybe have face-to-face instead.
  - Add _links_ to supporting documents rather than attaching them. Email chains are hard to follow: may put them in a document instead.
  - Don't use _relative time references_.
  - Keep them _focused_: go into _one topic_. New topic = new email with different subject line.
- Real-time messaging: Default to _public_ channels to benefit the organization.
- _Write a technical ebook_: working on a complex project over time and being able to see the high-level and details, all presented in a coherent way for the readers.
- **Write and update technical documentation**: you save time in the long run, it's useful for you and the rest of the organization.
- **Blog**: this is the process of clarifying your own thoughts. You'll be a better writer and thinker for it.
- **Motivation about writing**:
  - It crystallizes thoughts, make them clearer;
  - Builds credibility;
  - Helps others;
  - Illustrates an ability to convey technical information and context.

## Tools to learn

- **Leverage for increased productivity**:
  - _Test suite_: living documentation. Can evolve code base without fear.
  - _Libraries_ and _frameworks_: saves time.
  - _IaaS_ (infrastructure as a service, e.g. AWS EC2): can use APIs to manage.
  - _Paas_ (platform as a service, e.g. Heroku): Allows to focus on business logic.
  - _Saas_ (software as a service, e.g. Google Apps): integrate with existing software.
- **Command-line**:
  - _Typing is quicker_ than using GUIs for many tasks.
  - Can automate _recurring tasks_ easily.
  - Can easily _share task scripts_ with others.
  - _jq, awk, sed_: put them to good use.
- **Version control**: if in doubt, use it, except for large files and other scenarios that don't make sense.
- **Text editor**: learn one well.
- **IDEs**: Use them when it makes sense (programming in Java with a text editor? Probably a bad idea).
- **Standard library**: get a good overview of what's available, leads to transferable skills, more idiomatic code, better tested, etc.
- **Automated testing**:
  - Prevents bug regression.
  - Serves as live documentation.
- **Network engineering**: Learn about it, it will pay off. Know:
  - Basics of routing;
  - Basics of DNS;
  - Rundown of the OSI model;
  - TCP/IP, HTTP, what a proxy is;
  - Answer questions like How do CDNs work, what's the difference between HTTP and WebSockets, how does SSL work, what can nginx be used for...
- **SQL**: this is fundamental knowledge as it's almost everywhere.
- **Debuggers**: learn how to debug in your IDE, on the command-line and in a web browser (your IDE won't always be available).
- **Benchmarking**: do not optimize prematurely and use benchmarking tools when performance matters to see if the code is fast enough.
- **Search engines**: learn to be an expert Googler.

## Practices

- **Solve problems, don't just write code**:
  - Use library/framework.
  - Use third-party SaaS tool.
  - Make sure tasks need to be done. (Why are you doing it? Does it provide value?)
  - If a task isn't recurring often enough, manual work may be the best way to go (time to automate vs. actual savings).
- Think ahead, envision all paths (not just the happy one) before taking a decision.
- **Read code**: scan it; dive down; use the _scientific method_ to make changes and debug.
- **Get good at estimating your work**:
  - _Opportunity cost_ (can't do everything: prioritize and do the tasks that _bring the most value_).
  - _Scheduling_: software is not built in a vacuum, hard and soft deadlines will occur.
  - _Discussing requirements_ first can save a lot of troubles and money: building the wrong thing quickly is of no use. Use lightweight prototyping tools instead of building the whole software.
  - Recommended reading: [Software Estimation: Demystifying the Black Art](https://www.goodreads.com/book/show/93891.Software_Estimation), by Steve McConnell.

Here's one way to keep track of your estimates in a spreadsheet:

| Task                                                                                           | Low estimate               | High estimate                                                | Notes, questions, research                                        | Final estimate                                | Estimate in days                                               |
| ---------------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------- |
| Requirements definition, research, development, testing, deployment, estimates on bug fixes... | Everything going smoothly. | Facing obstacles, having to rebuild part of the system, etc. | Answer questions and verify assumptions to complete the estimate. | (low + high) \* 1.2 (add 20%, "fudge factor") | Total hours estimated divided by number of ideal hours per day |

- _Tracking the actual accuracy of tasks_ can be insightful too.
- Always tell people who are depending on the completion of a task _if it's going to take longer than expected_. Share alternative solutions if you have any.
- Even for side projects or when working on open source projects, it may be useful to _practice estimating_ (and users like seeing a roadmap).
- **Debug systems**:
  - Make the problem as _simple_ as possible.
  - Begin with an _hypothesis_ and either prove it or refine it.
  - Determine the _desired end state_: fix the root problem but if it's too costly, find a workaround if possible.
  - Pay _attention_ if anything seems amiss.
  - Keep _notes_ about what you've tried.
  - If there's a new bug, _inspect recent changes_ in the log.
  - Write an _automated test_ before fixing the bug so it doesn't reappear and you'll be sure when the bug was fixed.
  - Follow the _flow of data_ (e.g. in a three-tier application, start with the browser or with the database).
  - _Minimize impact_ for users if the bug is in the production environment. Ideally, test on the _staging_ environment.
  - _Test the right thing_. Make sure that what's being tested mirrors as closely as possible where the bug appears.
- **Assume positive intent**: be solution-focused.
  - _ROI on trust_: about 4% of the population are sociopaths; meaning 96% of the population has some working conscience and could be trusted by default to reap great benefits. This may speed decision making, for instance.
- **Express gratitude**: it will make you feel better and showing appreciation to others will make working with colleagues a breeze. Thanking people and writing a _gratitude journal_ will be helpful.
- **Cultivate the skill of undivided attention**:
  - To produce your best output, you need to _commit to deep work_.
  - To thrive in today's economy, you need to _be able to quickly master hard things_ and be able to _produce at an elite level_ in terms of both _quality_ and _speed_.
  - To learn hard things quickly, you must _focus intensely without distraction_.
  - _Add routines and rituals to your working life_ to limit the amount of willpower required to get started.
  - Book recommendation: [Deep Work: Rules for Focused Success in a Distracted World](https://www.calnewport.com/books/deep-work/), by Cal Newport.
- **Build empathy**: Remember your own frustrations. Your users are people who can struggle on tasks you'd find simple yourself. They're trying to make something work, just like you.
- **Don't complain about the code**:
  - It's not helpful.
  - It displays a lack of empathy.
- **Avoid jargon**: If you can't explain it to a non-technical user, you don't understand it well enough (good framework: try the [Feynman Technique](https://en.wikipedia.org/wiki/Feynman_Technique)). You gain clarity for yourself, the ability to teach others and you can influence your organization. (Personal additional: get good at critical thinking and use [frameworks for better thinking](https://untools.co/)).
- **Time is money**: _buying services from others gives you time_.
  - Buying a book or video instead of reading free documentation.
  - Buying and using exceptional tools (e.g. JetBrains IDEs).
  - Paying for support.
  - Buy commercial software.
  - Pay for consulting or training.
- **Say no**:
  - If there are pending tasks, ensure they are worked in the _right order of priority_.
  - _Life is short_: if you end up working 90 hours per week, make sure you're happy doing it and are not sacrificing other important aspects.
- **Build on your own**: pick a project you can envision yourself sticking to for more than six month and learn.
- **Consistency is key**: learn by showing up every day. Becoming great at something takes time.

## Understanding the business

- **Software is about people, not code**:
  - Software is created for people.
  - Users need to be heard to buy in.
  - Most people don't care about the code. _Their goal is to get things done_. Beautiful code that doesn't solve the right problem is useless.
- **Outcomes over output**: the end-goal for the business is more _revenue_, more _profit_, more _users_, more _product availability_, happier users, etc. Your contributions should be holistic in nature and work towards achieving these goals.
- _Understanding the big picture_ of why money is spent on certain projects or services pays off as you can better contribute to the bottom line of the company by knowing why things are done the way they are.
- **Business model**: know how money is being made. Get a good understanding of the domain in which the business operates.
- _Knowing how software is used at the company_ helps you to understand the business.
- _The size of a company impacts how it solves problems_: a bigger company will usually move more slowly towards its goals when change is required, attacking possibly bigger problems with powerful tools and teams. A smaller company may pivot more quickly and shift focus, but it may not work on problems of comparative scales.
- **Starting a company**:
  - As a new developer, starting one wouldn't be wise. Learning to become a software developer and learning how to run a business all at once can lead to a huge amount of stress.
  - _It will take longer than you think_.
  - Know your _financial runway_ ("burn rate" vs. what you have in the bank). Extend it by lowering the burn rate.
  - Consider your _emotional runway_: how are things going for you outside of work? Are there any trying events like moving or having a new baby?
  - _Talk to your customers_: learn from them. Get feedback.
  - _Provide value to customers_: you won't have time to make everything go as smoothly as you'd like, but the customer must still be served.
  - _Know your market_.
  - Be ready to move away from code and focus more on a position of _management_ as the company grows.
- _Learn from your customers_:
  - Digging into a ticketing system will be informative to understand how a product is being used and may reveal flaws or bugs.
  - _Focus on the problems mentioned, not on the solutions proposed_.
  - Ask them about their pressing problems, not only those that have been reported so far. This may inform about issues with related systems.

## Learning

- **Never stop learning**:
  - Be clear about _why_ you want to be learning.
  - Once you have the why, determine the _what_ that will take you there.
  - Once you have both of the above, find the _how_.
  - Execute.
- **Build expert intuition**:
  - It's the difference between a junior and a senior developer.
  - A regular world + many opportunities to learn + frequent feedback + expert intuition.
  - Regular world: gives a chance to find out whether you'd prefer to specialize in a specific branch of the software development tree or remain a generalist.
  - Many opportunities to learn: write code, work on technical projects and observe those who are more senior than you.
  - _Frequent feedback_: code reviews and one on ones with the manager. Reflect on your performance with a daily _journal_.
- **Know what to learn** (i.e. general skills vs. specific technology and techniques):
  - _Domain knowledge_: understand the business you are in, who the major players are, etc. If you stick in a given domain long enough, you become more valuable as this kind of knowledge tends to last a long time. Talk to experts and read books.
  - _Theoretical expertise_: data structures and algorithms, HTTP and best practices fall within this category. It serves for years as a solid foundation for everything else. Books are a fine source to delve deeper.
  - _Practical knowledge_:
    - React, Kubernetes, Rails are some examples of specific technologies that belong in this category.
    - Have a good understanding of the underlying technology whenever possible (e.g. learn the language in depth, not just the framework).
    - This type of knowledge _tends to age quickly_ and can be learnt through _videos_, _conference talks_ and _tutorials_.
  - _Leadership knowledge_: This will pay dividends through your career. Books and experience in the real-world are useful here.
- **Avoid being an expert beginner** (an authority with nontransferable skills):
  - Never believe you have all the answers.
  - Don't bend tools to do something they weren't meant to do.
  - Don't ignore best practices (but don't blindly apply them everywhere either!).
  - Keep in touch with the larger software community: you may temporarily be at the top somewhere technically speaking, but that won't remain true in a bigger context.
  - _Pair with people that are more experienced than you_: ask them questions, read the pull requests they submit.
- **Pattern match to be a just-in-time learner**: explore by pattern and analogy (e.g. compare terminology that's similar to tools you've used before) and learn just enough to get the task done. Learn the nuances as you go.
- **Learning boring stuff**:
  - Focus on the big picture. _Why_ are you learning this?
  - Notice the _fun_ parts.
  - _Take breaks_ when needed. If no strict deadline is in sight, you might cross off a different task on your to-do list for now.
  - _Automate_ what you can but consider clearly the time savings when doing so.
  - _Learn relevant things_: this applies once you have a base to lean on, but accumulating random concepts that aren't often applicable after that isn't useful (unused knowledge rots and gets forgotten).
- **Your team will teach you**:
  - They can teach you more than you can learn on your own: tools; languages; frameworks; business domain knowledge; approaches to problem-solving; understanding of the problem; stakeholder empathy.
  - _Observe how senior people work_ (face-to-face, read their code and pull requests).
- **Use an RSS reader**: for blogs, online community discussions, tags in Stack Overflow, news sites.
- **Listen to podcasts**: good to gather ideas about high-level concepts while doing other things (dishes, exercise, watering plants, cooking, etc.).
  - Listen to those that are _domain specific_ to help you at work.
  - _Technology specific_: expose yourself to tools, techniques and libraries.
  - _General software development_: those are broadly applicable to software engineering and will work across different jobs you have within the industry.
- **Subscribe to email newsletters**: great to get curated content on a given topic. These could include software development practices, security, AWS and career skills.
  - Find them with searches like `<subject area> weekly/email newsletter`.
  - _Read the archives_ first to get a sense of whether you'll enjoy the content.
  - Like with podcasts, focus on what's interesting and _skim_ the rest.
  - When sources lead to more articles of interest, those can be captured in your _RSS reader_.
  - Good to _explore new technologies and frameworks_.
  - To start your own, [TinyLetter](https://tinyletter.com/) is a great option.
- **Read great books about software development**: don't look for cutting-edge information but rather for a source of timeless practices.
  - Good examples include [The Mythical Man-Month](https://archive.org/details/mythicalmanmonth00broo), [The Pragmatic Programmer](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/), [Refactoring](https://martinfowler.com/books/refactoring.html).
  - _Ask great engineers_ you respect for recommendations.
- **Listen actively**:
  - _Do not multitask_.
  - _Take notes of..._ salient points; ah-ha moments; terms to review in the future (those concepts you may not understand). Note the date of the conversation as well.
  - If it is a video chat, see whether it can be _recorded_. Turn on video if possible to get contextual clues.
- **Learn two programming languages**:
  - Lets you see the strengths and weaknesses of your first language.
  - May support concepts that weren't there before (e.g. classes in Java vs. their absence in Perl).
  - Makes it easier to learn a third language.
  - Illustrates _different approaches_ to common problems.
  - Teaches you how languages fit certain problems better than others.
  - Makes you less passionate about your first language. _Programming languages are only tools_.
  - Makes it clear what you understand about language #1.
  - Tutorials are great to get started and _side projects_ even better to cement the learning.
  - Generally, _learn at least two of "everything"_ (e.g. databases, frameworks, development methodologies, etc.).

## Mistakes

- **Get used to failure**: learning something new is difficult. _Document internal knowledge_ as best as you can so the same mistakes do not repeat themselves. Look around (online, colleagues...) to make sure the problem you are trying to solve hasn't been worked on already and take any new information into account.
- **Making mistakes is okay**:
  1. Find out what the _oversight_ was so you don't repeat the same mistake.
  2. _Acknowledge_ you made an error.
  3. _Clean up_ the mess, with or without help.
  4. _Avoid making the same mistake again_. You might keep notes around, write a blog post, etc. Document it or create a script to solve the issue from now on if applicable and share your new knowledge with the rest of the team.
- **Mistakes are forgiven, hiding them is not**:
  - Make sure you did a mistake to start with.
  - The people who need to know about your errors should be told. _Transparency and honesty are important_.
  - Think of a plan to fix the mistake (both short-term and long-term).
- **Don't make the same mistake twice**:
  - Make sure you understand what the mistake was.
  - Dive deeper when it makes sense. For instance, it is worth mastering a version control system as this is a tool that's going to be used all the time and is critical to understand when working with other software engineers.
- **Don't be afraid to "fail"**: the only true failure is to quit working towards success.
  - Failures don't stop happening when you become a "better" developer.
  - The more you fail, the more you learn.
- **You don't know what you don't know**. Doing pattern matching and recognizing concepts at a high level will help when there's a need to dig deeper.
- **When you see someone else making a mistake**:
  - _Make sure you have all the necessary context_ (you usually don't have it) before jumping in to shine a light on how you think things could be done or fixed.
  - Make sure you _fully understand the issue at hand_.
  - _Think about the ramifications of a poor decision_: the higher the stakes are, the more likely it is that you should/could intervene.
  - _Contemplate your role_: depending on the relationship you have with that person, tolerance levels will change (personal note: ask questions early as needed, but make sure you show progress as stagnation won't lead to joyful relationships with your colleagues and may get you fired).
- **It's OK to fail and it's OK to feel bummed about it**. See how core/important the task is for the company, whether somebody else would be better positioned to do it, how long it would take you to become good at it, whether you enjoy it, whether there's another way to solve the problem, if there's someone else at the company who could teach you. Don't beat yourself up with despair: be strategic about the way you spend you efforts.
- **Admit your weaknesses... and own them**.
  - Is it something innate, like bluntness, or is it something you can learn, like Python?
  - If a weakness is related to a core competency needed for your job, be proactive in overcoming the obstacle or find another job that's better suited to your skills.

## Your career

- **Favor learning over earning**: take the job with the highest learning potential.
  - _Beware of stunting your growth by working alone_.
  - You will become more valuable to your future employers and have a better idea of what you like.
- **You will never be in a better position to leave a bad job than before you start**: interviewing is a two-way street.
  - Do your research before accepting a job offer.
  - Investigate through your network, e.g. LinkedIn, if you have a connection that worked at that company and ask about the good and bad of this organization.
  - Ask good questions about the company during the interview.
  - As an exception, you might want to consider getting your feet wet in the industry with your first job by being less picky, especially if the job market is bad. Experience will prove useful.
- **Pick a flaw**: no company is perfect.
  - _You don't want an indifferent team_ just punching the clock and waiting for the week to be done.
  - Avoid nonsense: ask how a typical day goes, who makes decisions about priorities, in what kinds of projects does the company shine and what the best and worst parts of a job are.
- **Preparing for a recruiting event**. Have: a resume; a good intro to yourself; a good conversation you can have; be well presented.
  - _Resume_: make sure you have the address, phone, email, GPA and graduation date (for students) at the top. It should show you're motivated, skilled, passionate, adaptable, collaborative and articulate. When you have less experience, projects should be the centerpiece of your resume. Project descriptions should be brief and focus on the _what_, _why_ and the outcome, avoiding mentions of tech stack unless it adds to the narrative. These can be side hustles, open source, personal interest or hackathons. Have more than one resume for different audiences.
- **Practice programming**: _you learn by doing_.
- Start at a consulting company if you're looking to gain experience across technologies, domains and businesses. Work for a small one if you want to have an impact. This will provide contacts and set you up for future work. Seek out mentorship, request conference attendance and pursue assistance as formal education programs tend to be lacking in those environments.
- **Potential vs. delivery**: Ask smart questions, show you've learned stuff. Say what you're going to do, then do it.
  - The more experienced you become, the more you are assessed on your _ability to deliver_.
  - Expect to demonstrate your experience during interviews.
  - Periodically, or when you complete a project, take a few minutes to _write some lessons you've learned_.
  - _Take risks early_ as pivoting later on in your career becomes more difficult.
  - Book recommendation for more senior developers when switching domains, tech stacks or employers: [What Color Is Your Parachute](https://www.parachutebook.com/), by Richard N. Bolles, with Katherine Brooks.
- **Maintain work-life balance**: preserve a firm boundary. _Work is a marathon, not a sprint_.
  - Get clear on how the employer expects you to handle unplanned work with conflicting priorities.
- **Listen to the voices when they help and ignore them when they don't**:
  - _Be willing to do things you didn't think you wanted to do_.
  - Connect with non-tech people outside of work to take a break and experience life from their point of view too.
- **Manage your career**: _know your goals_; _communicate your goals_; _progress towards them_.
  - Knowledge: pick an interest and follow it. Plan for a decade or more, with some milestones in between.
  - Communication: communicate your desires and ambitions. Good companies want to see their employees grow.
  - Progress: study for a certification, read a book, go to a meetup. Be active.
- **Know your runway**: this is the time you have at your current spending until you have no money. Calculate it once a month and know how long it would take to get a new job (guess).
  - _Get a job before you need to_ to avoid accepting an ill-fitting job due to desperation.
  - _Cutting expenses_ is hard but it's where you usually have the most control.
  - Spending savings for a career transition is an _investment_ in yourself.
  - Activities that draw down your savings should lead to new opportunities and valuable personal knowledge.
- **Managing one on ones**: for remote ones, it's best to have a _great Internet connection_, a _quiet space_ and _video turned on_ (personal note: you do lose visual clues without video, but you can connect deeply without anyone being too self-aware with voice-only communication).
  - Regular ones (weekly or bi-weekly) are preferred so you don't dread feedback only when you ask for a raise or do something wrong. Knowing your manager beyond these scenarios will help.
  - Reasons to schedule them: understand where we are headed so I know what to learn; know how I can best help the manager and the company; understand your priorities better.
  - The direction of the one on one should be _determined by the employee_.
  - Shoot for _regular_ ones that _do not get re-scheduled_. Otherwise, propose having them less frequently if needed.
  - If one-on-one meetings aren't desirable, go for an asynchronous _weekly status report_ and get feedback from your manager this way: _it is critical for your career growth early on in your career_.
  - Come with a _prepared agenda_ to make the most of them. A shared document in reverse chronological order works well. Example questions to add:
    - How should I have handled situation `X`?
    - I would like to learn more about `Y`; what are the opportunities?
    - I'm struggling with `<problem>`, do you have any suggestions?
    - What are the challenges you see facing our team during project `Z`?
  - You should be able to _trust and rely on your manager/boss_. If not, improve the relationship or go elsewhere: being constantly under threat and not knowing what to expect is mentally draining.
- **Write a brag document**: show everything you're proud of so they know you're a great team member. It should be thorough yet easy to read. Along with the agendas from your one-on-one meetings, it will serve to highlight your accomplishments for your next performance review.
- **Be adaptable and authentic**.
- **Working remotely**: you need a _fast Internet connection_; _iron discipline_; be okay with _solitude_ and have the _ability to work through communication obstacles_.
  - _If you are comfortable asking a dumb question, remote work can work well for you_.
  - You will need to _get used to asking questions and interrupting others_ as you more often than not won't have enough context to infer whether it's a good time to ask or not. It's better than the alternative of wasting your time.
- **How to go through a layoff**: _this isn't personal and you will get through it_.
  - Ask questions:
    - Know the deadline to sign the necessary documents;
    - Find out if there's a severance and how much is it;
    - What about funds like 401k, FSA or HSA;
    - How can I say goodbye to teammates (emails and LinkedIn are good options);
    - What about company's property, e.g. laptop, books and equipments;
    - Who can I contact if have I more questions;
    - Make sure they have your personal email;
    - Take notes of what happened;
    - Get involved with a lawyer before signing anything (e.g. non-compete agreements).
- **Use LinkedIn**:
  - Send a note when you connect and keep in touch with past colleagues.
  - Ask recruiters about the job market, salary ranges for people with your experience and good skills to learn.
  - Review your connections' companies, review posted jobs and ask for introductions from your connections (let them know why the company is awesome, why you're awesome and why you want to work there).
- **Contracting**: try it during the first decade of your career.
  - It's easier than applying for a full-time job given you're easier to let go.
  - It will keep your skills sharp if you want to find clients.
  - If/when you're an employee again, job hunting won't feel as scary.
  - You will _strengthen your network_ by being able to refer former colleagues.
  - Contracting can be more lucrative on a per-hour basis.
  - _Contracting via an agency_ is easier (you avoid sales and accounting) but it pays less.
  - _Direct contracting_ is harder but you'll learn beyond software development (sales, customer support, marketing, invoicing and chasing payments). It leads to more control over the clients you work with and more income. You may spend as much as 50% of your time on non-billable work such as seeking new opportunities: your rate needs to reflect this.
- **Engineering management**: if you move to a management position, _be prepared to be a novice again_ as the skill set involved is not the same.
  - You should understand the code but _keep out of the critical path_.
  - _You shouldn't make technical decisions_.
  - You are here to _enable teams to do great work_.
  - The fun, technical stuff should only be done during hackathons.
  - _Be clear about what you want_ and _maintain the right set of skills_ so you can keep doing what you enjoy the most.
- **Someday, you won't want to code for a living**: becoming a manager gives you leverage to have more impact in the world.
  - Impact can be achieved through writing, project management, product management, speaking, starting a business, mentoring, leading a team, managing, teaching, architecting and consulting. Notice that coding is not the primary output.

## Community

- Building a community/network puts you in a situation where **you can help people help others**.
- **Meetups**: find one on [meetup.com](https://www.meetup.com/).
  - It will expose you to _new ideas_ you can bring to your job.
  - You can have _professional conversations with low stakes_.
  - It gives you a way to _practice talking_ to new people and _make friends_.
  - It provides a network outside of your coworkers should you need to _find a new job_.
- **Conversational hooks**: give some details about where you work and what projects you have been working on to give the chance to the other person to steer the conversation in the direction they want. Flip the question to ask people to talk about themselves (most people like to do that).
  - _Don't make transactional conversations_: find something interesting to talk about.
- **Online tech communities**:
  - _Sign up for an email list_ related to the technologies you are interested in. _Sign up for notifications on projects_. You can _follow project contributors on Twitter_ or other social media places.
  - For something more general, have a look on _Slack_, _forums_, _IRC channels_, _Facebook groups_ and so on. _Slashdot_, _Hacker News_, _Reddit_, _Stack Overflow_ are other good options.
- **You get what you give**:
  - Offering to help _makes you more empathetic_ and _aware of other people's needs_.
  - _It feels good to help_.
  - _You become less arrogant_.
  - You help _build the positivity of the community_.
  - People will be quicker to _recommend you for a job_.
  - It improves your _sense of self-worth_ and _confidence_.
- **Build your work community**:
  - Use _LinkedIn_.
  - _Never leave a job on bad terms_. Give the requisite notice, document your work and prepare for a hand off.
  - Keep in touch with past coworkers, even if it's just to leave a note on their work anniversary.
- **Three daily mantras**:
  - _Surround yourself with people smarter than you_.
  - _Build community and give without expecting anything in return_.
  - _Listen to your gut, without exception_.
- **Build a personal board of advisors**.
  - Some issues you can discuss with them that aren't topics for current coworkers:
    - Someone under your supervision is not succeeding;
    - You have an issue with your manager that you're not sure how to solve;
    - You are evaluating job offers.
  - Make sure to keep these relationships fresh and _offer to help too_.
  - _This circle shifts over time_: a new developer doesn't have the same questions that a team lead would have.

---

# Conclusion

That's it: we went through a short overview of a book I've enjoyed and recommend heartily. You can find more on [the author's website](https://letterstoanewdeveloper.com/). You might also enjoy a follow-up book summary about [The Effective Engineer]({filename}/learnings/0036_the_effective_engineer_book_summary.md). May you live this knowledge!
