Title: Git worktrees for a better parallel workflow
Date: 2023-01-02 9:52
Tags: git, terminal
Slug: git-worktrees-for-a-better-parallel-workflow
Authors: Sébastien Lavoie
Summary: Git leads to a wealth of discoveries. Once [SSH and GPG are set up]({filename}/workflow/0023_setting_up_ssh_git_multiple_accounts.md), once [dotfiles are under control]({filename}/workflow/0024_managing_dotfiles_with_git_bare_repo.md) and a reasonable [Git workflow has been adopted]({filename}/workflow/0029_git_the_gist.md), there's still room to be amazed by a feature like Git worktrees!
Description: Git leads to a wealth of discoveries. Once SSH and GPG are set up, once dotfiles are under control and once a reasonable Git workflow has been adopted, there's still room to be amazed by something like Git worktrees!

[TOC]

---

# Introduction

Why are Git worktrees needed in the first place? Well, there are certainly a couple of different use cases where they come in handy, but the reason they exist is to allow a developer to check out multiple branches at once without having to do any kind of cleanup when switching branches. Introduced back in [2015 in Git 2.5](https://github.blog/2015-07-29-git-2-5-including-multiple-worktrees-and-triangular-workflows/), it's certainly not a new feature anymore, yet it seems like its adoption really took off more recently. I was an avid user of [`git stash`](https://git-scm.com/docs/git-stash) but I often got myself cornered in some specific situations where it was not as convenient as I thought it was... and [`git worktree`](https://git-scm.com/docs/git-worktree) was for me a pretty good solution without much overhead.

# Why is `git stash` not enough?

It _can_ be enough, but there are edge cases where it falls short of its promise of keeping stuff neatly around without too much fuss.

## Switching context

One particular use case in favor of `git worktree` is when you have to quickly switch context and you have a dirty branch checked out -- which is basically the same use case advertised in the [Git documentation](https://git-scm.com/docs/git-worktree#_examples). Committing changes away might be a bit risky if those aren't ready to be pushed to the remote server and stashing files might be annoying because there could be newer files to include with `git stash --include-untracked` or some files already staged in the middle of the work where a `git stash --keep-index` is also appropriate, or maybe even a case where you have created temporary files that match ignored files where `git stash --all` might do. It gets even messier if you want to leave things in a clean state with only the changes you need with `git stash --patch` where it would be needed to select interactively all your hunks. And then, you might already have multiple stashes or you might have forgotten to give one or more stash(es) a name, which makes it harder to `git stash pop` or `git stash apply` your changes later without having to inspect the content of your stashes with something like `git stash show -p`.

With `git worktree`, this is no longer an issue! If you don't already have a new worktree you can switch to, creating one with `git worktree add` is quick and easy, as shown in the docs:

```{.bash}
git worktree add -b emergency-fix ../temp master
```

This will create a branch named `emergency-fix`, creating a new worktree at `../temp` checking the branch `emergency-fix` that will be based off the `master` branch. Then, you would switch to that branch which is managed with a new worktree by changing directory into it (or `pushd ../temp` to put the directory into a stack so you can come back later to your current branch with `popd`). You would add changes and commit them, likely pushing them to a remote, then you could resume your work by going back to the original directory for your `master` branch. Now, you could leave behind the `emergency-fix` branch but if that was meant as a temporary one, you could just delete the worktree with `git worktree remove ../temp`. Besides being removed by path, worktrees can also be removed by the name they are associated with, which is the branch name shown in square brackets when issuing the command `git worktree list`.

Arguably, it's not too hard to see that dealing with temporary changes in this way is a lot more straightforward since the current changes can be left intact without having to commit or stash them.

## Running tasks in the background

Whether that be running a test suite that takes a while to execute or leaving the build of a system untouched while it is happening (like building a Docker image), it can be really useful to go work on something else while leaving the original task in the background. More than this, it allows one to go on another branch and make changes to the repository while files from the other branch are being accessed. In the case of building a Docker image for instance, it could cause hard-to-find bugs if the build is stopped or failed and meanwhile files were modified in the repo on the same branch to then be copied back in the next build of the Docker image only to realize that the files being copied have changed prior to being copied.

More generally though, I find I just like to leave my terminal windows open into a specific path (branch) while having the freedom to go work elsewhere. This way, a virtual environment (for instance, in Python) can be left "activated" and ready to use when context is switched again. Often, different branches in a project might have slightly different requirements and so a distinct virtual environment must be activated. Having them entirely separated by path in separate worktrees makes this kind of workflow a lot simpler to manage.

---

# How I operate worktrees

## First, other approaches in the wild

I have seen some great programmers use them within a "[bare repository](https://git-scm.com/docs/git-clone#Documentation/git-clone.txt---bare)", notably **ThePrimeagen** in his YouTube video titled [Git's Best And Most Unknown Feature](https://www.youtube.com/watch?v=2uEqYw-N8uE). This works by creating different directories inside the bare repository, effectively having all worktrees at the same level. There is a slight chance of colliding with a reserved directory name by Git, though, since all the metadata is stored there too.

Another interesting approach I've witnessed is the use of a `.worktrees` directory inside the directory containing the main branch of the project, which works by adding a match for `.worktrees/` in a global `.gitignore` file (kudos to **Redhwan Nacef** in his [Git Worktree Tutorial](https://www.youtube.com/watch?v=4_p1OdLeDLE)!). I like this approach because it can list all working trees anyways with `git worktree list` and there's nothing really cluttering the directory structure. However, there might be some huge build files or environments and nesting everything that way might require creating a script to find all worktrees as it is not immediately obvious where they would be stored, if at all.

## What I actually do these days

The approach I have adopted is very simple and requires almost no setup at all.

### Starting with a project with existing branches

Assuming a project is already cloned and worked on with no additional worktrees, then it leads to a minor hiccup because the project will need to be renamed. So what I currently do is create a top-level directory for the project, say `sglavoie.github.io` for this website. Then, I will literally reuse the branch name to create some hierarchy inside that project. Let's say that right now, I'm writing multiple articles in different branches and I keep my `main` branch as always, then I would first `mkdir sglavoie.github.io/main` and put the project's content in there with its `.git` folder. Mind you, this is a one-time thing when not already using worktrees!

At this stage, the project structure is laid out nicely and ready to accommodate new worktrees. So for instance, if I want to work on a new branch to create a new article without touching the `main` branch, I would `git worktree add ../articles/article-name-here article-name-here` from the `main` branch and voilà, a new worktree will be ready to use. Once a couple of worktrees are created in this way, the directory structure might look as follows:

```{.text}
~/dev/sglavoie/sglavoie.github.io
├── articles
│   ├── adv-web-dev-social-network-app
│   ├── git-worktree
│   ├── react-native-app
│   └── text-based-diagrams
└── main
```

In this way, it's just a matter of changing directory and opening the worktree in your editor of choice (e.g., `nvim` for neovim or `code .` with VS Code). From now on, it's easy to switch between branches of a project right from the editor by searching for the "topic" (e.g., `main` or `articles` in this case, but that could be `hotfix` or `feat` depending on how your name your branches) or for a project name directory, which would show all the branches that have been opened previously to allow further filtering. This is what `git worktree list` would display in this example:

```{.text}
/some/path/sglavoie.github.io/main                                     d67dd8d2 [main]
/some/path/sglavoie.github.io/articles/adv-web-dev-social-network-app  666a0b43 [articles/adv-web-dev-social-network-app]
/some/path/sglavoie.github.io/articles/git-worktree                    d67dd8d2 [git-worktree]
/some/path/sglavoie.github.io/articles/react-native-app                bcfac34e [articles/react-native-app]
/some/path/sglavoie.github.io/articles/text-based-diagrams             4b25371d [articles/text-based-diagrams]
```

### New worktrees from a project already using worktrees

If you've already embraced this approach, then the next time you want to create a worktree, it will just be a matter of switching to the "base" branch you want to create a worktree from and creating one at whatever location you fancy outside the current directory. For instance, for this article:

```{.bash}
git worktree add ../articles/git-worktree articles/git-worktree
```

This would take care of using the branch name "nesting" convention (e.g., `feat/feature-name`, `hotfix/bug-name`, etc.) and create sub-directories as needed too. Assuming a worktree has been merged in another branch and/or is no longer necessary, it can be removed with `git worktree remove git-worktree` in this example (where `git-worktree` is the name given to the worktree... a bit confusing here, you're right).

### Keeping worktrees around

Although the official Git documentation presents a useful case for a temporary fix where the worktree is almost immediately deleted upon the completion of a task, I have found myself in a situation where I'd rather have multiple longstanding worktrees. For example, I regularly need to boot a web application from a different branch, either because the currently checked out branch does not have the necessary requirements installed or because I want to leave a web application running in the background without affecting my current work. In my case, I use it to process some data when it arrives and come back to the work I was doing earlier, doing practically the same thing shown in the Git docs but keeping the worktree around for future use.

On a large project, I might have a couple of worktrees, but still I would keep branches around without them being part of worktrees when these are meant to be short-lived feature branches that share the same dependencies as other branches as long as they won't need to be checked out at the same time. Another time I might have separate branches like this could be to avoid having to duplicate gigantic `node_modules` or `.venv` directories when not needed, because working with different worktrees is pretty much like cloning an entire repository in a separate folder and having to reinstall requirements. There is also a nice Git feature where worktrees are prefixed with a plus sign when issuing `git branch`, so that makes them distinctly different from regular branches:

```{.bash}
$ git branch
+ articles/react-native-app   # worktree
  gh-pages                    # other regular branch
+ git-worktree                # worktree
* main                        # currently checked out
```

---

# Conclusion

I have briefly touched upon a downside of worktrees, which is that it's almost like cloning over and over a repository, which can take up a lot of disk space with large projects. Nevertheless, this is a tradeoff I am entirely willing to make given the advantages Git worktrees bring with them! If you're not already using them, maybe this little post might have inspired you to give them a go!

## Resources and references

### External links

- [Git 2.5, including multiple worktrees and triangular workflows - github.blog](https://github.blog/2015-07-29-git-2-5-including-multiple-worktrees-and-triangular-workflows/)
- [`git-stash` - git-scm.com](https://git-scm.com/docs/git-stash)
- [`git-worktree` - git-scm.com](https://git-scm.com/docs/git-worktree)
- [`git-worktree` / Examples - git-scm.com](https://git-scm.com/docs/git-worktree#_examples)
- [`git-clone` on `--bare` - git-scm.com](https://git-scm.com/docs/git-clone#Documentation/git-clone.txt---bare)
- [Git's Best And Most Unknown Feature - ThePrimeagen, YouTube](https://www.youtube.com/watch?v=2uEqYw-N8uE)
- [Git Worktree Tutorial -  Redhwan Nacef, YouTube](https://www.youtube.com/watch?v=4_p1OdLeDLE)

### From this website

- [Git the gist of it: common commands for a working workflow]({filename}/workflow/0029_git_the_gist.md)
- [Managing dotfiles with a Git bare repository]({filename}/workflow/0024_managing_dotfiles_with_git_bare_repo.md)
- [Setting up SSH and Git for Multiple Accounts]({filename}/workflow/0023_setting_up_ssh_git_multiple_accounts.md)
