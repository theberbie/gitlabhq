import axios from '~/lib/utils/axios_utils';

const DEFAULT_LIMIT = 20;

export default class UserOverviewBlock {
  constructor(options = {}) {
    this.container = options.container;
    this.url = options.url;
    this.requestParams = {
      limit: DEFAULT_LIMIT,
      ...options.requestParams,
    };
    this.postRenderCallback = options.postRenderCallback;
    this.loadData();
  }

  loadData() {
    const loadingEl = document.querySelector(`${this.container} .loading`);

    loadingEl.classList.remove('hide');

    axios
      .get(this.url, {
        params: this.requestParams,
      })
      .then(({ data }) => this.render(data))
      .catch(() => loadingEl.classList.add('hide'));
  }

  render(data) {
    const { html, count } = data;
    const containerEl = document.querySelector(this.container);
    const contentList = containerEl.querySelector('.overview-content-list');

    contentList.innerHTML += html;

    const loadingEl = containerEl.querySelector('.loading');

    if (count && count > 0) {
      containerEl.querySelector('.js-view-all').classList.remove('hide');
    } else {
      const nothingHereBlock = containerEl.querySelector('.nothing-here-block');

      if (nothingHereBlock) {
        nothingHereBlock.classList.add('text-left', 'p-0');
      }
    }

    loadingEl.classList.add('hide');

    if (this.postRenderCallback) {
      this.postRenderCallback.call(this);
    }
  }
}