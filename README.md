# Markdown-based Website

## will run using Jekyll
[notes](https://github.com/gsarchive/markdown/blob/master/README.md)

Files in this repository are considered authoritative. The corresponding HTML
files will be rebuilt as needed, and should not be manually edited. Any file
in the main web site directory which does NOT have a corresponding Markdown
file here is its own entity and is authoritative.

To build and test locally:

* Install Ruby
* `gem install bundler`
* `bundle install` (or `bundle install --path vendor/bundle`)
* `bundle exec jekyll serve`

It should auto-detect changes to Markdown or layout files.

## Basic Git commands

1. `git pull` to get latest updates from remote
2. `git add <file path>` to add a new file (like an image)
 - `git add images` will add all new images in one stroke. Still need to commit, though.
3. `git commit -a` to commit all changes.
4. `git commit <file path>` to commit just one file (or multiple)
5. `git push` to push to remote and deploy to Github Pages
6. `git checkout dev` to work with development branch
7. `git checkout main` to work with main branch
8. `git merge dev` from main to merge in changes made in dev
9. `git merge main` from dev to merge in changes made in main

## Discography

To automatically open a specific gallery item, you can specify the "set" and "entry" by number in the URL:

https://Sites Unlimited/discography.html?set=0&entry=0

Where `set=0` is the first/top set on the page. Entries for each set also begin at zero. You can use dev tools in the browser to inspect HTML if in doubt about which set and entry to specify.

Resizing images from the command line with `image magick`:
```
find . -name '*.jpg' -exec mogrify -scale 75% -density 72\> {} \;
find . -name '*.jpg' -exec mogrify -density 72\> {} \;
```
