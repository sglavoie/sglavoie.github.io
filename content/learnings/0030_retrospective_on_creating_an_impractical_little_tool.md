Title: A retrospective on creating an impractical little tool just for fun
Date: 2022-09-18 20:06
Tags: lessons, open-source, retrospective, terminal
Slug: a-retrospective-on-creating-an-impractical-little-tool-just-for-fun
Authors: Sébastien Lavoie
Summary: Sometimes, spending hundreds of hours on something that could easily have been achieved in a fraction of the time makes for a rewarding journey! While it's important to be selective about where our attention goes in the first place, it matters equally to realize when the end of the rope is in sight so we can jump off the boat with good enough timing...
Description: Sometimes, spending hundreds of hours on something that could easily have been achieved in a fraction of the time makes for a rewarding journey! While it's important to be selective about where our attention goes in the first place, it matters equally to realize when the end of the rope is in sight so we can jump off the boat with good enough timing...

[TOC]

---

# Introduction

Building little projects to scratch one's own needs is a great way to practice the craft of software development, or at least this is some consistent advice I have picked up from legendary figures in the field. Whether it be formulated by the famous [John Carmack](https://twitter.com/ID_AA_Carmack) ([an excellent interview with Lex Fridman was recently released](https://www.youtube.com/watch?v=I845O57ZSy4)) or a rising star like [The Primeagen](https://twitter.com/ThePrimeagen) (he has a fantastic [YouTube channel](https://www.youtube.com/c/ThePrimeagen) too), the core of the message remains the same: _deliberate practice is required to make progress_.

