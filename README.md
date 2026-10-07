# page-preview

Web component that shows page title, its first h1, and link.

## Install

```bash
npm install @iv.loskutova/page-preview
```

## Use

Import package in project with bundler or import map:

```javascript
import '@iv.loskutova/page-preview';
```

Add component to HTML:

```html
<page-preview src="./example.html"></page-preview>
```

Component is registered automatically.

## How it works

- `src` is page URL
- Changing `src` loads new page
- `data-status` is `loading`, `ready`, or `error`
- Missing titles and headings show fallback text
- Page must allow browser fetch requests

## Local demo

Run command from project folder:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000/demo/ in your browser.
