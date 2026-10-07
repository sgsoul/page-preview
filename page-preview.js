const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: block;
      margin: 16px 0;
      font-family: Arial, sans-serif;
    }

    .card {
      max-width: 400px;
      padding: 16px;
      border: 1px solid #b700ff;
      border-radius: 8px;
    }

    a {
      display: block;
      color: #9400b6;
      overflow-wrap: anywhere;
    }

    p {
      margin: 12px 0 0;
    }
  </style>

  <div class="card">
    <a part="link">Page link</a>

    <p>
      Title:
      <span part="title">Название отсутствует</span>
    </p>

    <p>
      Heading:
      <span part="heading">Заголовок отсутствует</span>
    </p>

    <p class="message"></p>
  </div>
`;

export class PagePreview extends HTMLElement {
  static get observedAttributes() {
    return ['src'];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));

    this.link = shadow.querySelector('[part="link"]');
    this.titleElement = shadow.querySelector('[part="title"]');
    this.heading = shadow.querySelector('[part="heading"]');
    this.message = shadow.querySelector('.message');

    this.requestNumber = 0;
  }

  connectedCallback() {
    this.loadPage();
  }

  disconnectedCallback() {
    this.requestNumber++;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.isConnected) {
      this.loadPage();
    }
  }

  setStatus(status, message) {
    this.setAttribute('data-status', status);
    this.message.textContent = message;
  }

  async loadPage() {
    this.requestNumber++;
    const currentRequest = this.requestNumber;

    const src = this.getAttribute('src');

    this.link.removeAttribute('href');
    this.link.textContent = 'Page link';
    this.titleElement.textContent = 'Название отсутствует';
    this.heading.textContent = 'Заголовок отсутствует';

    if (!src || src.trim() === '') {
      this.setStatus('error', 'Page URL is missing.');
      return;
    }

    this.setStatus('loading', 'Loading...');

    try {
      const url = new URL(src, this.ownerDocument.location.href);

      this.link.href = url.href;
      this.link.textContent = url.href;

      const response = await fetch(url.href);

      if (!response.ok) {
        throw new Error('Failed to load the page.');
      }

      const html = await response.text();

      if (!this.isConnected || currentRequest !== this.requestNumber) {
        return;
      }

      const parser = new DOMParser();
      const page = parser.parseFromString(html, 'text/html');

      const title = page.title.trim();
      const firstHeading = page.querySelector('h1');

      let heading = '';

      if (firstHeading) {
        heading = firstHeading.textContent.trim();
      }

      if (title !== '') {
        this.titleElement.textContent = title;
        this.link.textContent = title;
      }

      if (heading !== '') {
        this.heading.textContent = heading;
      }

      this.setStatus('ready', 'Page loaded.');
    } catch (error) {
      if (!this.isConnected || currentRequest !== this.requestNumber) {
        return;
      }

      this.setStatus('error', 'Could not load the page.');
    }
  }
}

if (!customElements.get('page-preview')) {
  customElements.define('page-preview', PagePreview);
}
