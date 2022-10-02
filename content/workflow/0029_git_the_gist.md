Title: Git the gist of it: common commands for a working workflow
Date: 2022-04-03 11:21
Modified: 2022-10-02 18:37
Tags: git, productivity, terminal
Slug: git-the-gist-of-it-common-commands-for-a-working-workflow
Authors: Sébastien Lavoie
Summary: [Git](https://git-scm.com/) is such a fascinating piece of software. It is not the only [distributed version control](https://en.wikipedia.org/wiki/Distributed_version_control) system out there, but it is certainly ubiquitous in that category and has become a tool that must be mastered by any software developer in the modern era.
Description: Git is such a fascinating piece of software. It is not the only distributed version control system out there, but it is certainly ubiquitous in that category and has become a tool that must be mastered by any software developer in the modern era.

[TOC]

---

# Introduction

Git, the friend you wish you had met earlier, when organizing files like `report 1.pdf`, `report 2.pdf` and `report final 1.pdf` still made sense somehow. It's undoubtedly complicated to wrap one's head around it at first, although there exist some GUIs to make the journey smoother – the best examples that come to mind would include [GitKraken](https://www.gitkraken.com/) and [Tower](https://www.git-tower.com/) at the top of the list. I have been advised to learn to use Git from the terminal and I would, without flinching, recommend anyone to do the same to really grok this tool and get an intuitive feel for what it does.

Beyond the extraordinary technical prowess that it is, Git can be useful to a broad audience. It's not good at dealing with large binary files (and [Git LFS](https://git-lfs.github.com/) is not exactly easy to use just yet to cover that case), but for anything involving text that a human can read, it shines – may it be a programming language, some reports written with [LaTeX](https://www.latex-project.org/), some diagrams produced with [Mermaid](http://mermaid-js.github.io/mermaid/#/) or [PlantUML](https://plantuml.com/), personal notes taken in plain text or in Markdown or the fact that synchronizing changes made to a project is a breeze and allows ones to work from multiple locations and machines.

With platforms like [GitHub](https://github.com/) and [GitLab](https://about.gitlab.com/), it is easy to keep a "backup" of projects, which can be either public or private. And despite Git not being awesome with very large files, any smaller binary files like images and PDF files can easily be added to a Git repository, allowing users to keep different versions of these files very easily without using a cloud service such as Dropbox or Google Drive. So even if the original input is not written in a text-friendly manner, the output can still be saved under multiple versions with great details, backed up to different websites and fetched just as conveniently from anywhere else (assuming access has been set up to continue working on a project, or at least one can log in to the website and download files without issue).

Sure, it is not for everyone, but the use cases just described can go a long way. I have used it to practice solving programming challenges, to document all my project at the university, to keep track of preferences and configuration files for my different systems (Linux and macOS) which I've described in [Managing dotfiles with a Git bare repository]({filename}/workflow/0024_managing_dotfiles_with_git_bare_repo.md), to work on pet programming projects and coding experiments that I keep private, to store code snippets into a growing library for reference purposes, to take notes in the form of "tutorials" or "wiki" (platforms like GitHub and GitLab have a nice wiki feature that renders prose nicely!) for different tasks I need to do infrequently and of course to build this very website in the open (the source code is [available on GitHub](https://github.com/sglavoie/sglavoie.github.io-source))! And that is just describing some of my personal use cases without touching on the fact that collaboration within a team is a huge reason to use it!

So with that said, let's explore some of its functionality, starting with a few tips and tricks, then delving deeper into a real-world workflow and topping it off with more useful commands and configuration settings.

---

# Global and local `.gitignore`

There are files we never care about adding to Git repositories, such as a thumbnail cache file `Thumbs.db` on Windows or a `.DS_Store` file storing custom attributes for folders on macOS. Instead of ignoring these kinds of entries in a per-repository `.gitignore` file which might not contain everything we would like to exclude, it can be simpler and more efficient to use a global `.gitignore`, which serves the same purpose but for _any_ Git repository regardless of the presence of a `.gitignore` in that specific repository! In other words, this serves as a permanent list of things to ignore so that there is no need to remember about them later.

The setup is straightforward: create a file `~/.gitignore`, fill it as usual with patterns you are sure to want to exclude globally and set a configuration option to use that file – for instance by adding the following to `.gitconfig`:

```{.git}
[core]
    excludesfile = ~/.gitignore
```

Toptal provides [a nice tool on the command-line](https://docs.gitignore.io/install/command-line) that can be used to easily exclude patterns. With it, typing `gi python >> .gitignore` would append a bunch of common patterns to a `.gitignore` file – in this case, for Python.

---

# Meaningful commit messages with `.gitmessage`

Besides using the excellent [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification to write messages in a format that makes sense to other fellow human beings, using a template for Git commits can help with remembering _why_ commits are made and how they should be structured. There is a configuration setting, `commit.template`, that can be used to set the default text being displayed when a text editor opens after typing `git commit`.

The following is the current template I use, which can be saved in a file like `~/.gitmessage`:

```{.text}
# [Add/Fix/Remove/Update/Refactor/Document] [summary]


# Why is it necessary? (Bug fix, feature, improvements?)
#-
# How does the change address the issue?
#-
# What side effects does this change have?
#-
# Include a link to the ticket, if any.
```

Then, this can be added to the config file under the `[commit]` section like so:

```{.git}
[commit]
    template = ~/.gitmessage
```

All lines starting with a hash symbol (`#`) will be ignored, so there is no need to manually delete all of this verbose content when saving the commit message. Sweet!

---

# My usual Git workflow

This section depends very much on team standards, if applicable. But in general terms and considering mostly a solo interaction with Git, I like to adhere to the following processes, without taking into account how one would plan, produce diagrams, brainstorm, etc. That shall be the topic of an upcoming post!

## Starting a new project

There are different ways to proceed, although I like the simplicity of just creating a new empty repository on GitHub and cloning it on my machine using the SSH protocol, e.g. `git clone git@github.com:some/project.git`. This has the benefit of automatically setting the `main` branch and the remote URL, using `origin` as the default remote. Cloning an empty repository has the same effect as starting with `git init`, so this also becomes unnecessary.

If I have been experimenting locally first, I would do a `git init`, commit any changes and then push the new repository on GitHub, either using the great Git integration provided by VS Code or again creating a new repository on GitHub to set the remote URL in order to be able to push local changes, i.e. by doing `git remote add origin git@github.com:some/project.git` and then pushing to that new URL. To make sure that my default branch is always `main` (to match the new default on GitHub) and not something like `dev` or `master`, I have a Git template lying around that ensures that the first branch created when doing `git init` will be `main`. It is as simple as creating the file `~/.git-templates/HEAD` with this content:

```{.text}
ref: refs/heads/main
```

Then, in `~/.gitconfig`, the following section is used to read the templates:

```{.git}
[init]
    defaultBranch = main
    templateDir = ~/.git-templates
```

I have this template since before `init.defaultBranch` was introduced in Git 2.28.0 back in July 2020: now just having the option `defaultBranch` will do the trick. Still, it's good to have a `templateDir` configured for other purposes! Although admittedly, I don't use them at all and would rather create a custom command to more easily script what I need for each repository: more on this in the section [Custom Git sub-commands](#custom-git-sub-commands).

## Committing to an existing project

Now that there is some folder set up for Git to track files, it's time to make changes! I'm a big fan of committing "small and often" because Git is super flexible and updating the history is usually a simple process – unless you have pushed to a remote repository used by other people, in which case being a "force push" type of person won't make you many friends. May the `--force` be with you when you push to a private repository where you're the only contributor, otherwise, it's good practice to think twice before sending your final changes away as you should not mess up with public history (and depending on how your access is set up within a team, you might not even be able to use the `--force` flag when pushing on certain branches!).

So what's the alternative to constantly rewriting history in a harmful way? Well, assuming you have a choice when working alone for instance, there are two main contenders: _merge_ vs _rebase_. I think neither option is better than the other when used right, but it's good to know that _rebase_ might create possible headaches because it modifies the Git history while _merge_ might create undesirable noise when used profusely by adding "merge commits". I use both techniques, but for different purposes.

### Being committed

The basic workflow might look like this, with a couple of different options thrown in to cover more scenarios:

```{.bash}
# Check the current state of the repo
git status

# Inspect the changes to commit (before staging)
git diff

# Stage a file to be committed
git add SOME_FILE

# Stage all new/modified files, (i.e., --all)
git add -A

# Stage all modified files (not any new ones, i.e., --update)
git add -u

# Get fancy with adding patches only (part of files)
git add -p

# Undo changes done to a tracked file
git restore -- FILE_NAME

# Inspect staged changes to commit
git diff --staged

# Unstage files
git reset HEAD --

# or just 'git commit' to open a text editor
git commit -m "SOME_MESSAGE"

# See the changes done in the latest commit
git show

# or a specific commit hash from earlier
git show COMMIT_HASH  # or ref like HEAD^

# Forgot to add something?
git add SOME_OTHER_FILE
git commit --amend --no-edit

# Want to rephrase the last commit?
git commit --amend

# Tag the latest commit
git tag TAG_NAME

# Tag earlier commit with annotation
git tag -a TAG_NAME COMMIT_HASH -m "MESSAGE"

# Undo a commit, keeping changes in the work tree
git reset HEAD^

# Undo a commit and DO NOT keep changes
git reset --hard HEAD^

# Oops, get back a commit that was "lost"
git reflog  # find the relevant commit hash
git cherry-pick COMMIT_HASH  # or git checkout COMMIT_HASH

# Explore the repo at an earlier commit
git checkout COMMIT_HASH

# Committed some changes while checking out an old commit?
# Save the changes to a new branch, then potentially merge them back
git switch -c NEW_BRANCH_NAME
git switch OTHER_BRANCH
git merge NEW_BRANCH_NAME

# Undo a merge
git reflog  # find the commit hash before the merge
git reset --hard COMMIT_HASH

# Or undo to a known point from a remote branch
git reset --hard origin/main

# Stop tracking a file/directory (remove) but keep it on disk
git rm --cached FILE_OR_DIRECTORY

# Remove stuff that hasn't been committed yet (interactive mode is nice)
# Don't forget about -n for a dry run first!
git clean -i

# Want to undo a change that's already pushed?
# Add a new commit without rewriting history
git revert COMMIT_HASH

# See who did what to which file and when
git blame FILE_NAME
```

Arguably, basic editing doesn't require stashing, but that can be helpful for a quick modification, like temporarily saving changes to quickly switch to another branch or pull some remote changes without having to commit first.

```{.bash}
# git stash --help - "Stash the changes in a dirty working directory away"

# Maybe you want to keep changes around without committing
# --include-untracked and --keep-index might be needed!
git stash

# Stash changes with a clearer name/purpose
git stash save "SOME MESSAGE"

# Selectively stash changes (keep specific lines)
git stash save -p

# List existing stashes
git stash list

# See the summary of a stash
git stash show

# See all changes made in a stash (patch)
git stash show -p

# Apply changes from a stash (TAB completion after `apply` is useful)
git stash apply stash@\{SOME_ID\}

# Apply and remove the last stash at the same time
git stash pop

# Remove a single stash
git stash drop stash@\{SOME_ID\}

# Remove all stashes
git stash clear
```

### `rebase`

When working locally with changes that are not yet part of the "permanent" Git history, I like to `git rebase` very much to clean things up before making a `git push`, which I like to view as an irrevocable decision. Because I _commit small and often_, it's often the case that I end up with a couple of very simple commits which really belong together and should form a bigger commit. While committing a big chunk of code at once avoids having to do any `rebase` in the first place, it's also inconvenient to undo a substantial amount of work when you're experimenting and/or working on an unfamiliar codebase. So in the end, my preference goes towards smaller commits because rebasing is actually fun to do and lets you believe that you came up with brilliant solutions on your first attempt :). That makes for a cleaner Git history for sure, although you will lose some context if you never `merge`. Meaning, rebasing creates a "linear" history while merging from different branches shows a more complete picture of how a repository really took shape over time. My simple rule of thumb on the matter is this: use `rebase` to consistently ship meaningful commits (good descriptions, fewer typos, changes chunked logically and precisely, etc.) and use `merge` to incorporate somewhat larger pieces of history, like a new feature coming from a "feature branch".

Some common commands I use:

```{.bash}
# git rebase --help - "Reapply commits on top of another base tip"

# Include all commits up to COMMIT_HASH, included
git rebase -i COMMIT_HASH^

# Include most recent commit only
git rebase -i HEAD^

# Include 2 most recent commits
git rebase -i HEAD^^

# Include 3 most recent commits
git rebase -i HEAD~3

# make BRANCH have the history up to COMMIT_OR_BRANCH, included
git rebase COMMIT_OR_BRANCH BRANCH

# Used after resolving a conflict
git rebase --continue

# Reset to where you were before rebasing (move HEAD)
git rebase --abort

# To update the next actions to be taken on the remaining commits
git rebase --edit-todo
```

There are a bunch of obscure options just like almost any other Git command in existence, but for that there is help available for each command (such as `git rebase --help`) from the terminal and the trusty Stack Overflow ;).

#### Sample workflow

In the case of `rebase`, I enjoy working in this way:

1. Make small commits, maybe 5 to 10 depending on the complexity of the project – usually as long as a series of commits relates to a single topic whenever possible.
2. Have a peak at the recent history with `git log` to have a good idea of what just happened.
3. Realize that the history can be improved. Find the oldest commit hash (not pushed yet!), take note of it and run `git rebase -i COMMIT_HASH^` (with the "hat" `^` at the end to reference the parent of that commit).
4. This opens up a text editor with some explanations on how to proceed (for more on this, have a look at this great article on [Rewriting history](https://www.atlassian.com/git/tutorials/rewriting-history)). From there, I usually use `r` to reword, `s` to squash, `e` to edit and sometimes `f` to fixup, besides also re-ordering commits and from time to time deleting one by removing the line entirely.
     - `r` is pretty harmless as it will just show up a new window where the commit message and description can be modified.
     - `s` is more destructive because commits will be "merged" together! No actual change is lost, but if you squash a ton of commits by accident, it will create huge commits and you might want to undo that with `reflog` before it's too late (Atlassian has more to say about this in [git reflog](https://www.atlassian.com/git/tutorials/rewriting-history/git-reflog)). The `s` option is also nice because it keeps all commit messages, so you can edit the final log message as needed without discarding messages.
     - `e` is used to modify the actual source code being committed, maybe to fix a typo or a minor bug after realizing that the test suite no longer passes (assuming you are not programming blindly without tests :)). This can cause some "conflicts" if you change some lines which are also part of other commits in the selection you made originally, so one has to be careful with that. This can also be used in conjunction with `git reset HEAD^` to "cancel" the current commit when doing the rebase in order to split it into multiple smaller commits, which can then be "`git add`ed" back, followed by a `git rebase --continue` to keep going.
     - `f` is a quick way of squashing commits together while discarding messages you don't need. So maybe the last commit has a proper description ("Implemented something...") and a few commits before that one were just temporary "savepoints" with non-sensical commit messages (things like "testing..." or "new commit") that were done until you reached a final solution that's worth committing. So of course in that case the history would be pretty ugly and hard to understand if all commits were kept intact, so these can be added to the latest change which encompasses a working solution as a whole. Just as well, maybe that last commit didn't have a complete message just yet, so it could also be rewritten with the `r` prefix.
5. When individual commits make the `rebase` stop temporarily (such as when a commit is to be edited with `e` and waits for changes to be made), then it's time to do `git rebase --continue` once the necessary changes are made.
6. If something goes wrong along the way, there's always a way back to the place you were right before rebasing with `git rebase --abort`. It's worth noting that Git itself will output some useful messages all along so it's not necessary to remember all of this: it quickly becomes intuitive.

Now, `rebase` covers the cases where local changes are done in isolation, but for something more imposing or simply to keep track of what happened in which branch, `merge` remains a powerful ally.

### `merge`

So I don't use `merge` as much, especially when working solo, but it is undeniably useful and could replace the `rebase` workflow completely (it might also be demanded by your colleagues anyways!). There's nothing like a good `rebase` session to keep things tidy, but a flat history line won't look attractive on a huge project with many contributors, so `merge` is there to deal with cleanly integrating changes from different places into some `main` branch (it could be named differently based on the team workflow of course and there might be more than one "main" branch too). What makes `merge` incredibly cool is the fact that branches in Git are "cheap", meaning they can be created very quickly and efficiently, they don't take space at all, you could have dozens of branches or more and you can incorporate changes from one branch to another with a simple `git merge`, which is nicer than using `git cherry-pick` to get multiple commits from one branch into another (for one or two commits though, `cherry-pick` is handy).

I see `rebase` more like a cleaning step while `merge` really shines when dealing with multiple commits between different branches. Even on a simple project when working alone, it has its uses! For example, let's say we have a repository full of small programming challenges (maybe from [HackerRank](https://www.hackerrank.com/) or [LeetCode](https://leetcode.com/)). We might get stuck on a tricky problem and wouldn't want to commit an unfinished solution. Also, maybe we would get fed up eventually working on a given challenge and would rather try our luck with a different one. Well, we can always leave changes uncommitted (not very safe as these might be lost!), but that can cause confusion and you might inadvertently end up committing files that have nothing to do with the latest challenge – effectively committing at the same time your unfinished challenge with the one you just completed. There's always the possibility to `git stash` individual files to keep them somewhere, but I find working with stashes to be a bit more cumbersome than branches and you might literally forget that you have changes stashed. If you do that a few times, you might not even know which stash is what if you didn't give them a good name...

Some common commands I use:

```{.bash}
# git merge --help - "Join two or more development histories together"

# Get commits from BRANCH_NAME into the currently checked one
git merge BRANCH_NAME

# Merge one branch into another
git merge SOURCE_BRANCH_NAME DESTINATION_BRANCH_NAME

# Get out of conflicts...
git merge --abort

# Continue after resolving conflicts
git merge --continue

# Keep the "merge commit" in the history
git merge --no-ff BRANCH_NAME

# Set a custom commit message for a "merge commit"
git merge -m "MESSAGE" BRANCH
```

<sub>Tip: The command `git merge --help` describes some nice examples about the whole process of conflict resolution.</sub>

#### Sample workflow (kinda)

So, instead of risking losing changes like this, creating a new branch with `git switch -c BRANCH_NAME` and working from there is much easier to confine changes to a specific matter, which we can see like a "feature" that can later be added to the main "trunk". We can commit unfinished business, switch to a different branch, come back to it later, `git reset` any old commit to "revert" the history and keep working from a clean state. In any case, there's always `rebase` to avoid committing useless stuff, so there's really no reason to avoid branches.

The `merge` command will be involved when changes from a "feature branch" (or whatever other purpose you give a branch) are merged into the main branch with `git merge BRANCH_NAME`. When there are no "merge conflicts" (such as when you work on a totally new file that won't clash with prior work), this is a seamless workflow where you can just `merge` as if changes were made in the branch you are on in the first place. There are other instances where bigger changes can be merged successfully in the same way, but it's interesting to keep track of how you worked on a project, so in this scenario you can always use `git merge --no-ff BRANCH_NAME` (`--no-ff` meaning "_no fast-forward_") to keep a "_merge commit_", which is strictly speaking not needed (because there's no conflict resolution in the case of a "successful" merge) but can be a helpful reference point when you look back at your Git history two years from now to understand how you worked on something, piecing things together bit by bit.

There's also an indisputable advantage conferred by the use of branches, which is: _you can have plenty of them_! So while `rebase` is nice to use on a given branch, in no way can working on multiple things at once in a single branch and then rebasing all that effort be as straightforward as creating new branches for every new topic that's being started and then merging it back into a single place of truth. Juggling different concerns in a single branch where you have a few things going on (maybe 2-3 partially implemented features) is far from being a cozy environment and rebasing that kind of work where commits are not even related to each other can become a nightmare in a short amount of time.

## Managing branches

So with all that was written earlier, I believe a point was made in favour of using branches. Because branches are such a wonderful feature of Git, here are some more commands I rely on (surprisingly, there aren't that many for `git branch`!):

```{.bash}
# git branch --help - "List, create, or delete branches"

# List local branches
git branch

# List only remote branches
git branch -r

# List all branches
git branch -a

# Delete a branch
git branch -d BRANCH_NAME

# Delete a branch forcefully
git branch -D BRANCH_NAME

# Delete a remote branch (doesn't matter if the local branch was deleted)
git push origin --delete REMOTE_NAME/BRANCH_NAME

# Rename a branch
git branch -m BRANCH_NAME NEW_BRANCH_NAME

# Track a specific remote branch
git branch BRANCH_NAME -u UPSTREAM_NAME

# See which branches have been merged or not
git branch --merged
git branch --no-merged

# Switch to the branch last checked out
git checkout -

# Compare changes between branches
git diff BRANCH_ONE..BRANCH_TWO

# Compare a file across branches
git diff BRANCH_ONE:FILE_NAME BRANCH_TWO:FILE_NAME

# See a file from another branch
git show BRANCH_NAME:FILE_NAME

# Get a file from a different branch
git restore --source OTHER_BRANCH_NAME path/to/file.txt
```

---

# Aliases

While I believe it's good practice to type complete commands to remember them better, I also tend to use Git aliases for two reasons: because some deeply ingrained concepts don't need as much reinforcement and because some obscure operations can be made so much more accessible with a pertinent mnemonic device.

Some commands like `add` just become unforgettable over time, while others – e.g., `unstage` – just don't exist yet. Without further ado, here is a list of the aliases I currently rely on when using Git, which comes straight from `~/.gitconfig`.

For instance, instead of typing `git add`, by setting the alias `a = add` (see below), it is now possible to type `git a` to get the same result.

```{.git}
[alias]
    a = add
    br = branch
    c = commit
    ca = commit --amend
    can = commit --amend --no-edit
    ch = checkout
    d = diff
    ds = diff --staged
    po = push origin
    pos = push --set-upstream origin main
    rc = rebase --continue
    ri = rebase -i
    rl = reflog
    sh = show
    s = status --short
    st = status
    sw = switch
    t = tag
    unstage = reset HEAD --

    ; show changes since last commit
    difflast = diff --cached HEAD^

    ; show last commit
    last = l -1 HEAD

    ; undo last commit
    undo = "!f() { git reset --hard $(git rev-parse \
--abbrev-ref HEAD)@{${1-1}}; }; f"

    l = log

    ; short log
    sl = shortlog

    ; log graph
    lg = l --color --graph --pretty=format:'%Cred%h%Creset \
-%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

    ; log name
    ln = l --name-only

    ; log decorate all
    logda = l --oneline --decorate --graph --all

    ; log stat
    ls = l --stat

    ; log pretty
    lp = log --pretty='%C(yellow)%h %C(cyan)%ad %Cblue%aN%C(auto)%d \
%Creset%s' --date=relative --date-order --graph
```

At some point, using Git aliases will become second nature, but until then, it can be useful to have a separate terminal alias to list them all (or maybe you forgot the command an alias is using under the hood!). For this, you can set the following alias in a file like `~/.bash_aliases`:

```{.bash}
alias gitaliases='git config -l | grep alias | sed "s/^alias\.//g"'

# For a fancier version displaying aliases in two columns neatly aligned:
alias gitaliases='git config -l | grep alias | sed "s/^alias\.//g" \
  | sed "s/=/Ω/" | column -t -s "Ω"'
```

That command will look in the Git configuration, extract all the lines containing "alias" and remove the "`alias.`" prefix so that you can see all aliases in the form `a=add` in the case of `git add` being aliased to `git a`. If you have a ton of aliases (which is probably a red flag...), finding a specific one is just a matter of doing `gitaliases | grep keyword`, of course replacing `keyword` with something else ;).

<sub>Tip: One can go further to shorten Git commands by shortening `git` itself! You can put a line such as `alias g='git'` in `~/.bash_aliases` for instance. Now, `git add` can become `g a`. Pretty efficient! For more on Bash aliases, you might like to read [Aliases: Also Known as Terminal User’s Best Friends]({filename}/tips-and-tricks/0003_aliases_also_known_as.md).</sub>

This section is really just meant to give a taste of the possibilities that aliases offer. To learn about actual commands and their usage, there is nothing like the [official Git docs](https://git-scm.com/docs) (there is a [short section on Git aliases](https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases) too).

---

# Custom Git sub-commands

There might be less of a need for custom-made commands to be created when so much can be done with Git alone, but there are cases where these custom additions can shine! As a concrete example, I have been updating this website with what I call my "[learning progress]({filename}/learnings/0031_what_it_took_to_propel_a_career_in_tech_in_five_years.md)" but committing always the same kind of stuff gets boring, so I have created a simple Bash script to automate the process of publishing and committing (the content of the script is of no importance, it is only there to demonstrate that commands other than Git can be called too):

```{.bash}
#!/bin/bash
# Act as custom command `git addlearning` and perform all that follows
# Assumes that `pelican` command is available
cd ~/dev/sglavoie/sglavoie.github.io-source
git add .
git commit -m "Add learning progress"
git push origin main
pelican

cp -r \
    ~/dev/sglavoie/sglavoie.github.io-source/output/* \
    ~/dev/sglavoie/sglavoie.github.io/ && \
    cd ~/dev/sglavoie/sglavoie.github.io && git add .
git commit -m "Add learning progress"
git push origin main
cd ~/dev/sglavoie/sglavoie.github.io-source
```

It is noteworthy to know that any kind of executable programs can be used, such as Ruby, Python and so on, as long as they are made available in the `$PATH`. This will be somewhat similar on most UNIX-based system where the `PATH` variable needs to be exported (usually in a file like `.bashrc` or `.zshrc`), for instance:

```{.bash}
# $HOME refers to a place like /home/user on Linux or /Users/user on macOS
export PATH="$HOME/dev/git-scripts:$PATH"
```

On Windows, there are [separate instructions to be followed](https://superuser.com/a/143121/1032549). With that done, there's also a need to make sure the file is executable, which can be done on the command-line with `chmod +x FILENAME_HERE`.

---

# Some lesser-known yet incredibly useful commands

## `git bisect`

I try to commit working code as often as possible, but sometimes there are just bugs that have flown by and took residence in the codebase a long time ago. In this scenario, there is one tool in the Git tool belt for that very specific use case: `git bisect`. Working with the [binary search algorithm](https://en.wikipedia.org/wiki/Binary_search_algorithm), `git bisect` searches in a range of commits and by identifying "good" and "bad" commits, will pinpoint exactly where the issue came from in the minimum number of iterations possible. You'll need sub-commands like `start`, `bad`, `good` and `reset` at the very least and for more advanced use cases where automatically running a script for each commit is needed, `run` will do the job. See [the docs on `git bisect`](https://git-scm.com/docs/git-bisect) for more.

## `git rerere`

I almost never use this in practice, but it _can_ be very useful when working in a large project where similar merge conflicts are likely to occur over time. Git can be "taught" to automatically solve merge conflicts! There are some [official docs on this](https://git-scm.com/docs/git-rerere), but I've found this [Stack Overflow answer](https://stackoverflow.com/a/49501436/8787680) to be a more approachable read.

---

# A word on the configuration file

At the very minimum, setting a name and email will be necessary to use Git:

```{.bash}
git config --global user.name "Your Name"
git config --global user.email "email@example.com"
```

Seeing the current configuration can come in handy, too:

```{.bash}
git config --global --list
```

And in the case of this particular command, `git config`, it can't be emphasized enough how useful searching through the help page in the terminal will be: `git config --help`.

I'd be remiss if I didn't include an example of my own configuration at this point, so here it goes! To make it so that it is convenient to commit this configuration file publicly, some private settings can be "included" from other paths inside the `[include]` block. For clarity, I'll show what that file looks like below the main configuration file.

```{.bash}
# This is the content of ~/.gitconfig

[include]
    ; This file can add more information to extend the main configuration.
    ; For example, when inside a directory that match a certain pattern,
    ; we can tell Git to change our name or email (e.g., when committing
    ; with different credentials from a work email)
    path = ~/Dropbox/.custom/.gitconfig
[color]
    branch = auto
    diff = auto
    grep = auto
    interactive = auto
    status = auto
    ui = true
[alias]
    # cut out for brevity, see the section on Aliases
[core]
    editor = nvim
    excludesfile = ~/.gitignore
    pager = diff-so-fancy | less --tabs=4 -RFX
[commit]
    gpgsign = true
    template = ~/.gitmessage
[mergetool "nvim"]
    cmd = nvim $MERGED
[difftool "vscode"]
    cmd = code --wait --diff $LOCAL $REMOTE
[mergetool]
  prompt = false
[color "diff-highlight"]
    oldNormal = red bold
    oldHighlight = red bold 52
    newNormal = green bold
    newHighlight = green bold 22
[color "diff"]
    commit = yellow bold
    frag = magenta bold
    meta = 11
    new = green bold
    old = red bold
    whitespace = red reverse
[push]
    recurseSubmodules = on-demand
[gpg]
    program = gpg2
[filter "lfs"]
    clean = git-lfs clean -- %f
    smudge = git-lfs smudge --skip -- %f
    process = git-lfs filter-process --skip
    required = true
[pull]
    rebase = false
[credential]
    helper = store
[init]
    defaultBranch = main
    templateDir = ~/.git-templates
[diff]
    tool = vscode
```

The file being referenced/included here, `~/Dropbox/.custom/.gitconfig`, looks like this:

```{.bash}
[user]
  email = email@example.com
  name = Your Name
  signingkey = 798034F11B2ADED2
[commit]
  gpgsign = true

# The following block could be used to update credentials when committing
# depending on what directory is opened. So, if you work for COMPANY_NAME
# and the pattern 'COMPANY_NAME' appears in the current working directory,
# then Git can be smart and update your configuration by including
# something like the previous block so that the original email, name,
# signingkey and possibly other config options are overwritten.

; when working at COMPANY_NAME
[includeIf "gitdir:**/COMPANY_NAME/**/.git"]
  path = ~/Dropbox/.custom/.gitconfig-COMPANY_NAME
```

So this section briefly points out how custom tools like `diff-so-fancy` can be used, how diff output colors can be customized, how specific code editors like Neovim and VS Code can be opened when committing or dealing with merge conflicts and generally just how the file is meant to be structured.

A lot more on configuring Git can be found in [the official documentation on `git config`](https://git-scm.com/docs/git-config).

---

# Conclusion

Being exhaustive when it comes to using Git is definitely not something this article strived to achieve: Git is such a complex piece of software that has been evolving since 2005, when it became a necessity to deal with incoming patches sent to Linus Torvalds to make Linux the fantastic project it has become! There is much, much more to learn, but hopefully this post gives you a slightly different perspective and points the way to a well-rounded journey with the list of references below. Git good!

## More resources and references

### Websites

- [Conventional Commits](https://www.conventionalcommits.org/) - _"A specification for adding human and machine readable meaning to commit messages."_
- [Git Cheatsheet](http://ndpsoftware.com/git-cheatsheet.html) - _"Interactive Git Cheatsheet, categorizing commands based on what they affect."_
- [Git Immersion](http://gitimmersion.com) - _"A guided tour that walks through the fundamentals of Git, inspired by the premise that to know a thing is to do it."_
- [GitHowTo](https://githowto.com) - _"Git How To is a guided tour that walks through the fundamentals of Git, inspired by the premise that to know a thing is to do it."_
- [GitHub Learning Lab](https://lab.github.com/) - _"With GitHub Learning Lab, grow your skills by completing fun, realistic projects. Get advice and helpful feedback from our friendly Learning Lab bot."_
- [Learn Git Branching](https://learngitbranching.js.org) - _"An interactive Git visualization tool to educate and challenge!"_
- [Microsoft Learn GitHub modules](https://docs.microsoft.com/en-us/learn/browse/?terms=Github) - _"Learn new skills and discover the power of Microsoft products with step-by-step guidance."_
- [Pro Git Book](https://git-scm.com/book/en/v2) - _"The entire Pro Git book, written by Scott Chacon and Ben Straub and published by Apress, is available here. All content is licensed under the Creative Commons Attribution Non Commercial Share Alike 3.0 license. Print versions of the book are available on Amazon.com."_
- [Productive Git for Developers](https://egghead.io/courses/productive-git-for-developers) - _"You will walk through a series of scenarios which you’ll most commonly encounter in your daily work life as a developer."_.
- [Step-by-step guide to contributing on GitHub](https://www.dataschool.io/how-to-contribute-on-github/) - _"Have you thought about contributing to an open source project, but you're too confused (or intimidated) by the process to even try? I've been there too!"_
- [Try GitHub](http://try.github.io) - _Resources to learn Git: Handbook, cheat sheets, git commands in the browser, etc._

### YouTube

- [CS50 Beyond 2019](https://www.youtube.com/watch?v=eulnSXkhE7I) - CS50
- [Git & GitHub Crash Course For Beginners](https://www.youtube.com/watch?v=SWYqp7iY_Tc) - Traversy Media
- [Git and GitHub for Beginners - Crash Course](https://www.youtube.com/watch?v=RGOj5yH7evk) - freeCodeCamp.org
- [Git Tutorial for Beginners: Command-Line Fundamentals](https://www.youtube.com/watch?v=HVsySz-h9r4&list=PL-osiE80TeTuRUfjRe54Eea17-YfnOOAx) (playlist) - Corey Schafer
- [GitHub Basics Tutorial - How to Use GitHub](https://www.youtube.com/watch?v=x0EYpi38Yp4) - freeCodeCamp.org
- [MIT Missing semester (Version Control) - Git data model](https://missing.csail.mit.edu/2020/version-control) - MIT
- [The Ultimate Git & GitHub Crash Course - Learn to Version Control for Beginners](https://www.youtube.com/watch?v=i76ts_0UryI) - Laith Harb

### Online courses

- [Git Essential Training](https://www.linkedin.com/learning/git-essential-training) (_free with free trial_) - LinkedIn Learning. _"Using a step-by-step approach, author Kevin Skoglund presents the commands that enable efficient code management and reveals the fundamental concepts behind version control systems and the Git architecture. Discover how to track changes to files in a repository, review previous edits, and compare versions of a file; create branches to test new ideas without altering the main project; and merge those changes into the project if they work out._"
- [Git Started with GitHub](https://www.udemy.com/git-started-with-github/) - Udacity. _"This course is designed to jump right into showing how Git and GitHub work together, focusing on the Git basic workflow. Students can expect to learn the minimum needed to start using Git in about 30 minutes."_
- [How to Use Git and GitHub](https://eu.udacity.com/course/how-to-use-git-and-github--ud775) - Udacity. _"This course, built with input from GitHub, will introduce the basics of using version control by focusing on a particular version control system called Git and a collaboration platform called GitHub."_
- [Short and Sweet: Get Started with Git and GitHub Right Now](https://www.udemy.com/short-and-sweet-get-started-with-git-and-github-right-now/) - Udemy. _"In just 30 minutes, this "Short and Sweet" course covers the essential ideas you need to move forward, without a lot of filler. At the end of the course, you'll be able to set up a GitHub account, install Git, create and configure new Git and GitHub repositories, create a change history for your software projects, and publish your software projects to GitHub."_
- [The Ultimate GIT 5-day Challenge](https://www.udemy.com/the-ultimate-git-5-day-challenge/) - Udacity. _"A quick way to determine if working with GIT is something you want to learn more about. This course takes us step-by-step through some basic GIT operations. The course will not dive too deep, and takes small steps on each of five days. As we continue through the course, we learn a basic, single-person workflow that could allow anyone to store files at GitHub or BitBucket."_
- [Version Control with Git](https://www.coursera.org/learn/version-control-with-git) - Coursera. _"In this course, you will not learn everything there is to know about Git, but you will build a strong conceptual understanding of the technology, and afterward will be able to confidently dig deeper on any topic that interests you."_
- [Introduction to Git and Github](https://www.coursera.org/learn/introduction-git-github) - Coursera. Offered by Google. _"In this course, you’ll learn how to keep track of the different versions of your code and configuration files using a popular version control system (VCS) called Git. We'll also go through how to setup an account with a service called GitHub so that you can create your very own remote repositories to store your code and configuration."_

### References for this article

- [`git rerere`](https://git-scm.com/docs/git-rerere) - git-scm.
- [35+ Git Commands List Every Programmer Should Know](https://www.loginradius.com/blog/engineering/git-commands/) - loginradius.
- [Binary search algorithm](https://en.wikipedia.org/wiki/Binary_search_algorithm) - Wikipedia.
- [Gitignore](https://docs.gitignore.io/install/command-line) - Toptal.
- [HackerRank](https://www.hackerrank.com/).
- [LeetCode](https://leetcode.com/).
- [Rewriting history](https://www.atlassian.com/git/tutorials/rewriting-history) - Atlassian.
- [The new Git default branch name](https://about.gitlab.com/blog/2021/03/10/new-git-default-branch-name) - GitLab.
- [What is git-rerere and how does it work?](https://stackoverflow.com/a/49501436/8787680) - Stack Overflow.
