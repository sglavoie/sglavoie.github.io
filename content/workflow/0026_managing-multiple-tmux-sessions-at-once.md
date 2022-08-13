Title: Managing multiple tmux sessions at once
Date: 2021-09-19 18:13
Tags: bash, i3, rofi, script, tmux
Slug: managing-multiple-tmux-sessions-at-once
Authors: Sébastien Lavoie
Summary: Open and close projects with tmux sessions in a breeze via two keyboard shortcuts.
Description: Open and close projects with tmux sessions in a breeze via two keyboard shortcuts.

[TOC]

---

# Introduction

Released back in 2007, [tmux](https://github.com/tmux/tmux/wiki) keeps being amazing! Because I have never bothered automating anything to make its use simpler, it took some time for it to become a working environment I enjoy for everyday use. This is a thing of the past: thanks to Oleksandr Kocherhin from [Monsterlessons Academy](https://monsterlessons-academy.com/), who shared his tmux workflow in his YouTube video titled [Best Terminal Application for Web Development](https://www.youtube.com/watch?v=GuH7pw9LejY), I saw a few automation opportunities I thought were worth tackling.

In this post, I'm sharing a little tip about managing tmux sessions that was inspired from the mentioned video. I am using [i3wm](https://i3wm.org/) on Linux, but you can adapt this with any desktop environment as long as you can trigger the execution of programs with a keyboard shortcut in one way or another. I will be using Rofi and the `find` command, which you can find on Unix systems. If you would rather use dmenu instead of Rofi with this script, [this article can serve as a reference]({filename}/tips-and-tricks/0018_using_dmenu_to_optimize_common_tasks.md). Enough said, let's get to it.

---

# What is this all about?

The idea is simple: have a few keyboard shortcuts to manage tmux sessions. That means being able to open new sessions and being able to kill them too. I kept this setup very simple on purpose but of course some improvements could be made. For instance, it could be nice to know which projects have already been opened so that the script doesn't prompt you with a list of projects that include projects that you have already launched, but I haven't found the need so far to deal with this potential issue as I tend to only work on a couple of projects during the course of a given day.

In summary, here is what we want to achieve in this post:

- Configure projects so that when we want to open them, they will be set up in the right directory with servers running, etc.;
- Open a tmux session with a keyboard shortcut, listing all projects that were configured in the previous step;
- Kill any opened tmux session with another keyboard shortcut.

That's it!

# 1. Configuring projects to launch tmux sessions

Firstly, we need to create new files to open our projects in the way we want. Basically, we need to create a file, let's call it `.tmux`, and put it at the root of the project we're interested in working with tmux. Then, we need to put some instructions that will be run with the shell (e.g. Bash or Zsh) so that tmux commands will be run automatically for us and let us "attach" to the session once all the necessary actions are performed. That means we need to make that file executable. In the terminal, this would be done as follows, assuming the project's folder is the current working directory:

```{.bash}
chmod +x .tmux
```

At last, we want to give some orders to tmux so that when we execute that file, it will open our project in a pre-configured state so we're ready to go. This will need to be customized depending on your needs, but here is a simple example to illustrate what could happen. So, we could put the following inside the `.tmux` file:

```{.bash}
#!/bin/sh

set -e

if tmux has-session -t=my-project 2> /dev/null; then
    tmux attach -t my-project
    exit
fi

tmux new-session -d -s my-project -n nvim -x $(tput cols) -y $(tput lines)

# Neovim
tmux send-keys -t my-project:nvim "n" Enter

# Servers
tmux new-window -t my-project -n servers
tmux send-keys -t my-project:servers "cd frontend && yarn start" Enter

tmux split-window -t 2 -v -p 50 # split it into two halves
tmux send-keys -t my-project:servers "cd backend && ap && uvicorn main:app --reload" Enter

tmux attach -t my-project:nvim
```

Here is what is happening:

- If our project, named `my-project`, has a tmux session already running, then we "attach" to it and nothing more is done.
- Otherwise, the session is created in "detached" mode so we can run a few commands smoothly and later attach to the created session.
- With the `-n` flag, we name the window to be created (here, the first window is `nvim`).
- Then, we "send" keys to the session, to that newly created `nvim` window. In this case, we send a single keystroke `n`, which is just an alias for executing Neovim.
- In a new window named `servers`, we send keys to execute the frontend server.
- Then, we split the second window we just created vertically and we run the commands needed to launch the backend server, again making use of Bash aliases for convenience.
- Finally, we attach to the session and we open the first window `nvim`, ready to work.

And just like this, what takes quite a few steps to do manually can be automated in one go when setting up the environment at the beginning of a working bout. Now, it could be convenient to create a generic template for the above script to use when creating new projects, especially if those tend to be short-lived and share some properties (e.g. maybe they all need to launch some kind of server in the background).

# 2. Script to open projects

Firstly, we need a way to list and open all "known" projects. This is achieved in this example very simply with the `find` command as well as with the help of `rofi`. The script in question is as follows:

```{.bash}
#!/bin/bash

# Get the path to the `.tmux` file to execute using `find` and `rofi`
PROJECT=`find $HOME/dev -type d \( -name node_modules -o -name .venv \
    -o -path name \) -prune -false -o -name '.tmux' \
    | rofi -i -dmenu -theme purple -font 'JetBrainsMono 14' \
    -width 90 -show window`

# Get the full directory path to the `.tmux` file, excluding the filename
PROJECT_DIR=`echo $PROJECT | xargs -I {} dirname "{}"`

# If $PROJECT is empty (e.g. pressing Esc at the prompt), don't do anything
if [ ! -z "$PROJECT" ]; then
    kitty --directory "$PROJECT_DIR" -e "$PROJECT"
fi
```

So, what this does is this:

- It finds all the directories where a `.tmux` file exists, excluding non-useful folders like `node_modules`. The `-prune` flag is passed to avoid recursion further inside a directory once a `.tmux` file is found. The results of `find` are "piped" into `rofi`, which displays the results. User selection is then stored in the `PROJECT` variable.
- Once a file is selected, the full path without the filename is extracted and stored in the `PROJECT_DIR` variable.
- Finally, all that is left to do is check if the user selected a project and if so, run it with the desired terminal from the correct directory. This will be different for most terminal emulators: here, an example is shown with the [kitty terminal](https://sw.kovidgoyal.net/kitty/).

---

# 3. Script to close projects

Here, we are concerned with the sessions that are now opened and that we might want to close. In a similar fashion as what we did to open projects, we want to kill them with a script that will run Rofi and do the job silently in the background. One such script that will get us there is shown below:

```{.bash}
#!/bin/bash

# Get the name of all running sessions
TMUX_SESSIONS=`tmux ls | cut -f1 -d ":"`

# No listed session, then notify about it
if [ -z "$TMUX_SESSIONS" ]; then
    notify-send "No active tmux session found"
    exit 0
fi

# Show all running sessions with Rofi and store the selection in a variable
SESSION=`echo $TMUX_SESSIONS | rofi -sep ' ' -i -dmenu -theme purple -font 'JetBrainsMono 14' \
    -width 90 -show window`

# Kill the selected session
tmux kill-session -t $SESSION
```

In this case, the usage is quite straightforward: only running sessions are shown, so it's just a matter of choosing the one we want to kill or pressing the `Escape` key to abort the Rofi pop-up.

---

# Example workflow

It's a matter of setting up keyboard shortcuts to run the scripts to open and kill projects. For instance, one such configuration for the `i3` window manager would be as follows:

```{.bash}
bindsym $mod+Mod1+p    $exec ~/path/to/projects-start.sh
bindsym $mod+Mod1+k    $exec ~/path/to/projects-kill.sh
```

- A simple shortcut lets us choose sessions to open.
- Next, if we decide to kill a session at some point, we have another shortcut to do that.

---

# Conclusion

Far from being a perfect solution (although it already feels comfortable as a main driver), this workflow initiates what I think can lead to substantial optimizations when it comes to using tmux. There's room for improvement when a user selects an already opened session: ideally, we would just switch to that session automatically. These details need to be implemented based on the window manager that's being used, but suffice to say, it can be done! In any case, I hope this may give you a semblance of inspiration to take this idea to the next level. There are tools to help with session persistence, such as [tmux-resurrect](https://github.com/tmux-plugins/tmux-resurrect), but that's a topic for another time.

## More resources and references

- [Best Terminal Application for Web Development](https://www.youtube.com/watch?v=GuH7pw9LejY), original inspiration for this workflow. — Monsterlessons Academy, YouTube.
- [The tmux wiki](https://github.com/tmux/tmux/wiki), GitHub.
- [tmux-resurrect](https://github.com/tmux-plugins/tmux-resurrect), GitHub.
