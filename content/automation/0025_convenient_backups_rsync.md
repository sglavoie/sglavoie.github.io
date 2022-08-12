Title: Convenient and lightning fast backups with rsync
Date: 2021-07-31 9:01
Tags: backup, python, rsync, script, terminal
Slug: convenient-and-lightning-fast-backups-with-rsync
Authors: Sébastien Lavoie
Summary: Cloud storage became affordable a long time ago while internet connection speeds have increased dramatically over the years. Yet, there is still a strong case to be made for daily backups of a whole system and for this purpose, there are few options to contend with `rsync`.
Description: Cloud storage became affordable a long time ago while internet connection speeds have increased dramatically over the years. Yet, there is still a strong case to be made for daily backups of a whole system and for this purpose, there are few options to contend with rsync.

[TOC]

---

# Introduction

Coming into its fourth year of existence and usage in production environments, this simple script has proven to be a fantastic ally. Despite the plethora of great options out there that have more bells and whistles, I have yet to find a single complaint about this solution as it hinges on the minimalist side, requiring only a working Python 3 installation along with the powerful `rsync` command-line tool.

It's one of those pieces of code that perform some really basic tasks that can be scheduled with [`cron`](https://opensource.com/article/17/11/how-use-cron-linux) in the background, that one forgets about until a real need to access a backup comes up. This script is barely a Python wrapper calling `rsync` but still, I felt like sharing it for those who like uncomplicated setups. I've literally left this script alone for years some time after the release of Python 3.6 which was released back in December 2016 and it has been going strong since then mostly due to the fact it does not do much more than backing files up and leveraging `rsync`.

---

# Prerequisites

