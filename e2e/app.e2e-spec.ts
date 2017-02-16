import { SanityPage } from './app.po';

describe('sanity App', function() {
  let page: SanityPage;

  beforeEach(() => {
    page = new SanityPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