While I was in the middle of completing a BSc in computer science, I decided that a simple and reliable spreadsheet was not enough to keep track of my grades and decided to tackle the creation of a TUI -- terminal user interface -- to come to my rescue by providing, hopefully, correct answers. And so [uol-grades-calculator](https://github.com/sglavoie/uol-grades-calculator) (`ugc` for short) was born out of the desire to learn more about [TDD](https://en.wikipedia.org/wiki/Test-driven_development) in a practical way, the [Hypothesis](https://hypothesis.readthedocs.io/en/latest/) testing library written in Python, [Sphinx](https://www.sphinx-doc.org/) and [Read The Docs](https://readthedocs.org/) for publishing nice-looking documentation in reStructuredText format (the Markdown format being another option). Even though the goal of this tool has never been to gather a growing user base, it was a good learning experience because alternatives to it spawn up over time and, arguably, some of them were much friendlier and simpler to use (who would have thought that...).

---

# Setting up the stage

To put things in perspective, this tool was never really under active development, but it did receive updates from August 2020 until September 2022, so the project slowly took shape in a time frame of a little over 2 years as can be shown in the following repurposed Gantt chart, where the length associated with each Git commit corresponds to the amount of time elapsed from one commit to the next.

<div style="max-width:100%; height: 60vh; overflow:auto;">
<img src="{static}/images/posts/0030_a_retrospective_on_creating_an_impractical_little_tool_just_for_fun/diagram.svg" alt="ugc's development timeline" class="max-size-img-post" style="min-width: 1800px" />
</div>

## Vim magic behind the scenes

While the chart itself is neither the prettiest nor the most interesting, the _how_ of it has a possibly more entertaining story attached to it:

- The list of commits was extracted with the command `git log --pretty=format:'%s    : %cs' > commits.txt` to get a one-liner for each commit with the description followed by the date, piped/stored in the text file `commits.txt`.
- Some Vim regex magic was done to substitute the first '`:`' character on each line so that [Mermaid](https://mermaid-js.github.io/) wouldn't struggle to render the graph: '`%s/^\(\w\+\): /\1 - /`'. This pattern was actually predictable because the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) was followed religiously right from the beginning.
- The previous command left some '`:`' characters in there that weren't needed, so they were removed except where a digit was immediately following such that the last part of the line including the date would be left in place (here, `\v` is the "very magic" flag used so that we don't need backslashes around the captured group, i.e. the digit, which looks a bit more readable): '`%s/\v: (\d)@!/ -`'.
- To show the elapsed time between two commits, a Vim macro was concocted so that the date on the current line would be copied and pasted on the following line in a specific way, which works because the Git history appears in chronological order by default: '`kf:wv9ly0jA,^[pj0`'. It's Ugly but it gets the job done ;).
    - In essence, it goes up by one line (`k`), searches for the `:` character with `f` (which precedes the date), moves ahead by one `w`ord, highlights the date which is in the format `YYYY-MM-DD` with `v9l`, yanks/copies the date with `y`, goes back to the beginning of the line (`0`), goes down one line with `j`, `A`ppends a `,` at the end of the line, goes out of insert mode with a `Ctrl - c` shortcut (which visually translates to the escape sequence `^[`), `p`astes the date, goes down one line again with `j` to be ready to process the next date and goes to the beginning of the line again with `0` so we don't miss a match. Vim macros are definitely quite expressive in a terse way!
    - Then, it's just a matter of running the macro for the number of lines below the cursor in the file. We can quickly get a sense of the number of lines in the file with `Ctrl - g` and run the macro on the required number of lines with `100@a`, replacing `100` with the number of lines and `a` with the register where the macro was saved (in this case, in the register `a` with `qa` to start recording the macro there, which is to be stopped by pressing `q` once more in normal mode).
- Once the macro is run, the output needs to be reversed so that the initial commit can be displayed where the graph starts in the top-left corner, which can be done with the [clever command](https://vim.fandom.com/wiki/Reverse_order_of_lines) '`g/^/m0`': it runs on every line of the file, successively putting each line at the very top of the file (line `0`) to have the effect of reversing the whole document!
- Finally, the graph is generated literally by copying and pasting that list of commits into a Mermaid textual chart, which shall be the topic of another post!

The whole process is done in a few minutes at most, making it a nice solution to deal with manageable outputs under a few thousand lines. Otherwise, it might be more convenient -- albeit a bit more time consuming too -- to write a script to do the work since Vim macros, when run at a relatively large scale, can be slow and error-prone.

# What went well

With all that fluffy preamble, we might hope that something went well in the end. Well, there were a couple of noteworthy things indeed:

- Even though I worked on this project alone, I created a bunch of [GitHub issues](https://github.com/sglavoie/uol-grades-calculator/issues?q=is%3Aissue+is%3Aclosed) that I assigned to myself, each with its own set of tasks, acceptance criteria, a short analysis section as required, linked pull requests and referenced commits. It is more work and arguably could be done more simply in a notes application, but _it feels good to be publicly accountable for one's work_ and that also encouraged (very few) people to submit their own issues. Additionally, managing tasks on a platform like GitHub makes it easy to review the state of a project and to manage a backlog of tasks, which was a nice plus when the project was linked to what was meant to be its successor, [uol-grades-calculator-server](https://github.com/sglavoie/uol-grades-calculator-server), a backend using `ugc` as its API which was to be hooked to a React frontend to display the data (more on that in the list of things that went poorly).
- _The TDD approach was embraced_ right from the start and I consider that being one of the highlights of the project in hindsight. With over 250 tests (some of which are randomly generated to do property-based testing with Hypothesis), I felt confident it was giving somewhat sensible answers.
- _Best practices were adopted_: Pylint, the king of complainers amongst the Python linters, was very verbose but set up to be slightly more quiet after a while. A `pyproject.toml` file was included, a clean `pytest` config file was used to automate the input of some parameters when running the test suite, the project was developed with the intention of being [deployed as a package](https://pypi.org/project/uol-grades-calculator/), only popular and stable libraries were used and just as importantly, only portable formats like JSON made it to the final version of the project.
- _Sub-modules were created_ to make everything a bit more... modular.
- _A GitHub workflow was added to automatically deploy new releases_ to [PyPI](https://pypi.org/).
- _Documentation was generated and hosted on Read The Docs_, with clean outputs and images and an entire section dedicated to developers (i.e., myself :)) so that reproducibility wouldn't become an issue for any step taken along the way.
- Using [pre-commit](https://pre-commit.com/) helped with catching some annoyingly formatted code before reaching production by taking advantage of _Git pre-commit hooks_.

With what seems like a glowing review so far, needless to say, a whole lot went wrong too.

<figure>
    <a href="{static}/images/posts/0030_a_retrospective_on_creating_an_impractical_little_tool_just_for_fun/ugc_summarize.png"><img src="{static}/images/posts/0030_a_retrospective_on_creating_an_impractical_little_tool_just_for_fun/ugc_summarize.png" alt="ugc_summarize" class="max-size-img-post"></a>
    <figcaption>Illustrating the <code>summarize</code> command.</figcaption>
</figure>

---

# What could have been done better

- Independently of the expectations with regards to the user base, it would have been beneficial to _do more research and planning_ initially before writing a single line of code. After working on other projects, I've found that what works well for me is to follow a specific set of steps, broadly speaking:
    - _Gather a list of requirements_ as precisely as possible to validate assumptions and define the correct scope for the work to be done ([YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)!);
    - _Produce some early flowcharts_ to make sense of how the application might be structured and iterate on this until a clear winner emerges;
    - _Produce low-fidelity wireframes_ (even for a TUI, that would be informative before committing to doing the wrong thing!) -- even if this is just quickly sketched on paper;
    - _Create high-fidely mockups_ (or at least reasonable-looking ones for a small project like this one) once things have been thought through carefully;
    - _Design a general plan of work_ before writing any code to have a better idea of how the different parts of the system should communicate together;
    - _Research existing tools to be leveraged_ so as to not re-invent the wheel all the time and see how they fit in together;
    - _Go with TDD_ and stick to it piously for anything of relative importance that should be tested;
    - _Go at it with atomic commits_ so that rewinding errors on the path will be a breeze -- at least that ought to help significantly.
- Related to the first point, issues could have been more substantial instead of having to often deal with useless refactoring due to not thinking things through fully.
- With more mental processing done upfront, it would have been clear which features should have been part of the tool earlier and which ones could have waited longer. Glancing at the Gantt chart above, one can see that many commits happened at the beginning just to get the structure right, the project was not documented until much later and basic functionality such as being able to plot results (which was really a core feature to be expected) was not integrated until past the mid-life of the project.
- On top of the above, it was clear that using YAML in the presence of the other technologies used for a backend and frontend to the CLI made things more complicated and it wasn't until one of the latest versions that JSON was used instead.
- _The user experience could have been improved drastically at the beginning by relying on well-known libraries_ such as [Rich](https://github.com/Textualize/rich) to make the UI much more appealing and even a bit more interactive.
- Some features were presented in a way that did not make much sense. For instance, the `Dockerfile` does allow one to use the tool from a Docker container, but not all functionality works out of the box that way (e.g., saving a plot to the filesystem or loading a configuration file).
- _It wasn't productive at all to start scattering the few resources put into this project_ by creating a sister repository [uol-grades-calculator-server](https://github.com/sglavoie/uol-grades-calculator-server). The CLI should have been more feature-rich before considering such an endeavor and it should have been made in a way that's easier for a backend to consume.

<figure>
    <a href="{static}/images/posts/0030_a_retrospective_on_creating_an_impractical_little_tool_just_for_fun/plot_output.png"><img src="{static}/images/posts/0030_a_retrospective_on_creating_an_impractical_little_tool_just_for_fun/plot_output.png" alt="plot_output" class="max-size-img-post"></a>
    <figcaption>Showing the image generated by running the <code>plot modules</code> (sub-)command.</figcaption>
</figure>

---

# Key lessons learnt and where to take it from here

- _Studying better the available libraries_ would have avoided some headaches. For instance, the display of what should have been tabular data started out as plain JSON (printing a `dict` object), then `beautifultable` was used to create some colored output, then `pandas` replaced the previous library because some limitations were found with it -- reverting to a plain table output in the process -- and finally `rich` was used to create a more decent-looking output.
- Likewise, _spending more time in the planning department_ before getting started would probably have resulted in a tool that's more straightforward to use, focused on the most needed features and possessing a broader feature set by not having invested extra resources on building a backend and a frontend separately. It should have been either a more powerful TUI limited to be used within a terminal or a web application, but not both in the way it was designed.
- _Work on small, isolated parts of the system_. Some issues were split into large chunks of work ([this one for instance](https://github.com/sglavoie/uol-grades-calculator/issues/29), implementing at once the `plot` command and its sub-commands). This wasn't a problem per se given that I worked alone, but it would be harder for someone else to follow and to create a reasonably-sized pull request from such an issue. This feature could have been broken down into different sets of related flags.

<figure>
    <a href="{static}/images/posts/0030_a_retrospective_on_creating_an_impractical_little_tool_just_for_fun/ugc-server.png"><img src="{static}/images/posts/0030_a_retrospective_on_creating_an_impractical_little_tool_just_for_fun/ugc-server.png" alt="ugc-server" class="max-size-img-post"></a>
    <figcaption>A simple component diagram demonstrating how the CLI was to be used in a greater context.</figcaption>
</figure>

---

# Conclusion

> "Regardless of what we discover, we understand and truly believe that everyone did the best job they could, given what they knew at the time, their skills and abilities, the resources available, and the situation at hand."
<div class="quote-author"><a href="https://retrospectivewiki.org/index.php?title=The_Prime_Directive">--Norm Kerth, Project Retrospectives: A Handbook for Team Review</a></div>

All in all, this has been a fun experiment to bring to fruition. It would have been much quicker to use a spreadsheet given what the final result ended up being, but the experience obtained was worth every drop of developer sweat! Using Python felt appropriate as iterations of the tool could be produced fast and the CLI was responsive enough to be useful and pleasant to interact with thanks to its intuitive commands. In the near future, using a library like [Textual](https://github.com/Textualize/textual) could be more rewarding as one could expect a much nicer visual experience in the terminal at a fraction of the current implementation efforts.

## Resources and references

- [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/)
- [How to run a great retrospective - LeadDev](https://leaddev.com/communication-relationships/how-run-great-retrospective)
- [John Carmack - Twitter](https://twitter.com/ID_AA_Carmack)
- [John Carmack: Doom, Quake, VR, AGI, Programming, Video Games, and Rockets | Lex Fridman Podcast - YouTube](https://www.youtube.com/watch?v=I845O57ZSy4)
- [Mermaid - Markdownish syntax for generating flowcharts, sequence diagrams, class diagrams, gantt charts and git graphs](https://mermaid-js.github.io/)
- [PyPI - The Python Package Index](https://pypi.org/)
- [Read The Docs - Create, host, and browse documentation](https://readthedocs.org/)
- [Retrospective - Atlassian](https://www.atlassian.com/team-playbook/plays/retrospective)
- [Retrospective Plans - Agile Retrospective Resource Wiki](https://retrospectivewiki.org/index.php?title=Retrospective_Plans)
- [Reverse order of lines - Vim Tips Wiki](https://vim.fandom.com/wiki/Reverse_order_of_lines)
- [Sphinx - Python Documentation Generator](https://www.sphinx-doc.org/)
- [Test-driven development - Wikipedia](https://en.wikipedia.org/wiki/Test-driven_development)
- [Textual - GitHub](https://github.com/Textualize/textual)
- [The Prime Directive - Agile Retrospective Resource Wiki](https://retrospectivewiki.org/index.php?title=The_Prime_Directive)
- [The Primeagen - Twitter](https://twitter.com/ThePrimeagen)
- [The Primeagen - YouTube](https://www.youtube.com/c/ThePrimeagen)
- [You aren't gonna need it - Wikipedia](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)