As briefly mentioned above, this tool uses [Python 3.6+](https://www.python.org/) and [`rsync`](https://rsync.samba.org/). That's it, really.

# Setting up the script

This script is being made [available on GitHub](https://github.com/sglavoie/dev-helpers/tree/main/rsync_backup) within a set of other small tools. To get the source code for this particular tool, you can either [clone the whole repository](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository-from-github/cloning-a-repository), get the content of the files separately or simply copy and paste [the current version from below](#the-script). You will need a `settings.json` file as well as the Python script that will run the necessary commands.

## The configuration file

Right off the bat, you will most probably want to update the array of strings for the `data_sources` key as well as the string for the key `data_destination` in the following JSON file.

```{.json}
{
    "data_sources": [
        "/home/sglavoie"
    ],
    "data_destination": "/media/sglavoie/Elements",
    "terminal_width": 40,
    "sep": "=-",
    "log_name": ".backup_log_",
    "log_format": "%y%m%d_%H_%M_%S",
    "rsync_options": [
        "-vaAHh",
        "--delete",
        "--ignore-errors",
        "--force",
        "--prune-empty-dirs",
        "--delete-excluded"
    ],
    "backup_exclude": ".backup_exclude"
}
```

By default, the following options are passed to `rsync`:

| Option               | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `-vaAH`              | verbose, archive, ACLs, hard-links (preserve)        |
| `--delete`           | _"delete extraneous files from destination dirs"_    |
| `--ignore-errors`    | _"delete even if there are I/O errors"_              |
| `--force`            | _"force deletion of directories even if not empty"_  |
| `--prune-empty-dirs` | _"prune empty directory chains from the file-list"_  |
| `--delete-excluded`  | _"also delete excluded files from destination dirs"_ |

### Description of available settings

| Name of setting    | Description                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `data_sources`     | Directories to backup, supplied as a list of strings (no slash at the end).                                                                |
| `data_destination` | Single destination of the files to backup, supplied as a string. This can be overridden when passing option `-d` or `--dest` to the script |
| `terminal_width`   | Line length in the terminal, used for printing separators.                                                                                 |
| `sep`              | Separator to use along with `terminal_width`.                                                                                              |
| `log_name`         | Sets the prefix of the log filename.                                                                                                       |
| `log_format`       | This goes right after `log_name` as a suffix.                                                                                              |
| `rsync_options`    | Options to use with rsync as a list of strings.                                                                                            |
| `backup_exclude`   | Default file in each source in `data_sources` where files/directories will be ignored.                                                     |

## The script

```{.python}
"""
Script that uses `rsync` to make a simple and convenient backup.
Note: requires Python 3.6+. No other Python third-party libraries required.
"""
import argparse
import datetime
import glob
import json
import os
import pathlib
import subprocess


def run_backup():
    """This is where all the action happens!"""
    settings = get_settings()

    # initiate the parser
    parser = argparse.ArgumentParser("backup")
    parser.add_argument(
        "-c",
        "--clear",
        help="Delete all log files for current source in DATA_SOURCES.",
        action="store_true",
    )
    parser.add_argument(
        "-s",
        "--src",
        dest="source",
        default=None,
        help="Specify an alternative source to backup as a string.",
        action="store",
    )
    parser.add_argument(
        "-d",
        "--dest",
        dest="destination",
        default=None,
        help="Specify an alternative destination for backup as a string.",
        action="store",
    )

    # read arguments from the command line
    arguments = parser.parse_args()

    # check for --source or -s
    # Replace potential list of sources to backup with this one
    if arguments.source is not None:
        if os.path.isdir(arguments.source):
            settings["data_sources"] = [arguments.source]
        else:
            print("Please enter a valid source to backup.")
            exit(0)

    # check for --clear or -c
    if arguments.clear:
        clear_logs(
            data_sources=settings["data_sources"],
            log_name=settings["log_name"],
        )

    # check for --dest or -d
    # Replace destination to backup with this one
    if arguments.destination is not None:
        if os.path.isdir(arguments.destination):
            settings["data_destination"] = arguments.destination
        else:
            print("Please enter a valid destination.")
            exit(0)

    # don't run the script if the destination doesn't exist
    if not os.path.isdir(settings["data_destination"]):
        print(
            f"The destination doesn't exist.\n({settings['data_destination']})"
        )
        exit(0)

    backup_all_sources(settings)


def backup_all_sources(settings: dict) -> None:
    """Iterate over all sources to backup."""
    for source in settings["data_sources"]:
        date_now = datetime.datetime.now()
        log_format = datetime.datetime.strftime(
            date_now, settings["log_format"]
        )
        log_filename = f"{source}/{settings['log_name']}{log_format}"
        log_option = f"--log-file={log_filename}"

        backup_source = settings["backup_cmd"].copy()
        backup_source.extend([log_option])

        # files to ignore in backup
        exclude_file = f"{source}/{settings['backup_exclude']}"

        if os.path.exists(exclude_file):
            exclude_option = f"--exclude-from={exclude_file}"
            backup_source.extend(
                [exclude_option, source, settings["data_destination"]]
            )
        else:
            # skips '--exclude-from' option if no file is found
            backup_source.extend([source, settings["data_destination"]])

        settings["source"] = source
        settings["backup_source"] = backup_source
        settings["log_filename"] = log_filename

        try:
            backing_source(settings)
        except KeyboardInterrupt:
            print("\nKeyboardInterrupt: Exiting operations.")
            exit(0)


def backing_source(settings: dict) -> None:
    """Print information to STDOUT and to `log_filename` and executes the
    rsync command."""
    print(settings["sep"] * settings["terminal_width"])

    cmd_executed = " ".join(settings["backup_source"])
    msg_executed = f"Command executed:\n{cmd_executed}\n"
    print(msg_executed)

    with open(settings["log_filename"], mode="w") as log_file:
        log_file.write(f"{msg_executed}\n")

    try:
        child = subprocess.Popen(settings["backup_source"])
        _ = child.communicate()[0]  # call communicate to get the return code
        rc = child.returncode
    except FileNotFoundError:
        print(f"FileNotFoundError: Is the `rsync` tool installed?")
        exit(1)

    print(f"\nBackup completed for: {settings['source']} (return code: {rc})")
    print(settings["sep"] * settings["terminal_width"])


def clear_logs(data_sources: list, log_name: str) -> None:
    """Clears log files for each source specified in SETTINGS."""
    for source in data_sources:
        # Retrieve a list of all matching log files in `source`
        log_files = glob.glob(f"{source}/{log_name}*")
        if log_files == []:
            print(f"\nThere is no log file to delete in {source}.")
            exit(0)
        else:
            print(f"Log files in {source}:")
            for log_file in log_files:
                print(log_file)
            if user_says_yes():
                for log_file in log_files:
                    os.remove(log_file)
                print("Log files deleted.")
        print("Exiting script...")
        exit(0)


def user_says_yes(
    msg: str = "\nDo you want to delete log files for this source? (y/n) ",
) -> bool:
    """Asks the user to enter either "y" or "n" to confirm. Returns boolean."""
    choice = None
    while choice is None:
        user_input = input(msg)
        if user_input.lower() == "y":
            choice = True
        elif user_input.lower() == "n":
            choice = False
        else:
            print('Please enter either "y" or "n".')
    return choice


def get_settings() -> dict:
    """
    Get the settings from `settings.json`.

    Returns:
        dict: Containing all settings used by the tool.
    """
    directory = pathlib.Path(__file__).parent.absolute()
    with open(directory / "settings.json") as fp:
        settings = json.load(fp)

    backup_cmd = ["rsync"]
    backup_cmd.extend(settings["rsync_options"])
    settings["backup_cmd"] = backup_cmd

    return settings


if __name__ == "__main__":
    run_backup()
```

---

# How to use

## One-time setup

1. Set all values in `settings.json` to suit your needs.
2. Make sure that the backup destination is available/mounted. A simple warning will be echoed if the destination can't be found.
3. Call the Python script. As an example, if it's located at `/home/user/backup/rsync_backup.py`, then you could put the following alias in `~/.bash_aliases` (or equivalent)\*:

```{.bash}
alias backup='python3 /home/user/backup/rsync_backup.py'
```

\* Python may be called differently on your system, e.g. simply `python` instead of `python3`.

In this instance, the script can now be executed in a terminal with the keyword `backup` along with optional arguments.

## Using as a daily driver

Make sure the destination to back files up is available/mounted and simply call the script (e.g. `backup` in this example).

The output will look something like this:

```{.bash}
$ backup
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
Command executed:
rsync -vaAHh --delete --ignore-errors --force --prune-empty-dirs \
    --delete-excluded --log-file=/home/sglavoie/.backup_log_210731_09_28_09 \
    --exclude-from=/home/sglavoie/.backup_exclude /home/sglavoie /tmp

building file list ... done
deleting sglavoie/.backup_log_210731_08_47_24
sglavoie/
sglavoie/.bash_aliases
...
```

## Avoid deleting files at the destination

The `rsync` command first builds a list of the files that are part of the backup and will go on adding new files, updating existing files as well as removing files that are found in the destination but not in the source anymore according to the default list of flags passed to it in this implementation. It is therefore important to note that **if you would like to back up files in the destination that no longer exist in the source**, a convenient solution is simply to create a new folder at the root level inside the destination directory and manage those files separately.

For instance, I sometimes want to back up large video files but there is rarely a need to update them. In this case, it would be possible to add the directories to exclude in the file `.backup_exclude` (default configuration option) like so:

```{text}
Videos/
Dropbox/other/folder/
```

Then, these directories will be ignored when backing up the source (if they are nested inside the source directory to start with!). If the destination is set to `/media/user/backup` and the source set to `/home/user/my_folder`, then the script would recreate the "root" directory of the source if it doesn't exist on the destination:

```{.bash}
$ ls /media/user/backup
my_folder
```

You could keep track of those heavy files that do not need to be backed up frequently by putting them manually next to `my_folder` in `/media/user/backup`. This will lead to huge speed ups when running the script if you track many files in this way!

---

# Conclusion

This was a quick overview of what `rsync` can offer: I neither touched upon its remote syncing capabilities nor the vast majority of its options, for which you can find a lot more information about by typing `man rsync` to display the manual page in the terminal.

Without making use of any fancy features of recent versions of Python or `rsync`, I have found this simple backup procedure to have worked flawlessly for a long time. Hardware inevitably fails at some point and after having heard about countless examples of people losing some or all of their most precious files (including my own story...), I have come to enjoy backing my system with this little script.

I wouldn't trust my external drive to last forever either, hence I also rely on Dropbox and Google Drive for documents I find are a good fit. But overall, I just do not tend to back up every single system file in the cloud, so there is still a convincing use case where daily and complete backups become a possibility when using a fast approach like `rsync` to incrementally save snapshots.

## More resources and references

- [rsync official website](https://rsync.samba.org/) – samba.org.
- [Keeping Linux files and directories in sync with rsync](https://www.redhat.com/sysadmin/sync-rsync) – RedHat, going through the main options offered by the tool.
- [How To Use Rsync to Sync Local and Remote Directories](https://www.digitalocean.com/community/tutorials/how-to-use-rsync-to-sync-local-and-remote-directories) – DigitalOcean, demoing how to use the tool and covering the case of remote file access.
