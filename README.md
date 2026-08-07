# `sysarcher`'s Blog

My blog built with [Hugo](https://gohugo.io) and the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme, deployed to GitHub Pages.

## Local development

The dev environment is managed with [flox](https://flox.dev):

```sh
flox activate -- hugo server -D
```

Then open http://localhost:1313.

## Content

- Posts live in `content/posts/` (one markdown file per post, with the publish date in front matter).
- New post: `flox activate -- hugo new posts/my-post.md`
- The `themes/PaperMod` theme is pinned as a git submodule.

## Deployment

Pushing to `master` triggers `.github/workflows/hugo.yml`, which builds the site and deploys it to GitHub Pages.
