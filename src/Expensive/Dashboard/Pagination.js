import React from "react";

const linkWindow = 3;
const edgeLinks = 3;

export default class Pagination extends React.Component {
  get currentPage() { return this.props.pages.current; }
  get totalPages() { return this.props.pages.total; }
  get pageLinks() { return this.props.pages.links; }

  render() {
    if(this.totalPages == 1) return null;

    return (
      <nav className="dashboard-pagination">
        {this.startLink()}
        {this.prevLink()}
        {this.links()}
        {this.nextLink()}
        {this.endLink()}
      </nav>
    );
  }

  startLink() {
    if(this.currentPage == 1)
      return null;
    return this._linkToPage(1, "\u00ab", "start-1");
  }

  prevLink() {
    const previous = this.currentPage - 1;
    if(previous < 1)
      return null;
    return this._linkToPage(previous, "\u2039", `prev-${previous}`);
  }

  nextLink() {
    const next = this.currentPage + 1;
    if(next > this.totalPages)
      return null;
    return this._linkToPage(next, "\u203a", `next-${next}`);
  }

  endLink() {
    const page = this.totalPages;
    if(this.currentPage == this.totalPages)
      return null;
    return this._linkToPage(page, "\u00bb", `end-${page}`);
  }

  links() {
    if(this.totalPages == 1) { return this._singlePageLink(); }
    const startWindow = _.clamp(this.currentPage - linkWindow, 1,
      this.currentPage);
    const endWindow = _.clamp(this.currentPage + linkWindow, this.currentPage,
      this.totalPages);
    const difference = endWindow - startWindow + 1;

    return (
      <span className="dashboard-pagination-inner">
        {this._innerStartLinks()}
        {_.times(difference, (i) => {
          const page = startWindow + i;
          return this._linkToPage(page);
        })}
        {this._innerEndLinks()}
      </span>
    );
  }

  _singlePageLink() {
    return (
      <span className="dashboard-pagination-inner">
        {this._linkToPage(1)}
      </span>
    );
  }

  _innerStartLinks() {
    if(this.currentPage <= (linkWindow + 1)) { return null; }
    const lowerBound = this.currentPage - linkWindow + 1;
    const links = _.clamp(lowerBound, 1, edgeLinks);
    const skips = lowerBound > edgeLinks;

    return (
      <span>
        {_.times(links, (i) => this._linkToPage(i + 1)) }
        {skips ? this._seperator() : ""}
      </span>
    );
  }

  _innerEndLinks() {
    const lowerBound = this.totalPages - this.currentPage - linkWindow;
    if(lowerBound <= 0) { return null; }
    const numberOfLinks = _.clamp(lowerBound, 1, edgeLinks);
    const skips = lowerBound > edgeLinks;
    const linkIteration = _(_.times(numberOfLinks).reverse());

    return (
      <span>
        {skips ? this._seperator() : ""}
        {linkIteration.map((i) => this._linkToPage(this.totalPages - i)).value()}
      </span>
    );
  }

  _seperator() {
    return (<i className="dashboard-pagination-seperator">...</i>);
  }

  _linkToPage(page, text = page, key = page) {
    return (
      <a data-page={page} key={key} className="dashboard-pagination-link"
        onClick={(event) => this.props.onChangePage(event, page)}>{text}</a>
    );
  }
}

Pagination.propTypes = {
  pages: React.PropTypes.object.isRequired,
  page: React.PropTypes.number.isRequired,
  onChangePage: React.PropTypes.func.isRequired
}

